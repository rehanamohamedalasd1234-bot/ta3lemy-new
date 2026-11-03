-- Facebook-style Ta3lemy news feed.
-- All signed-in Supabase identities may submit pending posts and comment on approved posts.
-- Moderation requires the existing server-verified feedback admin key; UI role checks are not trusted.

create table public.social_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  app_user_id text not null check (char_length(btrim(app_user_id)) between 1 and 160),
  author_name text not null check (char_length(btrim(author_name)) between 1 and 80),
  author_role text not null check (author_role in ('student', 'parent', 'teacher', 'owner')),
  content text not null default '',
  image_url text,
  video_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz,
  moderated_at timestamptz,
  moderated_by uuid references auth.users(id) on delete set null,
  constraint social_posts_content_length check (char_length(btrim(content)) <= 3000),
  constraint social_posts_has_content_or_media check (
    char_length(btrim(content)) > 0 or image_url is not null or video_url is not null
  ),
  constraint social_posts_image_url check (
    image_url is null or (
      char_length(image_url) <= 2048
      and image_url ~* '^https://res\.cloudinary\.com/[a-z0-9_-]+/image/upload/'
    )
  ),
  constraint social_posts_video_url check (
    video_url is null or (
      char_length(video_url) <= 2048
      and video_url ~* '^https://res\.cloudinary\.com/[a-z0-9_-]+/video/upload/'
    )
  )
);

create index social_posts_status_created_idx
  on public.social_posts (status, created_at desc);
create index social_posts_author_created_idx
  on public.social_posts (author_id, created_at desc);

create table public.social_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.social_posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  app_user_id text not null check (char_length(btrim(app_user_id)) between 1 and 160),
  author_name text not null check (char_length(btrim(author_name)) between 1 and 80),
  author_role text not null check (author_role in ('student', 'parent', 'teacher', 'owner')),
  content text not null check (char_length(btrim(content)) between 1 and 1000),
  created_at timestamptz not null default now()
);

create index social_comments_post_created_idx
  on public.social_comments (post_id, created_at asc);

alter table public.social_posts enable row level security;
alter table public.social_comments enable row level security;
revoke all on table public.social_posts from public, anon, authenticated;
revoke all on table public.social_comments from public, anon, authenticated;

grant select (id, author_id, author_name, author_role, content, image_url, video_url, status, created_at, updated_at, approved_at)
  on table public.social_posts to authenticated;
grant insert (author_id, app_user_id, author_name, author_role, content, image_url, video_url)
  on table public.social_posts to authenticated;
grant select (id, post_id, author_name, author_role, content, created_at)
  on table public.social_comments to authenticated;
grant insert (post_id, author_id, app_user_id, author_name, author_role, content)
  on table public.social_comments to authenticated;

create policy social_posts_read_approved_or_own
  on public.social_posts for select to authenticated
  using (status = 'approved' or author_id = (select auth.uid()));

create policy social_posts_submit_pending_only
  on public.social_posts for insert to authenticated
  with check (author_id = (select auth.uid()) and status = 'pending');

create policy social_comments_read_approved_posts
  on public.social_comments for select to authenticated
  using (exists (
    select 1 from public.social_posts as p
    where p.id = social_comments.post_id and p.status = 'approved'
  ));

create policy social_comments_submit_to_approved_posts
  on public.social_comments for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and exists (
      select 1 from public.social_posts as p
      where p.id = social_comments.post_id and p.status = 'approved'
    )
  );

create or replace function public.social_admin_list(p_admin_key text, p_status text default 'pending')
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_result jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_status not in ('pending', 'approved') then
    raise exception 'Invalid status' using errcode = '22023';
  end if;
  if p_admin_key is null or char_length(p_admin_key) < 32 or not exists (
    select 1 from public.feedback_admin_secrets as s
    where s.id = 1 and s.enabled
      and s.key_hash = pg_catalog.encode(
        extensions.digest(pg_catalog.convert_to(p_admin_key, 'UTF8'), 'sha256'), 'hex'
      )
  ) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  select coalesce(
    pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
      'id', items.id,
      'app_user_id', items.app_user_id,
      'author_name', items.author_name,
      'author_role', items.author_role,
      'content', items.content,
      'image_url', items.image_url,
      'video_url', items.video_url,
      'status', items.status,
      'created_at', items.created_at,
      'updated_at', items.updated_at,
      'approved_at', items.approved_at
    ) order by items.created_at desc),
    '[]'::jsonb
  ) into v_result
  from (
    select id, app_user_id, author_name, author_role, content, image_url, video_url,
           status, created_at, updated_at, approved_at
    from public.social_posts
    where status = p_status
    order by created_at desc
    limit 100
  ) as items;

  return v_result;
