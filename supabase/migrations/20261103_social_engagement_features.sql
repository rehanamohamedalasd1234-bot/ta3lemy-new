-- Replies, in-app notifications, and owner-only engagement analytics for Ta3lemy.
-- Notifications are stored in-app (not browser push); all identities use the current Supabase Auth session.

-- Add one-level replies beneath top-level comments.
alter table public.social_comments
  add column parent_comment_id uuid references public.social_comments(id) on delete cascade;
create index social_comments_parent_created_idx
  on public.social_comments (parent_comment_id, created_at asc)
  where parent_comment_id is not null;
grant select (parent_comment_id) on table public.social_comments to authenticated;
grant insert (parent_comment_id) on table public.social_comments to authenticated;

-- Enforce that replies belong to the same approved post and cannot nest beyond one level.
create or replace function public.social_validate_comment_parent()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_parent_post uuid;
  v_parent_parent uuid;
begin
  if not exists (
    select 1 from public.social_posts as p
    where p.id = new.post_id and p.status = 'approved'
  ) then
    raise exception 'Comments are only allowed on approved posts' using errcode = '42501';
  end if;
  if new.parent_comment_id is null then
    return new;
  end if;

  select c.post_id, c.parent_comment_id
    into v_parent_post, v_parent_parent
  from public.social_comments as c
  where c.id = new.parent_comment_id;
  if not found or v_parent_post is distinct from new.post_id then
    raise exception 'Reply must belong to the same post' using errcode = '23514';
  end if;
  if v_parent_parent is not null then
    raise exception 'Replies can only be added to top-level comments' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger social_comments_validate_parent
  before insert or update on public.social_comments
  for each row execute function public.social_validate_comment_parent();

-- Private in-app notifications; only the recipient can read or mark their own notifications.
create table public.social_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid references public.social_posts(id) on delete cascade,
  kind text not null check (kind in ('approved', 'reaction', 'comment', 'reply')),
  message text not null check (char_length(message) <= 240),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index social_notifications_recipient_created_idx
  on public.social_notifications (recipient_id, created_at desc);

alter table public.social_notifications enable row level security;
revoke all on table public.social_notifications from public, anon, authenticated;
grant select (id, recipient_id, post_id, kind, message, is_read, created_at)
  on table public.social_notifications to authenticated;
grant update (is_read) on table public.social_notifications to authenticated;
create policy social_notifications_read_own
  on public.social_notifications for select to authenticated
  using (recipient_id = (select auth.uid()));
create policy social_notifications_mark_own_read
  on public.social_notifications for update to authenticated
  using (recipient_id = (select auth.uid()))
  with check (recipient_id = (select auth.uid()));

-- The server inserts notifications only after a post becomes approved.
create or replace function public.social_notify_post_approved()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if old.status = 'pending' and new.status = 'approved'
     and new.author_id is distinct from auth.uid() then
    insert into public.social_notifications (recipient_id, post_id, kind, message)
    values (new.author_id, new.id, 'approved', 'وافق المالك على منشورك وأصبح ظاهرًا للجميع.');
  end if;
  return new;
end;
$$;
create trigger social_posts_notify_approved
  after update of status on public.social_posts
  for each row execute function public.social_notify_post_approved();

-- Notify a post author after another identity reacts; reaction removals do not notify.
create or replace function public.social_notify_post_reaction()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_recipient uuid;
  v_emoji text;
begin
  if tg_op = 'UPDATE' and old.reaction is not distinct from new.reaction then
    return new;
  end if;
  select p.author_id into v_recipient
  from public.social_posts as p
  where p.id = new.post_id and p.status = 'approved';
  if v_recipient is null or v_recipient = new.author_id then
    return new;
  end if;
  v_emoji := case new.reaction
    when 'like' then '👍' when 'love' then '❤️' when 'laugh' then '😂'
    when 'wow' then '😮' when 'clap' then '👏' else '✨' end;
  insert into public.social_notifications (recipient_id, post_id, kind, message)
  values (v_recipient, new.post_id, 'reaction', 'وصل تفاعل ' || v_emoji || ' إلى منشورك.');
  return new;
end;
$$;
create trigger social_reactions_notify_insert
  after insert on public.social_reactions
  for each row execute function public.social_notify_post_reaction();
create trigger social_reactions_notify_update
  after update of reaction on public.social_reactions
  for each row execute function public.social_notify_post_reaction();

