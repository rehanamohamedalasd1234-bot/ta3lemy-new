-- Server-only moderation entry points. The Edge Function verifies a signed Firebase ID token
-- and an exact owner email before calling these RPCs with Supabase's service-role credential.
-- Never call these RPCs from browser code or expose the service-role key.

create or replace function public.social_owner_list(p_status text default 'pending')
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_result jsonb;
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;
  if p_status is null or p_status not in ('pending', 'approved') then
    raise exception 'Invalid status' using errcode = '22023';
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

create or replace function public.social_owner_edit(p_post_id uuid, p_content text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_post public.social_posts%rowtype;
begin
  if coalesce(auth.role(), '') <> 'service_role' then
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

create or replace function public.social_owner_decide(p_post_id uuid, p_action text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_post public.social_posts%rowtype;
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  if p_action = 'delete' then
    delete from public.social_posts where id = p_post_id;
    if not found then raise exception 'Post not found' using errcode = 'P0002'; end if;
    return pg_catalog.jsonb_build_object('id', p_post_id, 'action', 'delete');
  elsif p_action = 'approve' then
    update public.social_posts
    set status = 'approved', approved_at = now(), moderated_at = now(), moderated_by = null, updated_at = now()
    where id = p_post_id and status in ('pending', 'approved')
    returning * into v_post;
  elsif p_action = 'reject' then
    update public.social_posts
    set status = 'rejected', approved_at = null, moderated_at = now(), moderated_by = null, updated_at = now()
    where id = p_post_id and status in ('pending', 'approved')
    returning * into v_post;
  else
    raise exception 'Invalid action' using errcode = '22023';
  end if;

  if not found then raise exception 'Post not found' using errcode = 'P0002'; end if;
  return pg_catalog.jsonb_build_object('id', v_post.id, 'action', p_action, 'status', v_post.status);
end;
$$;

create or replace function public.social_owner_delete_comment(p_comment_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;
  delete from public.social_comments where id = p_comment_id;
  if not found then raise exception 'Comment not found' using errcode = 'P0002'; end if;
  return pg_catalog.jsonb_build_object('id', p_comment_id, 'action', 'delete');
end;
$$;

create or replace function public.social_owner_stats()
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_result jsonb;
begin
  if coalesce(auth.role(), '') <> 'service_role' then
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

revoke all on function public.social_owner_list(text) from public, anon, authenticated;
revoke all on function public.social_owner_edit(uuid, text) from public, anon, authenticated;
revoke all on function public.social_owner_decide(uuid, text) from public, anon, authenticated;
revoke all on function public.social_owner_delete_comment(uuid) from public, anon, authenticated;
revoke all on function public.social_owner_stats() from public, anon, authenticated;
grant execute on function public.social_owner_list(text) to service_role;
grant execute on function public.social_owner_edit(uuid, text) to service_role;
grant execute on function public.social_owner_decide(uuid, text) to service_role;
grant execute on function public.social_owner_delete_comment(uuid) to service_role;
grant execute on function public.social_owner_stats() to service_role;

comment on function public.social_owner_list(text) is 'Service-role-only RPC. Call only from the owner moderation Edge Function after Firebase owner verification.';
comment on function public.social_owner_edit(uuid, text) is 'Service-role-only RPC. Call only from the owner moderation Edge Function after Firebase owner verification.';
comment on function public.social_owner_decide(uuid, text) is 'Service-role-only RPC. Call only from the owner moderation Edge Function after Firebase owner verification.';
comment on function public.social_owner_delete_comment(uuid) is 'Service-role-only RPC. Call only from the owner moderation Edge Function after Firebase owner verification.';
comment on function public.social_owner_stats() is 'Service-role-only RPC. Call only from the owner moderation Edge Function after Firebase owner verification.';

notify pgrst, 'reload schema';
