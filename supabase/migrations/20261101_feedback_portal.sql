-- Private suggestions and complaints for Ta3lemy.
-- Student submissions use Supabase anonymous Auth; table RLS restricts reads to auth.uid().
-- Follow-up codes are generated server-side with pgcrypto; only their hash is stored.
-- Owner list/reply calls additionally require a high-entropy admin key whose hash is
-- seeded separately and is never placed in this migration or the public website.

create extension if not exists pgcrypto with schema extensions;

create table public.feedback_tickets (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('suggestion', 'complaint')),
  subject text not null check (char_length(btrim(subject)) between 3 and 120),
  message text not null check (char_length(btrim(message)) between 10 and 3000),
  followup_hash text not null check (followup_hash ~ '^[0-9a-f]{64}$'),
  status text not null default 'open' check (status in ('open', 'replied', 'closed')),
  admin_reply text check (admin_reply is null or char_length(admin_reply) <= 4000),
  created_at timestamptz not null default now(),
  replied_at timestamptz
);

create index feedback_tickets_sender_created_idx
  on public.feedback_tickets (sender_id, created_at desc);
create index feedback_tickets_status_created_idx
  on public.feedback_tickets (status, created_at desc);

alter table public.feedback_tickets enable row level security;
revoke all on table public.feedback_tickets from public, anon, authenticated;
grant select (id, category, subject, message, status, admin_reply, created_at, replied_at)
  on table public.feedback_tickets to authenticated;

create policy feedback_tickets_select_own
  on public.feedback_tickets for select to authenticated
  using (sender_id = (select auth.uid()));

create table public.feedback_admin_secrets (
  id smallint primary key default 1 check (id = 1),
  key_hash text not null check (key_hash ~ '^[0-9a-f]{64}$'),
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.feedback_admin_secrets enable row level security;
revoke all on table public.feedback_admin_secrets from public, anon, authenticated;
create policy feedback_admin_secrets_deny_all
  on public.feedback_admin_secrets for all to public
  using (false) with check (false);

create or replace function public.feedback_submit(
  p_category text,
  p_subject text,
  p_message text,
  p_honeypot text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_sender uuid := auth.uid();
  v_recent_count bigint;
  v_code text;
  v_ticket_id uuid;
  v_created_at timestamptz;
begin
  if v_sender is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if coalesce(p_honeypot, '') <> '' then
    raise exception 'Invalid submission' using errcode = '22023';
  end if;
  if p_category is null or p_category not in ('suggestion', 'complaint') then
    raise exception 'Invalid category' using errcode = '22023';
  end if;
  if p_subject is null or char_length(btrim(p_subject)) not between 3 and 120 then
    raise exception 'Subject length must be between 3 and 120 characters' using errcode = '22023';
  end if;
  if p_message is null or char_length(btrim(p_message)) not between 10 and 3000 then
    raise exception 'Message length must be between 10 and 3000 characters' using errcode = '22023';
  end if;

  -- Serialize submissions for this anonymous account to make the rate limit effective.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_sender::text, 0));
  select count(*) into v_recent_count
  from public.feedback_tickets
  where sender_id = v_sender
    and created_at > now() - interval '1 hour';
  if v_recent_count >= 5 then
    raise exception 'Submission limit reached; try again later' using errcode = 'P0001';
  end if;

  v_code := pg_catalog.encode(extensions.gen_random_bytes(16), 'hex');
  insert into public.feedback_tickets (
    sender_id, category, subject, message, followup_hash
  ) values (
    v_sender,
    p_category,
    btrim(p_subject),
    btrim(p_message),
    pg_catalog.encode(
      extensions.digest(pg_catalog.convert_to(v_code, 'UTF8'), 'sha256'),
      'hex'
    )
  )
  returning id, created_at into v_ticket_id, v_created_at;

  return pg_catalog.jsonb_build_object(
    'id', v_ticket_id,
    'created_at', v_created_at,
    'followup_code', v_code
  );
end;
$$;

create or replace function public.feedback_find_by_code(p_code text)
returns jsonb
language sql
security definer
set search_path = pg_catalog, public, extensions
as $$
  select jsonb_build_object(
    'id', t.id,
    'category', t.category,
    'subject', t.subject,
    'message', t.message,
    'status', t.status,
    'admin_reply', t.admin_reply,
    'created_at', t.created_at,
    'replied_at', t.replied_at
  )
  from public.feedback_tickets as t
  where p_code ~ '^[0-9a-fA-F]{32}$'
    and t.followup_hash = pg_catalog.encode(
      extensions.digest(pg_catalog.convert_to(pg_catalog.lower(p_code), 'UTF8'), 'sha256'),
      'hex'
    )
  limit 1;
$$;

create or replace function public.feedback_admin_list(p_admin_key text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_result jsonb;
begin
  if p_admin_key is null or char_length(p_admin_key) < 32 or not exists (
    select 1
    from public.feedback_admin_secrets as s
    where s.id = 1
      and s.enabled
      and s.key_hash = pg_catalog.encode(
        extensions.digest(pg_catalog.convert_to(p_admin_key, 'UTF8'), 'sha256'),
        'hex'
      )
  ) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  select coalesce(
    pg_catalog.jsonb_agg(pg_catalog.to_jsonb(items)),
    '[]'::jsonb
  )
  into v_result
  from (
    select id, category, subject, message, status, admin_reply, created_at, replied_at
    from public.feedback_tickets
    order by created_at desc
    limit 250
  ) as items;

  return v_result;
end;
$$;

create or replace function public.feedback_admin_reply(
  p_admin_key text,
  p_ticket_id uuid,
  p_reply text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_result jsonb;
begin
  if p_admin_key is null or char_length(p_admin_key) < 32 or not exists (
    select 1
    from public.feedback_admin_secrets as s
    where s.id = 1
      and s.enabled
      and s.key_hash = pg_catalog.encode(
        extensions.digest(pg_catalog.convert_to(p_admin_key, 'UTF8'), 'sha256'),
        'hex'
      )
  ) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  if p_reply is null or char_length(btrim(p_reply)) not between 2 and 4000 then
    raise exception 'Reply length must be between 2 and 4000 characters' using errcode = '22023';
  end if;

  update public.feedback_tickets
  set admin_reply = btrim(p_reply), status = 'replied', replied_at = now()
  where id = p_ticket_id;

  if not found then
    raise exception 'Ticket not found' using errcode = 'P0002';
  end if;

  select pg_catalog.jsonb_build_object(
    'id', id,
    'status', status,
    'admin_reply', admin_reply,
    'replied_at', replied_at
  )
  into v_result
  from public.feedback_tickets
  where id = p_ticket_id;

  return v_result;
end;
$$;

revoke all on function public.feedback_submit(text, text, text, text) from public, anon;
revoke all on function public.feedback_find_by_code(text) from public, anon;
revoke all on function public.feedback_admin_list(text) from public, anon;
revoke all on function public.feedback_admin_reply(text, uuid, text) from public, anon;
grant execute on function public.feedback_submit(text, text, text, text) to authenticated;
grant execute on function public.feedback_find_by_code(text) to authenticated;
grant execute on function public.feedback_admin_list(text) to authenticated;
grant execute on function public.feedback_admin_reply(text, uuid, text) to authenticated;

comment on table public.feedback_tickets is
  'Private Ta3lemy suggestions and complaints. Access is restricted by RLS or an unguessable follow-up code.';
comment on table public.feedback_admin_secrets is
  'Private server-side hash for authorizing the Ta3lemy feedback owner inbox.';

notify pgrst, 'reload schema';
