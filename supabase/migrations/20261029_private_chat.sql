-- Secure private chat backend for Al-Ostad Hafez Educational Platform.
-- Supabase anonymous Auth identities are device-local and do not expose student PII.

create table public.chat_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text not null unique check (handle ~ '^[A-HJ-NP-Z2-9]{12}$'),
  created_at timestamptz not null default now()
);

create table public.chat_friend_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.chat_profiles(id) on delete cascade,
  recipient_id uuid not null references public.chat_profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (sender_id <> recipient_id)
);
create unique index chat_friend_requests_pending_unique
  on public.chat_friend_requests(sender_id, recipient_id) where status = 'pending';
create index chat_friend_requests_recipient_status_idx
  on public.chat_friend_requests(recipient_id, status, created_at desc);
create index chat_friend_requests_sender_status_idx
  on public.chat_friend_requests(sender_id, status, created_at desc);

create table public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  user_low uuid not null references public.chat_profiles(id) on delete cascade,
  user_high uuid not null references public.chat_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_low < user_high),
  unique (user_low, user_high)
);
create index chat_conversations_low_updated_idx on public.chat_conversations(user_low, updated_at desc);
create index chat_conversations_high_updated_idx on public.chat_conversations(user_high, updated_at desc);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  sender_id uuid not null references public.chat_profiles(id) on delete cascade,
  body text not null default '',
  kind text not null default 'text' check (kind in ('text', 'image', 'video', 'audio')),
  media_path text,
  media_mime text,
  created_at timestamptz not null default now(),
  check (char_length(body) <= 4000),
  check (
    (kind = 'text' and char_length(btrim(body)) > 0 and media_path is null and media_mime is null)
    or
    (kind in ('image', 'video', 'audio') and body = '' and media_path is not null and media_mime is not null)
  )
);
create index chat_messages_conversation_created_idx
  on public.chat_messages(conversation_id, created_at desc);
create index chat_messages_sender_created_idx
  on public.chat_messages(sender_id, created_at desc);

create table public.chat_calls (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  caller_id uuid not null references public.chat_profiles(id) on delete cascade,
  callee_id uuid not null references public.chat_profiles(id) on delete cascade,
  call_type text not null check (call_type in ('audio', 'video')),
  status text not null default 'ringing' check (status in ('ringing', 'active', 'rejected', 'missed', 'busy', 'ended')),
  offer jsonb not null,
  answer jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (caller_id <> callee_id)
);
create index chat_calls_callee_created_idx on public.chat_calls(callee_id, created_at desc);
create index chat_calls_caller_created_idx on public.chat_calls(caller_id, created_at desc);

create table public.chat_call_signals (
  id uuid primary key default gen_random_uuid(),
  call_id uuid not null references public.chat_calls(id) on delete cascade,
  sender_id uuid not null references public.chat_profiles(id) on delete cascade,
  candidate jsonb not null,
  created_at timestamptz not null default now()
);
create index chat_call_signals_call_created_idx on public.chat_call_signals(call_id, created_at);

alter table public.chat_profiles enable row level security;
alter table public.chat_friend_requests enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_calls enable row level security;
alter table public.chat_call_signals enable row level security;

