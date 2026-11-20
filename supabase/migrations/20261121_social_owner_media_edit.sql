-- Owner-only replacement/removal of news attachments. Cloudinary objects are intentionally retained.
create or replace function public.social_owner_edit_media(p_post_id uuid, p_image_url text, p_video_url text)
returns jsonb language plpgsql security definer
set search_path = pg_catalog, public, extensions as $$
declare v_post public.social_posts%rowtype;
begin
  if coalesce(auth.role(), '') <> 'service_role' then raise exception 'Unauthorized' using errcode = '42501'; end if;
  if p_image_url is not null and (char_length(p_image_url) > 2048 or p_image_url !~* '^https://res\.cloudinary\.com/[a-z0-9_-]+/image/upload/') then raise exception 'Invalid image URL' using errcode = '22023'; end if;
  if p_video_url is not null and (char_length(p_video_url) > 2048 or p_video_url !~* '^https://res\.cloudinary\.com/[a-z0-9_-]+/video/upload/') then raise exception 'Invalid video URL' using errcode = '22023'; end if;
  if p_image_url is null and p_video_url is null and not exists (select 1 from public.social_posts where id = p_post_id and char_length(btrim(content)) > 0) then raise exception 'Post must retain text or media' using errcode = '22023'; end if;
  update public.social_posts set image_url = p_image_url, video_url = p_video_url, updated_at = now()
    where id = p_post_id and status in ('pending','approved') returning * into v_post;
  if not found then raise exception 'Post not found' using errcode = 'P0002'; end if;
  return jsonb_build_object('id', v_post.id, 'image_url', v_post.image_url, 'video_url', v_post.video_url);
end; $$;
revoke all on function public.social_owner_edit_media(uuid,text,text) from public, anon, authenticated;
grant execute on function public.social_owner_edit_media(uuid,text,text) to service_role;
notify pgrst, 'reload schema';
