-- The browser no longer uses key-based social_admin RPCs. Keep the functions for compatibility
-- with older deployments but remove their exposed API execution grants from every client role.
revoke all on function public.social_admin_list(text, text) from public, anon, authenticated;
revoke all on function public.social_admin_edit(text, uuid, text) from public, anon, authenticated;
revoke all on function public.social_admin_decide(text, uuid, text) from public, anon, authenticated;
revoke all on function public.social_admin_delete_comment(text, uuid) from public, anon, authenticated;
revoke all on function public.social_admin_stats(text) from public, anon, authenticated;
notify pgrst, 'reload schema';
