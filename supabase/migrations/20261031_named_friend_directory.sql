-- Name-based friend directory for chat accounts, exposing only display name and avatar.
-- The directory is queried through a limited RPC; emails and phone numbers are never returned.

ALTER TABLE public.chat_profiles
  ADD COLUMN IF NOT EXISTS display_name text NOT NULL DEFAULT 'عضو',
  ADD COLUMN IF NOT EXISTS avatar_url text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.chat_profiles'::regclass
      AND conname = 'chat_profiles_display_name_length_check'
  ) THEN
    ALTER TABLE public.chat_profiles
      ADD CONSTRAINT chat_profiles_display_name_length_check
      CHECK (char_length(btrim(display_name)) BETWEEN 1 AND 80);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.chat_profiles'::regclass
      AND conname = 'chat_profiles_avatar_url_check'
  ) THEN
    ALTER TABLE public.chat_profiles
      ADD CONSTRAINT chat_profiles_avatar_url_check
      CHECK (avatar_url IS NULL OR (char_length(avatar_url) <= 2048 AND avatar_url ~* '^https?://'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS chat_profiles_display_name_lower_idx
  ON public.chat_profiles (lower(display_name));

DROP POLICY IF EXISTS chat_profiles_select_self_or_friend ON public.chat_profiles;
CREATE POLICY chat_profiles_select_self_or_friend
  ON public.chat_profiles
  FOR SELECT
  TO authenticated
  USING (
    id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.chat_friend_requests r
      WHERE r.status IN ('pending', 'accepted')
        AND (
          (r.sender_id = (SELECT auth.uid()) AND r.recipient_id = chat_profiles.id)
          OR (r.recipient_id = (SELECT auth.uid()) AND r.sender_id = chat_profiles.id)
        )
    )
  );

DROP POLICY IF EXISTS chat_profiles_update_self ON public.chat_profiles;
CREATE POLICY chat_profiles_update_self
  ON public.chat_profiles
  FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

REVOKE TRUNCATE ON TABLE
  public.chat_profiles,
  public.chat_friend_requests,
  public.chat_conversations,
  public.chat_messages,
  public.chat_calls,
  public.chat_call_signals
FROM authenticated;

CREATE OR REPLACE FUNCTION public.chat_list_directory(p_query text DEFAULT '', p_limit integer DEFAULT 500)
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
  ORDER BY lower(p.display_name), p.created_at
  LIMIT LEAST(GREATEST(COALESCE(p_limit, 500), 1), 2000);
$$;

REVOKE ALL ON FUNCTION public.chat_list_directory(text, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.chat_list_directory(text, integer) FROM anon;
GRANT EXECUTE ON FUNCTION public.chat_list_directory(text, integer) TO authenticated;
