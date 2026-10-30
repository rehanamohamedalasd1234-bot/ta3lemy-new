-- Minimize WebRTC signaling retention while keeping a short call-history window.
alter table public.chat_calls alter column offer drop not null;
alter table public.chat_calls
  add constraint chat_calls_offer_required_while_live
  check (offer is not null or status in ('rejected', 'missed', 'busy', 'ended'));
alter table public.chat_calls
  add constraint chat_calls_answer_required_when_active
  check (status <> 'active' or answer is not null);
create index if not exists chat_calls_created_idx on public.chat_calls(created_at desc);

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
     or old.created_at is distinct from new.created_at then
    raise exception 'لا يمكن تغيير أطراف المكالمة أو وصفها';
  end if;
  if old.offer is distinct from new.offer
     and not (new.offer is null and new.status in ('rejected', 'missed', 'busy', 'ended')) then
    raise exception 'لا يمكن تغيير عرض المكالمة';
  end if;
  if new.status in ('rejected', 'missed', 'busy', 'ended')
     and (new.offer is not null or new.answer is not null) then
    raise exception 'يجب مسح بيانات الإشارة عند إنهاء المكالمة';
  end if;

  if auth.uid() = old.caller_id then
    if old.answer is distinct from new.answer
       and not (new.answer is null and new.status in ('rejected', 'missed', 'busy', 'ended')) then
      raise exception 'المتصل لا يغيّر إجابة الطرف الآخر';
    end if;
    if new.status is distinct from old.status
       and not ((new.status = 'ended' and old.status in ('ringing', 'active'))
         or (new.status = 'missed' and old.status = 'ringing')) then
      raise exception 'حالة المكالمة غير مسموح بها للمتصل';
    end if;
  elsif auth.uid() = old.callee_id then
    if old.answer is distinct from new.answer
       and not ((old.answer is null and new.answer is not null and old.status = 'ringing' and new.status = 'active')
         or (new.answer is null and new.status in ('rejected', 'missed', 'busy', 'ended'))) then
      raise exception 'إجابة المكالمة غير مسموح بها';
    end if;
    if new.status is distinct from old.status
       and not ((old.status = 'ringing' and new.status in ('active', 'rejected', 'busy'))
         or (old.status = 'active' and new.status = 'ended')) then
      raise exception 'حالة المكالمة غير مسموح بها للمستلم';
    end if;
  else
    raise exception 'تحديث المكالمة غير مسموح';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.chat_purge_call_signals_on_finish()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.chat_call_signals where call_id = new.id;
  return new;
end;
$$;
create trigger chat_purge_call_signals_on_finish
  after update of status on public.chat_calls
  for each row
  when (new.status in ('rejected', 'missed', 'busy', 'ended') and old.status is distinct from new.status)
  execute function public.chat_purge_call_signals_on_finish();

create or replace function public.chat_prune_old_call_history()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.chat_calls where created_at < now() - interval '30 days';
  return new;
end;
$$;
create trigger chat_prune_old_call_history
  before insert on public.chat_calls
  for each row execute function public.chat_prune_old_call_history();
