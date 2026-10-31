-- Expose only the random chat handle to the two parties of a pending or accepted request.
drop policy if exists chat_profiles_select_self_or_friend on public.chat_profiles;
create policy chat_profiles_select_self_or_friend on public.chat_profiles
  for select to authenticated using (
    id = (select auth.uid()) or exists (
      select 1 from public.chat_friend_requests r
      where r.status in ('pending', 'accepted')
        and ((r.sender_id = (select auth.uid()) and r.recipient_id = id)
          or (r.recipient_id = (select auth.uid()) and r.sender_id = id))
    )
  );