create or replace function public.chat_are_friends(p_user_a uuid, p_user_b uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select auth.uid() is not null
    and auth.uid() in (p_user_a, p_user_b)
    and exists (
      select 1 from public.chat_friend_requests r
      where r.status = 'accepted'
        and ((r.sender_id = p_user_a and r.recipient_id = p_user_b)
          or (r.sender_id = p_user_b and r.recipient_id = p_user_a))
    );
$$;

create or replace function public.chat_is_member(p_conversation_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1 from public.chat_conversations c
    where c.id = p_conversation_id
      and auth.uid() in (c.user_low, c.user_high)
      and public.chat_are_friends(c.user_low, c.user_high)
  );
$$;

create or replace function public.chat_find_profile_by_handle(p_handle text)
returns table(profile_id uuid, handle text)
language sql stable security definer
set search_path = ''
as $$
  select p.id, p.handle
  from public.chat_profiles p
  where auth.uid() is not null
    and p.id <> auth.uid()
    and p.handle = upper(btrim(coalesce(p_handle, '')))
  limit 1;
$$;

create or replace function public.chat_open_conversation(p_other_user uuid)
returns uuid
language plpgsql security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_me uuid := auth.uid();
begin
  if v_me is null or p_other_user is null or p_other_user = v_me then
    raise exception 'محادثة غير صالحة';
  end if;
  if not public.chat_are_friends(v_me, p_other_user) then
    raise exception 'يجب قبول طلب الصداقة أولاً';
  end if;
  insert into public.chat_conversations(user_low, user_high)
  values (least(v_me, p_other_user), greatest(v_me, p_other_user))
  on conflict (user_low, user_high) do nothing
  returning id into v_id;
  if v_id is null then
    select c.id into v_id from public.chat_conversations c
    where c.user_low = least(v_me, p_other_user) and c.user_high = greatest(v_me, p_other_user);
  end if;
  return v_id;
end;
$$;

create or replace function public.chat_can_access_media(p_path text, p_must_own boolean)
returns boolean
language plpgsql stable security definer
set search_path = ''
as $$
declare
  v_parts text[];
  v_conversation uuid;
begin
  if auth.uid() is null then return false; end if;
  v_parts := storage.foldername(coalesce(p_path, ''));
  if coalesce(array_length(v_parts, 1), 0) < 2 then return false; end if;
  if v_parts[1] !~ '^[0-9a-fA-F-]{36}$' or v_parts[2] !~ '^[0-9a-fA-F-]{36}$' then return false; end if;
  if p_must_own and v_parts[2] <> auth.uid()::text then return false; end if;
  v_conversation := v_parts[1]::uuid;
  return public.chat_is_member(v_conversation);
exception when others then
  return false;
end;
$$;

create or replace function public.chat_guard_friend_request_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.sender_id is distinct from new.sender_id
     or old.recipient_id is distinct from new.recipient_id
     or old.created_at is distinct from new.created_at then
    raise exception 'لا يمكن تغيير أطراف طلب الصداقة';
  end if;
  if auth.uid() is distinct from old.recipient_id
     or old.status <> 'pending'
     or new.status not in ('accepted', 'rejected') then
    raise exception 'تغيير طلب الصداقة غير مسموح';
  end if;
  new.updated_at := now();
  return new;
end;
$$;
create trigger chat_friend_request_update_guard
  before update on public.chat_friend_requests
  for each row execute function public.chat_guard_friend_request_update();

create or replace function public.chat_guard_call_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.conversation_id is distinct from new.conversation_id
     or old.caller_id is distinct from new.caller_id
     or old.callee_id is distinct from new.callee_id
     or old.call_type is distinct from new.call_type
     or old.offer is distinct from new.offer
     or old.created_at is distinct from new.created_at then
    raise exception 'لا يمكن تغيير أطراف المكالمة أو وصفها';
  end if;
  if auth.uid() = old.caller_id then
    if new.answer is distinct from old.answer then raise exception 'المتصل لا يغيّر إجابة الطرف الآخر'; end if;
    if new.status is distinct from old.status and new.status not in ('ended', 'missed') then
      raise exception 'حالة المكالمة غير مسموح بها للمتصل';
    end if;
    if new.status = 'missed' and old.status <> 'ringing' then raise exception 'لا يمكن وسم مكالمة نشطة كفائتة'; end if;
  elsif auth.uid() = old.callee_id then
    if new.answer is distinct from old.answer and old.answer is not null then raise exception 'تم تسجيل إجابة المكالمة'; end if;
    if new.status is distinct from old.status and new.status not in ('active', 'rejected', 'busy', 'ended') then
      raise exception 'حالة المكالمة غير مسموح بها للمستلم';
    end if;
  else
    raise exception 'تحديث المكالمة غير مسموح';
  end if;
  new.updated_at := now();
  return new;
end;
$$;
create trigger chat_call_update_guard
  before update on public.chat_calls
  for each row execute function public.chat_guard_call_update();

create or replace function public.chat_rate_limit_insert()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  if tg_table_name = 'chat_messages' then
    select count(*) into v_count from public.chat_messages m
      where m.sender_id = new.sender_id and m.created_at > now() - interval '10 seconds';
    if v_count >= 8 then raise exception 'أرسلت رسائل كثيرة بسرعة؛ انتظر قليلًا'; end if;
  elsif tg_table_name = 'chat_friend_requests' then
    select count(*) into v_count from public.chat_friend_requests r
      where r.sender_id = new.sender_id and r.created_at > now() - interval '1 hour';
    if v_count >= 15 then raise exception 'تجاوزت حد طلبات الصداقة المؤقت'; end if;
  elsif tg_table_name = 'chat_calls' then
    select count(*) into v_count from public.chat_calls c
      where c.caller_id = new.caller_id and c.created_at > now() - interval '1 hour';
    if v_count >= 10 then raise exception 'تجاوزت حد المكالمات المؤقت'; end if;
  end if;
  return new;
end;
$$;
create trigger chat_message_rate_limit before insert on public.chat_messages
  for each row execute function public.chat_rate_limit_insert();
create trigger chat_request_rate_limit before insert on public.chat_friend_requests
  for each row execute function public.chat_rate_limit_insert();
create trigger chat_call_rate_limit before insert on public.chat_calls
  for each row execute function public.chat_rate_limit_insert();

create or replace function public.chat_touch_conversation()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  update public.chat_conversations set updated_at = now() where id = new.conversation_id;
  return new;
end;
$$;
create trigger chat_message_touch_conversation after insert on public.chat_messages
  for each row execute function public.chat_touch_conversation();

create policy chat_profiles_select_self_or_friend on public.chat_profiles
  for select to authenticated using (
    id = (select auth.uid()) or exists (
      select 1 from public.chat_friend_requests r
      where r.status = 'accepted'
        and ((r.sender_id = (select auth.uid()) and r.recipient_id = id)
          or (r.recipient_id = (select auth.uid()) and r.sender_id = id))
    )
  );
create policy chat_profiles_insert_self on public.chat_profiles
  for insert to authenticated with check (id = (select auth.uid()));

create policy chat_requests_select_parties on public.chat_friend_requests
  for select to authenticated using (sender_id = (select auth.uid()) or recipient_id = (select auth.uid()));
create policy chat_requests_insert_sender on public.chat_friend_requests
  for insert to authenticated with check (
    sender_id = (select auth.uid()) and recipient_id <> (select auth.uid()) and status = 'pending'
  );
create policy chat_requests_update_recipient on public.chat_friend_requests
  for update to authenticated using (
    recipient_id = (select auth.uid()) and status = 'pending'
  ) with check (
    recipient_id = (select auth.uid()) and status in ('accepted', 'rejected')
  );

create policy chat_conversations_select_parties on public.chat_conversations
  for select to authenticated using (
    (user_low = (select auth.uid()) or user_high = (select auth.uid()))
    and public.chat_are_friends(user_low, user_high)
  );

create policy chat_messages_select_members on public.chat_messages
  for select to authenticated using (public.chat_is_member(conversation_id));
create policy chat_messages_insert_sender on public.chat_messages
  for insert to authenticated with check (
    sender_id = (select auth.uid())
    and public.chat_is_member(conversation_id)
    and (
      (kind = 'text' and char_length(btrim(body)) between 1 and 4000 and media_path is null)
      or (kind in ('image', 'video', 'audio') and media_path like conversation_id::text || '/' || (select auth.uid())::text || '/%')
    )
  );

create policy chat_calls_select_parties on public.chat_calls
  for select to authenticated using (
    (caller_id = (select auth.uid()) or callee_id = (select auth.uid()))
    and public.chat_is_member(conversation_id)
  );
create policy chat_calls_insert_caller on public.chat_calls
  for insert to authenticated with check (
    caller_id = (select auth.uid())
    and callee_id <> caller_id
    and public.chat_is_member(conversation_id)
    and exists (
      select 1 from public.chat_conversations c
      where c.id = conversation_id and callee_id in (c.user_low, c.user_high)
    )
  );
create policy chat_calls_update_parties on public.chat_calls
  for update to authenticated using (
    (caller_id = (select auth.uid()) or callee_id = (select auth.uid()))
    and public.chat_is_member(conversation_id)
  ) with check (
    (caller_id = (select auth.uid()) or callee_id = (select auth.uid()))
    and public.chat_is_member(conversation_id)
  );

create policy chat_call_signals_select_parties on public.chat_call_signals
  for select to authenticated using (
    exists (select 1 from public.chat_calls c where c.id = call_id
      and (c.caller_id = (select auth.uid()) or c.callee_id = (select auth.uid())))
  );
create policy chat_call_signals_insert_sender on public.chat_call_signals
  for insert to authenticated with check (
    sender_id = (select auth.uid())
    and exists (select 1 from public.chat_calls c where c.id = call_id
      and (c.caller_id = (select auth.uid()) or c.callee_id = (select auth.uid())))
  );

create policy chat_private_media_select_participants on storage.objects
  for select to authenticated using (
    bucket_id = 'chat-private-media' and public.chat_can_access_media(name, false)
  );
create policy chat_private_media_insert_own on storage.objects
  for insert to authenticated with check (
    bucket_id = 'chat-private-media' and public.chat_can_access_media(name, true)
  );
create policy chat_private_media_delete_own on storage.objects
  for delete to authenticated using (
    bucket_id = 'chat-private-media' and public.chat_can_access_media(name, true)
  );

-- Only authenticated sessions (including Supabase anonymous users) get API table access.
revoke all on public.chat_profiles, public.chat_friend_requests, public.chat_conversations,
  public.chat_messages, public.chat_calls, public.chat_call_signals from anon;
grant select, insert on public.chat_profiles to authenticated;
grant select, insert, update on public.chat_friend_requests to authenticated;
grant select on public.chat_conversations to authenticated;
grant select, insert on public.chat_messages to authenticated;
grant select, insert, update on public.chat_calls to authenticated;
grant select, insert on public.chat_call_signals to authenticated;
revoke all on function public.chat_are_friends(uuid, uuid) from public;
revoke all on function public.chat_is_member(uuid) from public;
revoke all on function public.chat_find_profile_by_handle(text) from public;
revoke all on function public.chat_open_conversation(uuid) from public;
revoke all on function public.chat_can_access_media(text, boolean) from public;
grant execute on function public.chat_are_friends(uuid, uuid) to authenticated;
grant execute on function public.chat_is_member(uuid) to authenticated;
grant execute on function public.chat_find_profile_by_handle(text) to authenticated;
grant execute on function public.chat_open_conversation(uuid) to authenticated;
grant execute on function public.chat_can_access_media(text, boolean) to authenticated;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values (
  'chat-private-media', 'chat-private-media', false, 26214400,
  array['image/jpeg','image/png','image/gif','image/webp','image/avif','video/mp4','video/webm','audio/webm','audio/ogg','audio/mp4','audio/mpeg']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Enable row-change subscriptions for private messages, requests and WebRTC signaling.
do $$
declare
  v_table text;
begin
  foreach v_table in array array['chat_friend_requests', 'chat_messages', 'chat_calls', 'chat_call_signals'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = v_table
    ) then
      execute format('alter publication supabase_realtime add table public.%I', v_table);
    end if;
  end loop;
end;
$$;