end;
$$;

create or replace function public.social_admin_edit(
  p_admin_key text,
  p_post_id uuid,
  p_content text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_post public.social_posts%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_admin_key is null or char_length(p_admin_key) < 32 or not exists (
    select 1 from public.feedback_admin_secrets as s
    where s.id = 1 and s.enabled
      and s.key_hash = pg_catalog.encode(
        extensions.digest(pg_catalog.convert_to(p_admin_key, 'UTF8'), 'sha256'), 'hex'
      )
  ) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;
  if p_content is null or char_length(btrim(p_content)) > 3000 then
    raise exception 'Post text is too long' using errcode = '22023';
  end if;

  update public.social_posts
  set content = btrim(p_content), updated_at = now()
  where id = p_post_id and status in ('pending', 'approved')
  returning * into v_post;
  if not found then
    raise exception 'Post not found' using errcode = 'P0002';
  end if;

  return pg_catalog.jsonb_build_object('id', v_post.id, 'content', v_post.content, 'status', v_post.status);
end;
$$;

create or replace function public.social_admin_decide(
  p_admin_key text,
  p_post_id uuid,
  p_action text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_post public.social_posts%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_admin_key is null or char_length(p_admin_key) < 32 or not exists (
    select 1 from public.feedback_admin_secrets as s
    where s.id = 1 and s.enabled
      and s.key_hash = pg_catalog.encode(
        extensions.digest(pg_catalog.convert_to(p_admin_key, 'UTF8'), 'sha256'), 'hex'
      )
  ) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  if p_action = 'delete' then
    delete from public.social_posts where id = p_post_id;
    if not found then raise exception 'Post not found' using errcode = 'P0002'; end if;
    return pg_catalog.jsonb_build_object('id', p_post_id, 'action', 'delete');
  elsif p_action = 'approve' then
    update public.social_posts
    set status = 'approved', approved_at = now(), moderated_at = now(), moderated_by = auth.uid(), updated_at = now()
    where id = p_post_id and status in ('pending', 'approved')
    returning * into v_post;
  elsif p_action = 'reject' then
    update public.social_posts
    set status = 'rejected', moderated_at = now(), moderated_by = auth.uid(), updated_at = now()
    where id = p_post_id and status in ('pending', 'approved')
    returning * into v_post;
  else
    raise exception 'Invalid action' using errcode = '22023';
  end if;

  if not found then raise exception 'Post not found' using errcode = 'P0002'; end if;
  return pg_catalog.jsonb_build_object('id', v_post.id, 'action', p_action, 'status', v_post.status);
end;
$$;

create or replace function public.social_admin_delete_comment(
  p_admin_key text,
  p_comment_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_admin_key is null or char_length(p_admin_key) < 32 or not exists (
    select 1 from public.feedback_admin_secrets as s
    where s.id = 1 and s.enabled
      and s.key_hash = pg_catalog.encode(
        extensions.digest(pg_catalog.convert_to(p_admin_key, 'UTF8'), 'sha256'), 'hex'
      )
  ) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  delete from public.social_comments where id = p_comment_id;
  if not found then raise exception 'Comment not found' using errcode = 'P0002'; end if;
  return pg_catalog.jsonb_build_object('id', p_comment_id, 'action', 'delete');
end;
$$;

revoke all on function public.social_admin_list(text, text) from public, anon;
revoke all on function public.social_admin_edit(text, uuid, text) from public, anon;
revoke all on function public.social_admin_decide(text, uuid, text) from public, anon;
revoke all on function public.social_admin_delete_comment(text, uuid) from public, anon;
grant execute on function public.social_admin_list(text, text) to authenticated;
grant execute on function public.social_admin_edit(text, uuid, text) to authenticated;
grant execute on function public.social_admin_decide(text, uuid, text) to authenticated;
grant execute on function public.social_admin_delete_comment(text, uuid) to authenticated;

comment on table public.social_posts is
  'Ta3lemy social news posts; only owner-key protected server functions can change moderation status.';
comment on table public.social_comments is
  'Comments on owner-approved Ta3lemy social news posts.';

notify pgrst, 'reload schema';
