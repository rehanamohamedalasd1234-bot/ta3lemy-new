-- Emoji reactions for owner-approved Ta3lemy social posts.
-- Each Supabase identity has one reaction per post; selecting the same emoji toggles it off.
create table public.social_reactions (
  post_id uuid not null references public.social_posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  reaction text not null check (reaction in ('like', 'love', 'laugh', 'wow', 'clap')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (post_id, author_id)
);

create index social_reactions_post_reaction_idx on public.social_reactions (post_id, reaction);
alter table public.social_reactions enable row level security;
revoke all on table public.social_reactions from public, anon, authenticated;

-- Return aggregate counts and only the caller's selected reaction; never expose user IDs.
create or replace function public.social_reaction_summary(p_post_ids uuid[])
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare v_result jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_post_ids is null or cardinality(p_post_ids) > 50 then
    raise exception 'Provide no more than 50 post IDs' using errcode = '22023';
  end if;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'post_id', p.id,
      'counts', coalesce((
        select jsonb_object_agg(counts.reaction, counts.total)
        from (
          select r.reaction, count(*)::integer as total
          from public.social_reactions as r
          where r.post_id = p.id
          group by r.reaction
        ) as counts
      ), '{}'::jsonb),
      'mine', (
        select own.reaction
        from public.social_reactions as own
        where own.post_id = p.id and own.author_id = auth.uid()
      )
    ) order by p.created_at desc
  ), '[]'::jsonb)
  into v_result
  from public.social_posts as p
  where p.id = any(p_post_ids) and p.status = 'approved';

  return v_result;
end;
$$;

-- Toggle the caller's reaction in one transaction and reject unapproved posts.
create or replace function public.social_toggle_reaction(p_post_id uuid, p_reaction text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_user_id uuid := auth.uid();
  v_current text;
  v_next text;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_reaction is null or p_reaction not in ('like', 'love', 'laugh', 'wow', 'clap') then
    raise exception 'Invalid reaction' using errcode = '22023';
  end if;
  if not exists (
    select 1 from public.social_posts as p
    where p.id = p_post_id and p.status = 'approved'
  ) then
    raise exception 'Post is not available for reactions' using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_post_id::text || ':' || v_user_id::text, 0));
  select r.reaction into v_current
  from public.social_reactions as r
  where r.post_id = p_post_id and r.author_id = v_user_id
  for update;

  if not found then
    insert into public.social_reactions (post_id, author_id, reaction)
    values (p_post_id, v_user_id, p_reaction);
    v_next := p_reaction;
  elsif v_current = p_reaction then
    delete from public.social_reactions
    where post_id = p_post_id and author_id = v_user_id;
    v_next := null;
  else
    update public.social_reactions
    set reaction = p_reaction, updated_at = now()
    where post_id = p_post_id and author_id = v_user_id;
    v_next := p_reaction;
  end if;

  return jsonb_build_object('post_id', p_post_id, 'mine', v_next);
end;
$$;

revoke all on function public.social_reaction_summary(uuid[]) from public, anon;
revoke all on function public.social_toggle_reaction(uuid, text) from public, anon;
grant execute on function public.social_reaction_summary(uuid[]) to authenticated;
grant execute on function public.social_toggle_reaction(uuid, text) to authenticated;

comment on table public.social_reactions is 'One emoji reaction per authenticated Supabase identity on each owner-approved social post.';
notify pgrst, 'reload schema';
