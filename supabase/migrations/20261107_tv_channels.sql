-- TV channel directory: public read of active metadata, admin writes only through a verified Edge Function.
create table if not exists public.tv_channels (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  category text not null check (category in ('sports', 'education', 'custom')),
  behavior text not null check (behavior in ('external', 'youtube', 'hls', 'video')),
  watch_url text not null check (char_length(watch_url) <= 2048 and watch_url ~ '^https://'),
  logo_url text check (logo_url is null or (char_length(logo_url) <= 2048 and logo_url ~ '^https://')),
  description text not null default '' check (char_length(description) <= 240),
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tv_channels_name_watch_url_key unique (name, watch_url)
);

create index if not exists tv_channels_active_order_idx
  on public.tv_channels (sort_order, name) where is_active = true;

alter table public.tv_channels enable row level security;
revoke all on table public.tv_channels from public, anon, authenticated;
grant select on table public.tv_channels to anon, authenticated;
grant all on table public.tv_channels to service_role;

drop policy if exists "Public can read active TV channels" on public.tv_channels;
create policy "Public can read active TV channels"
  on public.tv_channels for select to anon, authenticated
  using (is_active = true);

insert into public.tv_channels (name, category, behavior, watch_url, description, sort_order, is_active)
values
  ('ON Time Sports 1', 'sports', 'external', 'https://play.google.com/store/apps/details?id=com.clicks.onSportsKora&hl=en_US', 'يفتح صفحة تطبيق ON Sport الرسمي؛ لم يُتحقق من رابط بث مباشر قابل للتضمين.', 10, true),
  ('ON Time Sports 2', 'sports', 'external', 'https://www.youtube.com/channel/UCWLo4r-9_x4GCJCFShNFq0A/about', 'يفتح القناة الرسمية لـ ON Sport على YouTube؛ لا نستخدم روابط تدفق غير موثقة.', 20, true),
  ('قناة الأهلي الرسمية', 'sports', 'external', 'https://www.youtube.com/channel/UCmeqakSoEdmxEtTnCFSbunw/streams', 'صفحة القناة الرسمية على YouTube؛ المحتوى المتاح والبث يتغيران حسب الوقت.', 30, true),
  ('beIN SPORTS', 'sports', 'external', 'https://beinconnect.app/beINSPORTS1', 'يفتح خدمة beIN الرسمية؛ يلزم الاشتراك أو تسجيل الدخول إذا طلبته الخدمة.', 40, true),
  ('مدرستنا — القناة الرسمية', 'education', 'external', 'https://www.youtube.com/@madrasetnatv/streams', 'صفحة البث/المحتوى الرسمية؛ لا نضمّن محتوى مدرستنا داخل المنصة.', 50, true),
  ('مدرستنا 3 — القناة الرسمية', 'education', 'external', 'https://www.youtube.com/@madrasetna3tv/streams', 'صفحة القناة الرسمية؛ المحتوى المتاح يحدده المصدر.', 60, true),
  ('مدرستنا بلس', 'education', 'external', 'https://madrasetnaplus.eg/', 'بوابة مدرستنا بلس الرسمية؛ تُفتح خارجيًا احترامًا لشروط الاستخدام.', 70, true)
on conflict (name, watch_url) do nothing;

comment on table public.tv_channels is 'Curated channel metadata. Client roles can read active rows only; writes are performed by the owner-verified tv-channel-admin Edge Function.';
comment on column public.tv_channels.behavior is 'external for official links; youtube, hls, or video only when embedding/rebroadcast rights are confirmed.';

notify pgrst, 'reload schema';
