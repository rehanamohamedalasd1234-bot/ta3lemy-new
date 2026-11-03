-- Coalesce repeated unread reaction notifications for the same post to limit spam.
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
  if exists (
    select 1 from public.social_notifications as n
    where n.recipient_id = v_recipient
      and n.post_id = new.post_id
      and n.kind = 'reaction'
      and not n.is_read
      and n.created_at > now() - interval '1 hour'
  ) then
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
revoke all on function public.social_notify_post_reaction() from public, anon, authenticated;