-- Notify the post author on comments/replies and the parent commenter on replies.
create or replace function public.social_notify_new_comment()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_post_author uuid;
  v_parent_author uuid;
  v_kind text;
begin
  select p.author_id into v_post_author
  from public.social_posts as p
  where p.id = new.post_id and p.status = 'approved';
  if v_post_author is null then return new; end if;

  if new.parent_comment_id is null then
    v_kind := 'comment';
    if v_post_author is distinct from new.author_id then
      insert into public.social_notifications (recipient_id, post_id, kind, message)
      values (v_post_author, new.post_id, v_kind, 'أضاف أحدهم تعليقًا على منشورك.');
    end if;
  else
    v_kind := 'reply';
    if v_post_author is distinct from new.author_id then
      insert into public.social_notifications (recipient_id, post_id, kind, message)
      values (v_post_author, new.post_id, v_kind, 'وصل رد جديد على تعليق في منشورك.');
    end if;
    select c.author_id into v_parent_author
    from public.social_comments as c where c.id = new.parent_comment_id;
    if v_parent_author is not null
       and v_parent_author is distinct from new.author_id
       and v_parent_author is distinct from v_post_author then
      insert into public.social_notifications (recipient_id, post_id, kind, message)
      values (v_parent_author, new.post_id, v_kind, 'أحدهم رد على تعليقك.');
    end if;
  end if;
  return new;
end;
$$;
create trigger social_comments_notify_insert
  after insert on public.social_comments
  for each row execute function public.social_notify_new_comment();

-- Aggregate statistics and top five posts, protected by the existing owner admin-key hash.
create or replace function public.social_admin_stats(p_admin_key text)
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
  if p_admin_key is null or char_length(p_admin_key) < 32 or not exists (
    select 1 from public.feedback_admin_secrets as s
    where s.id = 1 and s.enabled
      and s.key_hash = pg_catalog.encode(
        extensions.digest(pg_catalog.convert_to(p_admin_key, 'UTF8'), 'sha256'), 'hex'
      )
  ) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  select pg_catalog.jsonb_build_object(
    'approved_posts', (select count(*) from public.social_posts where status = 'approved'),
    'pending_posts', (select count(*) from public.social_posts where status = 'pending'),
    'total_comments', (
      select count(*) from public.social_comments as c
      join public.social_posts as p on p.id = c.post_id
      where p.status = 'approved' and c.parent_comment_id is null
    ),
    'total_replies', (
      select count(*) from public.social_comments as c
      join public.social_posts as p on p.id = c.post_id
      where p.status = 'approved' and c.parent_comment_id is not null
    ),
    'total_reactions', (
      select count(*) from public.social_reactions as r
      join public.social_posts as p on p.id = r.post_id
      where p.status = 'approved'
    ),
    'top_posts', coalesce((
      select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
        'id', ranked.id,
        'preview', ranked.preview,
        'reaction_count', ranked.reaction_count,
        'comment_count', ranked.comment_count,
        'engagement', ranked.reaction_count + ranked.comment_count
      ) order by ranked.reaction_count + ranked.comment_count desc, ranked.created_at desc)
      from (
        select p.id,
          coalesce(nullif(pg_catalog.left(pg_catalog.btrim(p.content), 120), ''), 'منشور صورة أو فيديو') as preview,
          p.created_at,
          (select count(*)::integer from public.social_reactions as r where r.post_id = p.id) as reaction_count,
          (select count(*)::integer from public.social_comments as c where c.post_id = p.id) as comment_count
        from public.social_posts as p
        where p.status = 'approved'
        order by
          (select count(*) from public.social_reactions as r where r.post_id = p.id)
          + (select count(*) from public.social_comments as c where c.post_id = p.id) desc,
          p.created_at desc
        limit 5
      ) as ranked
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.social_validate_comment_parent() from public, anon, authenticated;
revoke all on function public.social_notify_post_approved() from public, anon, authenticated;
revoke all on function public.social_notify_post_reaction() from public, anon, authenticated;
revoke all on function public.social_notify_new_comment() from public, anon, authenticated;
revoke all on function public.social_admin_stats(text) from public, anon;
grant execute on function public.social_admin_stats(text) to authenticated;

comment on table public.social_notifications is 'Private in-app notifications for post approval, reactions, comments and replies.';
notify pgrst, 'reload schema';
