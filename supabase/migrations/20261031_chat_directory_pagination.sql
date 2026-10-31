-- Paginated name-only directory for all named chat profiles.
-- Empty-query pages use a deterministic per-user shuffle so suggestions are spread across the directory.
CREATE OR REPLACE FUNCTION public.chat_list_directory_page(
  p_query text DEFAULT '',
  p_limit integer DEFAULT 100,
  p_offset integer DEFAULT 0
)
RETURNS TABLE(profile_id uuid, display_name text, avatar_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT p.id, p.display_name, p.avatar_url
  FROM public.chat_profiles p
  WHERE auth.uid() IS NOT NULL
    AND p.id <> auth.uid()
    AND btrim(p.display_name) <> ''
    AND p.display_name <> 'عضو'
    AND (
      btrim(coalesce(p_query, '')) = ''
      OR position(lower(btrim(p_query)) IN lower(p.display_name)) > 0
    )
  ORDER BY
    CASE
      WHEN btrim(coalesce(p_query, '')) = '' THEN md5(p.id::text || auth.uid()::text)
      ELSE lower(p.display_name)
    END,
    p.id
  LIMIT LEAST(GREATEST(COALESCE(p_limit, 100), 1), 100)
  OFFSET GREATEST(COALESCE(p_offset, 0), 0);
$$;

REVOKE ALL ON FUNCTION public.chat_list_directory_page(text, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.chat_list_directory_page(text, integer, integer) FROM anon;
GRANT EXECUTE ON FUNCTION public.chat_list_directory_page(text, integer, integer) TO authenticated;
