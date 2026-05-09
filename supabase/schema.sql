-- ============================================================
-- Invitely — Supabase Schema
-- Run this in your Supabase project SQL editor
-- ============================================================

-- Templates table
create table if not exists templates (
  id              text primary key,
  name            text not null,
  category        text not null check (category in (
    'birthday', 'kids_birthday', 'wedding',
    'baby_shower', 'baby_announcement', 'anniversary'
  )),
  subcategory     text[]   default '{}',
  style_tags      text[]   default '{}',
  tier            text     not null default 'free' check (tier in ('free', 'premium')),
  orientation     text     default 'portrait',
  aspect_ratio    text     default '5:7',
  bg_image_url    text     not null,
  thumb_url       text     not null,
  color_palette   text[]   default '{}',
  text_zones      jsonb    not null default '[]',
  fonts_used      text[]   default '{}',
  usage_count     integer  default 0,
  is_active       boolean  default true,
  created_at      timestamptz default now()
);

-- Saved cards table
create table if not exists saved_cards (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  template_id text references templates(id),
  status      text default 'draft' check (status in ('draft', 'completed')),
  card_data   jsonb not null,
  output_url  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- User favourites table
create table if not exists user_favourites (
  user_id     uuid references auth.users(id) on delete cascade,
  template_id text references templates(id) on delete cascade,
  created_at  timestamptz default now(),
  primary key (user_id, template_id)
);

-- Row-level security
alter table templates enable row level security;
alter table saved_cards enable row level security;
alter table user_favourites enable row level security;

-- Templates: public read
create policy "Public templates read"
  on templates for select
  using (is_active = true);

-- Saved cards: owner only
create policy "Users manage own cards"
  on saved_cards for all
  using (auth.uid() = user_id);

-- Favourites: owner only
create policy "Users manage own favourites"
  on user_favourites for all
  using (auth.uid() = user_id);

-- ============================================================
-- Seed: 7 real templates
--
-- BEFORE RUNNING THIS SECTION:
--   1. Go to Supabase → Storage → Create bucket named "templates" (set to Public)
--   2. Upload all 7 PNGs from assets/templates/ with these exact filenames:
--        bday-30th-sarah.png
--        bday-40th-robert.png
--        kbday-blastoff-leo.png
--        kbday-woodland-maya.png
--        bshower-littlestar.png
--        anniv-25th-emily-liam.png
--        anniv-hearts-sarah-david.png  ← rename unknown-template.png before uploading
--   3. Then run only this INSERT block.
--
-- Storage URL pattern:
--   https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/{filename}
-- ============================================================

insert into templates (
  id, name, category, subcategory, style_tags, tier,
  orientation, aspect_ratio,
  bg_image_url, thumb_url,
  color_palette, text_zones, fonts_used, usage_count
) values

-- ── 1. Birthday — 30th Sarah (dark navy/gold geometric, landscape) ──────────
(
  'bday-30th-sarah',
  '30th Birthday — Navy Gold',
  'birthday',
  array['adults', 'milestone'],
  array['geometric', 'elegant', 'dark', 'gold'],
  'free',
  'landscape', '7:5',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bday-30th-sarah.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bday-30th-sarah.png',
  array['#0D1B3E', '#C9A96E', '#FFFFFF', '#1A1614'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"You Are Invited To","x":20,"y":8,"w":60,"h":8,"fontFamily":"PlayfairDisplay_400Regular","fontSize":14,"color":"#FFFFFF","align":"center","bold":false,"italic":true},
    {"id":"name","label":"Name","defaultText":"SARAH","x":5,"y":20,"w":90,"h":22,"fontFamily":"PlayfairDisplay_700Bold","fontSize":42,"color":"#C9A96E","align":"center","bold":true,"italic":false},
    {"id":"occasion","label":"Occasion","defaultText":"30th Birthday Celebration","x":10,"y":46,"w":80,"h":10,"fontFamily":"PlayfairDisplay_400Regular","fontSize":18,"color":"#FFFFFF","align":"center","bold":false,"italic":true},
    {"id":"date","label":"Date","defaultText":"Saturday, June 14th 2025","x":15,"y":63,"w":70,"h":8,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"7:00 PM","x":15,"y":73,"w":70,"h":8,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"The Grand Ballroom, New Delhi","x":10,"y":83,"w":80,"h":8,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"rgba(255,255,255,0.85)","align":"center","bold":false,"italic":false},
    {"id":"rsvp","label":"RSVP","defaultText":"RSVP: +91 98765 43210","x":15,"y":93,"w":70,"h":6,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#C9A96E","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['PlayfairDisplay_700Bold', 'PlayfairDisplay_400Regular', 'DMSans_400Regular'],
  0
),

-- ── 2. Birthday — 40th Robert (cream parchment, Art & Wine, landscape) ──────
(
  'bday-40th-robert',
  '40th Birthday — Art & Wine',
  'birthday',
  array['adults', 'milestone'],
  array['parchment', 'artsy', 'warm', 'wine'],
  'free',
  'landscape', '7:5',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bday-40th-robert.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bday-40th-robert.png',
  array['#F5F0E8', '#6B4423', '#C9A96E', '#3D8A8A'],
  '[
    {"id":"header","label":"Header","defaultText":"AN EVENING OF ART & WINE","x":5,"y":10,"w":55,"h":10,"fontFamily":"DMSans_700Bold","fontSize":16,"color":"#4A2C17","align":"center","bold":true,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"CELEBRATING THE 40TH BIRTHDAY OF","x":5,"y":24,"w":55,"h":7,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Name","defaultText":"ROBERT","x":5,"y":34,"w":55,"h":18,"fontFamily":"PlayfairDisplay_700Bold","fontSize":36,"color":"#4A2C17","align":"center","bold":true,"italic":false},
    {"id":"occasion","label":"Occasion","defaultText":"40th Birthday Soirée","x":5,"y":55,"w":55,"h":9,"fontFamily":"PlayfairDisplay_400Regular","fontSize":16,"color":"#6B4423","align":"center","bold":false,"italic":true},
    {"id":"date","label":"Date","defaultText":"Saturday, October 12th 2025","x":5,"y":68,"w":55,"h":8,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"7:00 PM – 11:00 PM","x":5,"y":78,"w":55,"h":8,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"The Heritage Hall, Mumbai","x":5,"y":89,"w":55,"h":8,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#4A2C17","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['PlayfairDisplay_700Bold', 'PlayfairDisplay_400Regular', 'DMSans_700Bold', 'DMSans_400Regular'],
  0
),

-- ── 3. Kids Birthday — Blast Off Leo (space/rocket, landscape) ───────────────
(
  'kbday-blastoff-leo',
  'Blast Off! Space Party',
  'kids_birthday',
  array['kids', 'space', 'boys'],
  array['space', 'rocket', 'colorful', 'playful'],
  'free',
  'landscape', '7:5',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-blastoff-leo.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-blastoff-leo.png',
  array['#1A237E', '#00BCD4', '#FFD54F', '#FFFFFF'],
  '[
    {"id":"title","label":"Title","defaultText":"BLAST OFF!","x":42,"y":8,"w":55,"h":14,"fontFamily":"PlayfairDisplay_700Bold","fontSize":32,"color":"#1A237E","align":"center","bold":true,"italic":false},
    {"id":"name","label":"Astronaut Name","defaultText":"JOIN ASTRONAUT LEO!","x":42,"y":27,"w":55,"h":9,"fontFamily":"DMSans_700Bold","fontSize":15,"color":"#1A237E","align":"center","bold":true,"italic":false},
    {"id":"occasion","label":"Occasion","defaultText":"4th Birthday Bash!","x":42,"y":40,"w":55,"h":9,"fontFamily":"PlayfairDisplay_400Regular","fontSize":16,"color":"#E65100","align":"center","bold":false,"italic":true},
    {"id":"tagline","label":"Tagline","defaultText":"To the Moon & Back!","x":42,"y":53,"w":55,"h":8,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#1A237E","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"Saturday, March 8th 2025","x":42,"y":65,"w":55,"h":8,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#1A237E","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"3:00 PM – 6:00 PM","x":42,"y":75,"w":55,"h":8,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#1A237E","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"12 Starship Lane, Bangalore","x":42,"y":85,"w":55,"h":8,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#1A237E","align":"center","bold":false,"italic":false},
    {"id":"rsvp","label":"RSVP","defaultText":"RSVP: +91 98765 43210","x":42,"y":94,"w":55,"h":5,"fontFamily":"DMSans_400Regular","fontSize":10,"color":"#E65100","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['PlayfairDisplay_700Bold', 'PlayfairDisplay_400Regular', 'DMSans_700Bold', 'DMSans_400Regular'],
  0
),

-- ── 4. Kids Birthday — Woodland Maya (deer/fox floral border, portrait) ──────
(
  'kbday-woodland-maya',
  'Woodland Tea Party',
  'kids_birthday',
  array['kids', 'girls', 'nature'],
  array['woodland', 'floral', 'whimsical', 'pastel'],
  'free',
  'portrait', '5:7',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-woodland-maya.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-woodland-maya.png',
  array['#5A8A5A', '#6B4423', '#FAF8F5', '#E8A87C'],
  '[
    {"id":"header","label":"Header","defaultText":"YOU''RE INVITED TO A","x":15,"y":14,"w":70,"h":5,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"event","label":"Event","defaultText":"WOODLAND TEA PARTY","x":8,"y":21,"w":84,"h":11,"fontFamily":"PlayfairDisplay_700Bold","fontSize":26,"color":"#3D5A23","align":"center","bold":true,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"CELEBRATING THE 5TH BIRTHDAY OF","x":10,"y":35,"w":80,"h":5,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Child''s Name","defaultText":"MAYA","x":8,"y":42,"w":84,"h":14,"fontFamily":"PlayfairDisplay_700Bold","fontSize":36,"color":"#4A2C17","align":"center","bold":true,"italic":false},
    {"id":"date","label":"Date","defaultText":"Sunday, April 20th 2025","x":20,"y":62,"w":60,"h":5,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"3:00 PM – 6:00 PM","x":20,"y":69,"w":60,"h":5,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"Woodland Cottage, Pune","x":20,"y":76,"w":60,"h":5,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"rsvp","label":"RSVP","defaultText":"RSVP: hello@email.com","x":20,"y":84,"w":60,"h":5,"fontFamily":"DMSans_400Regular","fontSize":10,"color":"#3D5A23","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['PlayfairDisplay_700Bold', 'DMSans_400Regular'],
  0
),

-- ── 5. Baby Shower — Little Star (pastel moon/stars watercolor, landscape) ───
(
  'bshower-littlestar',
  'A Little Star Baby Shower',
  'baby_shower',
  array['gender-neutral', 'celestial'],
  array['pastel', 'celestial', 'soft', 'watercolor'],
  'free',
  'landscape', '7:5',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bshower-littlestar.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bshower-littlestar.png',
  array['#C5CAE9', '#F8BBD0', '#FFD54F', '#FAF8F5'],
  '[
    {"id":"header","label":"Header","defaultText":"A LITTLE STAR IS COMING","x":10,"y":8,"w":80,"h":10,"fontFamily":"PlayfairDisplay_700Bold","fontSize":22,"color":"#5C4B8A","align":"center","bold":true,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"JOIN US FOR A BABY SHOWER HONORING","x":10,"y":22,"w":80,"h":7,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#5C4B8A","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Honoree Name","defaultText":"PRIYA SHARMA","x":5,"y":32,"w":90,"h":15,"fontFamily":"PlayfairDisplay_700Bold","fontSize":30,"color":"#C96442","align":"center","bold":true,"italic":false},
    {"id":"date","label":"Date","defaultText":"Sunday, August 10th 2025","x":15,"y":54,"w":70,"h":8,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#5C4B8A","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"11:00 AM – 2:00 PM","x":15,"y":64,"w":70,"h":8,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#5C4B8A","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"Maple House, Bangalore","x":10,"y":74,"w":80,"h":8,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#5C4B8A","align":"center","bold":false,"italic":false},
    {"id":"rsvp","label":"RSVP","defaultText":"RSVP by July 31st","x":15,"y":84,"w":70,"h":6,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#C96442","align":"center","bold":false,"italic":false},
    {"id":"registry","label":"Registry","defaultText":"Registry: babylist.com/priya","x":15,"y":92,"w":70,"h":6,"fontFamily":"DMSans_400Regular","fontSize":10,"color":"#5C4B8A","align":"center","bold":false,"italic":true}
  ]'::jsonb,
  array['PlayfairDisplay_700Bold', 'DMSans_400Regular'],
  0
),

-- ── 6. Anniversary — 25th Emily & Liam (white cream roses, landscape) ────────
(
  'anniv-25th-emily-liam',
  '25th Anniversary — Rose Garden',
  'anniversary',
  array['25th', 'silver', 'floral'],
  array['roses', 'romantic', 'elegant', 'cream'],
  'premium',
  'landscape', '7:5',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-25th-emily-liam.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-25th-emily-liam.png',
  array['#FFFFFF', '#FAF8F5', '#C62828', '#2E7D32'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"with overflowing joy","x":5,"y":8,"w":60,"h":8,"fontFamily":"PlayfairDisplay_400Regular","fontSize":16,"color":"#2E7D32","align":"center","bold":false,"italic":true},
    {"id":"subtitle","label":"Subtitle","defaultText":"WE INVITE YOU TO CELEBRATE THE","x":5,"y":20,"w":60,"h":6,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#1A1614","align":"center","bold":false,"italic":false},
    {"id":"milestone","label":"Milestone","defaultText":"TWENTY-FIFTH","x":5,"y":29,"w":60,"h":14,"fontFamily":"PlayfairDisplay_700Bold","fontSize":32,"color":"#C62828","align":"center","bold":true,"italic":false},
    {"id":"event","label":"Event","defaultText":"ANNIVERSARY OF","x":5,"y":46,"w":60,"h":7,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#1A1614","align":"center","bold":false,"italic":false},
    {"id":"names","label":"Names","defaultText":"Emily & Liam","x":5,"y":56,"w":60,"h":12,"fontFamily":"PlayfairDisplay_700Bold","fontSize":26,"color":"#1A1614","align":"center","bold":true,"italic":false},
    {"id":"since","label":"Since","defaultText":"Joined in marriage since 2000","x":5,"y":71,"w":60,"h":7,"fontFamily":"PlayfairDisplay_400Regular","fontSize":13,"color":"#2E7D32","align":"center","bold":false,"italic":true},
    {"id":"date","label":"Date","defaultText":"Saturday, November 15th 2025","x":5,"y":82,"w":60,"h":7,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#1A1614","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"The Leela Palace, Bangalore","x":5,"y":91,"w":60,"h":7,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#666666","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['PlayfairDisplay_700Bold', 'PlayfairDisplay_400Regular', 'DMSans_400Regular'],
  0
),

-- ── 7. Anniversary — Hearts (dark burgundy/gold geometric, landscape) ─────────
(
  'anniv-hearts-sarah-david',
  'Anniversary — Burgundy Hearts',
  'anniversary',
  array['25th', 'classic', 'dark'],
  array['geometric', 'hearts', 'gold', 'dark', 'dramatic'],
  'free',
  'landscape', '7:5',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-hearts-sarah-david.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-hearts-sarah-david.png',
  array['#4A0E0E', '#C9A96E', '#FAF8F5', '#1A1614'],
  '[
    {"id":"names","label":"Names","defaultText":"Sarah & David","x":10,"y":18,"w":80,"h":18,"fontFamily":"PlayfairDisplay_700Bold","fontSize":36,"color":"#C9A96E","align":"center","bold":true,"italic":false},
    {"id":"milestone","label":"Milestone","defaultText":"25TH ANNIVERSARY","x":10,"y":39,"w":80,"h":10,"fontFamily":"DMSans_700Bold","fontSize":16,"color":"#FFFFFF","align":"center","bold":true,"italic":false},
    {"id":"date","label":"Date","defaultText":"Saturday, December 20th 2025","x":15,"y":56,"w":70,"h":8,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#C9A96E","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"7:00 PM onwards","x":15,"y":66,"w":70,"h":8,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"Grand Hyatt, Mumbai","x":15,"y":76,"w":70,"h":8,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#C9A96E","align":"center","bold":false,"italic":false},
    {"id":"rsvp","label":"RSVP","defaultText":"RSVP: +91 98765 43210","x":15,"y":87,"w":70,"h":6,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#FFFFFF","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['PlayfairDisplay_700Bold', 'DMSans_700Bold', 'DMSans_400Regular'],
  0
)

on conflict (id) do update set
  name          = excluded.name,
  text_zones    = excluded.text_zones,
  color_palette = excluded.color_palette,
  style_tags    = excluded.style_tags,
  bg_image_url  = excluded.bg_image_url,
  thumb_url     = excluded.thumb_url;
