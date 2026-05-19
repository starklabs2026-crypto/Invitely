-- ============================================================
-- Invitely — Canonical Schema
-- Single idempotent script: tables + RLS + all 17 templates
-- Run entirely in the Supabase SQL editor (safe to re-run)
--
-- BEFORE RUNNING:
--   1. Create a "templates" bucket in Supabase Storage (set Public)
--   2. Upload all 17 PNGs from assets/templates/ with exact filenames
-- ============================================================

-- ── Tables ───────────────────────────────────────────────────

create table if not exists templates (
  id              text primary key,
  name            text not null,
  category        text not null check (category in (
    'birthday', 'kids_birthday', 'wedding',
    'baby_shower', 'baby_announcement', 'anniversary', 'festival'
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
  created_at      timestamptz default now(),

  -- Ingestion pipeline fields (populated after AI processing)
  text_zones_v2   jsonb,
  draft_zones     jsonb,
  review_status   text default 'manual' check (review_status in ('manual','ai_draft','pending_review','approved')),
  ai_confidence   float
);

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

create table if not exists user_favourites (
  user_id     uuid references auth.users(id) on delete cascade,
  template_id text references templates(id) on delete cascade,
  created_at  timestamptz default now(),
  primary key (user_id, template_id)
);

-- ── Row-level security ────────────────────────────────────────

alter table templates        enable row level security;
alter table saved_cards      enable row level security;
alter table user_favourites  enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'templates' and policyname = 'Public templates read'
  ) then
    create policy "Public templates read"
      on templates for select using (is_active = true);
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'saved_cards' and policyname = 'Users manage own cards'
  ) then
    create policy "Users manage own cards"
      on saved_cards for all using (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'user_favourites' and policyname = 'Users manage own favourites'
  ) then
    create policy "Users manage own favourites"
      on user_favourites for all using (auth.uid() = user_id);
  end if;
end $$;

-- ── Templates seed (17 templates, final font/zone values) ─────
-- Storage URL pattern:
--   https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/{filename}

insert into templates (
  id, name, category, subcategory, style_tags, tier,
  orientation, aspect_ratio, bg_image_url, thumb_url,
  color_palette, text_zones, fonts_used, usage_count
) values

-- ── 1. bday-30th-sarah ───────────────────────────────────────
(
  'bday-30th-sarah', '30th Birthday — Navy Gold', 'birthday',
  array['adults','milestone'], array['geometric','elegant','dark','gold'],
  'free', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bday-30th-sarah.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bday-30th-sarah.png',
  array['#0D1B3E','#C9A96E','#FFFFFF','#1A1614'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"You Are Invited To","x":20,"y":8,"w":60,"h":9,"fontFamily":"Montserrat_400Regular","fontSize":28,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Name","defaultText":"SARAH","x":5,"y":20,"w":90,"h":22,"fontFamily":"PinyonScript_400Regular","fontSize":42,"color":"#C9A96E","align":"center","bold":false,"italic":false},
    {"id":"occasion","label":"Occasion","defaultText":"30th Birthday Celebration","x":10,"y":46,"w":80,"h":10,"fontFamily":"DancingScript_400Regular","fontSize":18,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"Saturday, June 14th 2025","x":15,"y":63,"w":70,"h":8,"fontFamily":"EBGaramond_400Regular","fontSize":13,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"7:00 PM","x":15,"y":73,"w":70,"h":8,"fontFamily":"EBGaramond_400Regular","fontSize":13,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"The Grand Ballroom, New Delhi","x":10,"y":83,"w":80,"h":8,"fontFamily":"EBGaramond_400Regular","fontSize":12,"color":"rgba(255,255,255,0.85)","align":"center","bold":false,"italic":false},
    {"id":"rsvp","label":"RSVP","defaultText":"RSVP: +91 98765 43210","x":15,"y":93,"w":70,"h":6,"fontFamily":"EBGaramond_400Regular","fontSize":11,"color":"#C9A96E","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['Montserrat_400Regular','PinyonScript_400Regular','DancingScript_400Regular','EBGaramond_400Regular'], 0
),

-- ── 2. bday-40th-robert ──────────────────────────────────────
(
  'bday-40th-robert', '40th Birthday — Art & Wine', 'birthday',
  array['adults','milestone'], array['parchment','artsy','warm','wine'],
  'free', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bday-40th-robert.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bday-40th-robert.png',
  array['#B8C4CC','#6B1E1E','#C9A96E','#2C2C2C'],
  '[
    {"id":"header","label":"Header","defaultText":"AN EVENING OF ART & WINE","x":42,"y":10,"w":54,"h":10,"fontFamily":"Cinzel_700Bold","fontSize":16,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"CELEBRATING THE 40TH BIRTHDAY OF","x":42,"y":24,"w":54,"h":7,"fontFamily":"CormorantSC_400Regular","fontSize":11,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Name","defaultText":"ROBERT","x":42,"y":34,"w":54,"h":18,"fontFamily":"PermanentMarker_400Regular","fontSize":36,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"occasion","label":"Occasion","defaultText":"40th Birthday Soirée","x":42,"y":55,"w":54,"h":9,"fontFamily":"Caveat_400Regular","fontSize":16,"color":"#6B4423","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"Saturday, October 12th 2025","x":42,"y":68,"w":54,"h":8,"fontFamily":"CormorantGaramond_400Regular","fontSize":12,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"7:00 PM – 11:00 PM","x":42,"y":78,"w":54,"h":8,"fontFamily":"CormorantGaramond_400Regular","fontSize":12,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"The Heritage Hall, Mumbai","x":42,"y":89,"w":54,"h":8,"fontFamily":"CormorantGaramond_400Regular","fontSize":12,"color":"#4A2C17","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['Cinzel_700Bold','CormorantSC_400Regular','PermanentMarker_400Regular','Caveat_400Regular','CormorantGaramond_400Regular'], 0
),

-- ── 3. kbday-blastoff-leo ────────────────────────────────────
(
  'kbday-blastoff-leo', 'Blast Off! Space Party', 'kids_birthday',
  array['kids','space','boys'], array['space','rocket','colorful','playful'],
  'free', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-blastoff-leo.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-blastoff-leo.png',
  array['#F5F0E8','#1565C0','#E65100','#FAF8F5'],
  '[
    {"id":"title","label":"Title","defaultText":"BLAST OFF!","x":42,"y":8,"w":55,"h":14,"fontFamily":"Cinzel_700Bold","fontSize":32,"color":"#1A237E","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Astronaut Name","defaultText":"JOIN ASTRONAUT LEO!","x":42,"y":27,"w":55,"h":9,"fontFamily":"Oswald_400Regular","fontSize":15,"color":"#1A237E","align":"center","bold":false,"italic":false},
    {"id":"occasion","label":"Occasion","defaultText":"4th Birthday Bash!","x":42,"y":40,"w":55,"h":9,"fontFamily":"GreatVibes_400Regular","fontSize":16,"color":"#E65100","align":"center","bold":false,"italic":false},
    {"id":"tagline","label":"Tagline","defaultText":"To the Moon & Back!","x":42,"y":53,"w":55,"h":8,"fontFamily":"Oswald_400Regular","fontSize":13,"color":"#1A237E","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"Saturday, March 8th 2025","x":42,"y":65,"w":55,"h":8,"fontFamily":"Oswald_400Regular","fontSize":12,"color":"#1A237E","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"3:00 PM – 6:00 PM","x":42,"y":75,"w":55,"h":8,"fontFamily":"Oswald_400Regular","fontSize":12,"color":"#1A237E","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"12 Starship Lane, Bangalore","x":42,"y":85,"w":55,"h":8,"fontFamily":"Oswald_400Regular","fontSize":11,"color":"#1A237E","align":"center","bold":false,"italic":false},
    {"id":"rsvp","label":"RSVP","defaultText":"RSVP: +91 98765 43210","x":42,"y":94,"w":55,"h":5,"fontFamily":"Oswald_400Regular","fontSize":10,"color":"#E65100","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['Cinzel_700Bold','GreatVibes_400Regular','Oswald_400Regular'], 0
),

-- ── 4. kbday-woodland-maya ───────────────────────────────────
(
  'kbday-woodland-maya', 'Woodland Tea Party', 'kids_birthday',
  array['kids','girls','nature'], array['woodland','floral','whimsical','pastel'],
  'free', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-woodland-maya.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-woodland-maya.png',
  array['#5A8A5A','#6B4423','#FAF8F5','#E8A87C'],
  '[
    {"id":"header","label":"Header","defaultText":"YOU''RE INVITED TO A","x":15,"y":14,"w":70,"h":5,"fontFamily":"AmaticSC_400Regular","fontSize":12,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"event","label":"Event","defaultText":"WOODLAND TEA PARTY","x":8,"y":21,"w":84,"h":11,"fontFamily":"AmaticSC_700Bold","fontSize":26,"color":"#3D5A23","align":"center","bold":false,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"CELEBRATING THE 5TH BIRTHDAY OF","x":10,"y":60,"w":80,"h":5,"fontFamily":"Montserrat_400Regular","fontSize":11,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Child''s Name","defaultText":"MAYA","x":8,"y":65,"w":84,"h":12,"fontFamily":"Rye_400Regular","fontSize":36,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"Sunday, April 20th 2025","x":20,"y":79,"w":60,"h":5,"fontFamily":"Montserrat_400Regular","fontSize":12,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"3:00 PM – 6:00 PM","x":20,"y":85,"w":60,"h":5,"fontFamily":"Montserrat_400Regular","fontSize":12,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"Woodland Cottage, Pune","x":20,"y":90,"w":60,"h":5,"fontFamily":"Montserrat_400Regular","fontSize":11,"color":"#4A2C17","align":"center","bold":false,"italic":false},
    {"id":"rsvp","label":"RSVP","defaultText":"RSVP: hello@email.com","x":20,"y":95,"w":60,"h":4,"fontFamily":"Montserrat_400Regular","fontSize":10,"color":"#3D5A23","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['AmaticSC_700Bold','AmaticSC_400Regular','Rye_400Regular','Montserrat_400Regular'], 0
),

-- ── 5. bshower-littlestar ────────────────────────────────────
(
  'bshower-littlestar', 'A Little Star Baby Shower', 'baby_shower',
  array['gender-neutral','celestial'], array['pastel','celestial','soft','watercolor'],
  'free', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bshower-littlestar.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bshower-littlestar.png',
  array['#C5CAE9','#F8BBD0','#FFD54F','#FAF8F5'],
  '[
    {"id":"header","label":"Header","defaultText":"A LITTLE STAR IS COMING","x":10,"y":54,"w":80,"h":7,"fontFamily":"Oswald_700Bold","fontSize":22,"color":"#5C4B8A","align":"center","bold":false,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"JOIN US FOR A BABY SHOWER HONORING","x":10,"y":62,"w":80,"h":5,"fontFamily":"Oswald_400Regular","fontSize":12,"color":"#5C4B8A","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Honoree Name","defaultText":"PRIYA SHARMA","x":5,"y":68,"w":90,"h":9,"fontFamily":"Spirax_400Regular","fontSize":30,"color":"#7C3AED","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"Sunday, August 10th 2025","x":15,"y":79,"w":70,"h":6,"fontFamily":"Oswald_400Regular","fontSize":13,"color":"#5C4B8A","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"11:00 AM – 2:00 PM","x":15,"y":86,"w":70,"h":6,"fontFamily":"Oswald_400Regular","fontSize":13,"color":"#5C4B8A","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"Maple House, Bangalore","x":10,"y":93,"w":80,"h":5,"fontFamily":"Oswald_400Regular","fontSize":12,"color":"#5C4B8A","align":"center","bold":false,"italic":false},
    {"id":"rsvp","label":"RSVP","defaultText":"RSVP by July 31st","x":15,"y":98,"w":70,"h":2,"fontFamily":"Oswald_400Regular","fontSize":11,"color":"#7C3AED","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['Oswald_700Bold','Oswald_400Regular','Spirax_400Regular'], 0
),

-- ── 6. anniv-25th-emily-liam ─────────────────────────────────
(
  'anniv-25th-emily-liam', '25th Anniversary — Rose Garden', 'anniversary',
  array['25th','silver','floral'], array['roses','romantic','elegant','cream'],
  'premium', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-25th-emily-liam.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-25th-emily-liam.png',
  array['#FFFFFF','#FAF8F5','#C62828','#2E7D32'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"with overflowing joy","x":5,"y":18,"w":60,"h":9,"fontFamily":"PinyonScript_400Regular","fontSize":28,"color":"#2E7D32","align":"center","bold":false,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"WE INVITE YOU TO CELEBRATE THE","x":5,"y":29,"w":60,"h":6,"fontFamily":"CormorantSC_400Regular","fontSize":11,"color":"#1A1614","align":"center","bold":false,"italic":false},
    {"id":"milestone","label":"Milestone","defaultText":"TWENTY-FIFTH","x":5,"y":37,"w":60,"h":14,"fontFamily":"Cinzel_700Bold","fontSize":32,"color":"#C62828","align":"center","bold":false,"italic":false},
    {"id":"event","label":"Event","defaultText":"ANNIVERSARY OF","x":5,"y":53,"w":60,"h":7,"fontFamily":"CormorantSC_400Regular","fontSize":13,"color":"#1A1614","align":"center","bold":false,"italic":false},
    {"id":"names","label":"Names","defaultText":"Emily & Liam","x":5,"y":62,"w":60,"h":11,"fontFamily":"Cinzel_400Regular","fontSize":36,"color":"#1A1614","align":"center","bold":false,"italic":false},
    {"id":"since","label":"Since","defaultText":"Joined in marriage since 2000","x":5,"y":74,"w":60,"h":7,"fontFamily":"CormorantGaramond_400Regular","fontSize":18,"color":"#2E7D32","align":"center","bold":false,"italic":true},
    {"id":"date","label":"Date","defaultText":"Saturday, November 15th 2025","x":5,"y":83,"w":60,"h":7,"fontFamily":"CormorantGaramond_400Regular","fontSize":12,"color":"#1A1614","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"The Leela Palace, Bangalore","x":5,"y":92,"w":60,"h":7,"fontFamily":"CormorantGaramond_400Regular","fontSize":11,"color":"#666666","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['PinyonScript_400Regular','CormorantSC_400Regular','Cinzel_700Bold','Cinzel_400Regular','CormorantGaramond_400Regular'], 0
),

-- ── 7. anniv-hearts-sarah-david ──────────────────────────────
(
  'anniv-hearts-sarah-david', 'Anniversary — Burgundy Hearts', 'anniversary',
  array['25th','classic','dark'], array['geometric','hearts','gold','dark','dramatic'],
  'free', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-hearts-sarah-david.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-hearts-sarah-david.png',
  array['#4A0E0E','#C9A96E','#FAF8F5','#1A1614'],
  '[
    {"id":"names","label":"Names","defaultText":"Sarah & David","x":10,"y":58,"w":80,"h":10,"fontFamily":"PinyonScript_400Regular","fontSize":48,"color":"#C9A96E","align":"center","bold":false,"italic":false},
    {"id":"milestone","label":"Milestone","defaultText":"25TH ANNIVERSARY","x":10,"y":70,"w":80,"h":8,"fontFamily":"Cinzel_700Bold","fontSize":16,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"Saturday, December 20th 2025","x":15,"y":79,"w":70,"h":7,"fontFamily":"CormorantGaramond_400Regular","fontSize":13,"color":"#C9A96E","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"7:00 PM onwards","x":15,"y":87,"w":70,"h":6,"fontFamily":"CormorantGaramond_400Regular","fontSize":13,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"Grand Hyatt, Mumbai","x":15,"y":93,"w":70,"h":5,"fontFamily":"CormorantGaramond_400Regular","fontSize":12,"color":"#C9A96E","align":"center","bold":false,"italic":false},
    {"id":"rsvp","label":"RSVP","defaultText":"RSVP: +91 98765 43210","x":15,"y":98,"w":70,"h":2,"fontFamily":"CormorantGaramond_400Regular","fontSize":11,"color":"#FFFFFF","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['PinyonScript_400Regular','Cinzel_700Bold','CormorantGaramond_400Regular'], 0
),

-- ── 8. anniv-25th-champagne-gold ─────────────────────────────
(
  'anniv-25th-champagne-gold', '25th Anniversary — Champagne Gold', 'anniversary',
  array['25th','silver','classic'], array['champagne','gold','elegant','watercolor','cream'],
  'free', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-25th-champagne-gold.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-25th-champagne-gold.png',
  array['#F5ECD7','#C9A84C','#2C2C2C','#8B7355'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"YOU''RE INVITED TO CELEBRATE OUR","x":48,"y":3,"w":46,"h":5,"fontFamily":"CormorantGaramond_400Regular","fontSize":11,"color":"#2C2C2C","align":"center","bold":false,"italic":false},
    {"id":"milestone","label":"Milestone","defaultText":"25th","x":47,"y":8,"w":47,"h":20,"fontFamily":"BodoniModa_700Bold","fontSize":68,"color":"#C9A84C","align":"center","bold":true,"italic":false},
    {"id":"event_type","label":"Event Type","defaultText":"Anniversary","x":47,"y":28,"w":47,"h":5,"fontFamily":"GreatVibes_400Regular","fontSize":38,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"25 YEARS OF LOVE, LAUGHTER & BEAUTIFUL MEMORIES","x":46,"y":42,"w":49,"h":7,"fontFamily":"CormorantGaramond_400Regular","fontSize":11,"color":"#2C2C2C","align":"center","bold":false,"italic":false},
    {"id":"description","label":"Description","defaultText":"JOIN US FOR AN EVENING OF CELEBRATION, DINNER & TOASTS AS WE CELEBRATE THIS SPECIAL MILESTONE TOGETHER.","x":46,"y":54,"w":49,"h":8,"fontFamily":"CormorantGaramond_400Regular","fontSize":10,"color":"#2C2C2C","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25 MAY 2025","x":4,"y":66,"w":24,"h":9,"fontFamily":"CormorantGaramond_400Regular","fontSize":12,"color":"#2C2C2C","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"6:00 PM\nONWARDS","x":35,"y":66,"w":24,"h":9,"fontFamily":"CormorantGaramond_400Regular","fontSize":12,"color":"#2C2C2C","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE GRAND HALL\n123, CELEBRATION STREET,\nHAPPY TOWN, NEW DELHI – 110001","x":66,"y":66,"w":30,"h":9,"fontFamily":"CormorantGaramond_400Regular","fontSize":10,"color":"#2C2C2C","align":"center","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"We can''t wait to celebrate with you!","x":20,"y":88,"w":60,"h":5,"fontFamily":"GreatVibes_400Regular","fontSize":22,"color":"#C9A84C","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['BodoniModa_700Bold','GreatVibes_400Regular','CormorantGaramond_400Regular'], 0
),

-- ── 9. anniv-25th-navy-lights ────────────────────────────────
(
  'anniv-25th-navy-lights', '25th Anniversary — Navy Lights', 'anniversary',
  array['25th','silver','night'], array['navy','gold','string-lights','botanical','elegant','dark'],
  'free', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-25th-navy-lights.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-25th-navy-lights.png',
  array['#1A2744','#C9A84C','#FFFFFF','#2A3D5A'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"YOU''RE INVITED TO CELEBRATE OUR","x":20,"y":17,"w":60,"h":6,"fontFamily":"Cinzel_400Regular","fontSize":12,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"milestone","label":"Milestone","defaultText":"25th","x":20,"y":22,"w":60,"h":22,"fontFamily":"BodoniModa_700Bold","fontSize":68,"color":"#C9A84C","align":"center","bold":true,"italic":false},
    {"id":"event_type","label":"Event Type","defaultText":"Anniversary","x":20,"y":43,"w":60,"h":10,"fontFamily":"GreatVibes_400Regular","fontSize":42,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"25 YEARS OF LOVE, LAUGHTER & BEAUTIFUL MEMORIES","x":20,"y":57,"w":60,"h":7,"fontFamily":"Cinzel_400Regular","fontSize":12,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"description","label":"Description","defaultText":"JOIN US FOR AN EVENING OF CELEBRATION, DINNER & TOASTS AS WE CELEBRATE THIS SPECIAL MILESTONE TOGETHER.","x":20,"y":66,"w":60,"h":11,"fontFamily":"Cinzel_400Regular","fontSize":11,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25 MAY 2025","x":3,"y":78,"w":29,"h":12,"fontFamily":"Cinzel_400Regular","fontSize":12,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"6:00 PM\nONWARDS","x":34,"y":78,"w":30,"h":12,"fontFamily":"Cinzel_400Regular","fontSize":12,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE GRAND HALL\n123, CELEBRATION STREET,\nHAPPY TOWN, NEW DELHI – 110001","x":66,"y":76,"w":31,"h":14,"fontFamily":"Cinzel_400Regular","fontSize":10,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"We can''t wait to celebrate with you!","x":20,"y":93,"w":60,"h":5,"fontFamily":"GreatVibes_400Regular","fontSize":22,"color":"#C9A84C","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['BodoniModa_700Bold','GreatVibes_400Regular','Cinzel_400Regular'], 0
),

-- ── 10. kbday-teddy-1st-girl ─────────────────────────────────
(
  'kbday-teddy-1st-girl', '1st Birthday — Teddy Bear Girl', 'kids_birthday',
  array['kids','girls','1st-birthday'], array['pink','teddy-bear','balloons','watercolor','cute','pastel'],
  'free', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-teddy-1st-girl.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-teddy-1st-girl.png',
  array['#F5C5C5','#E8A0A0','#D4707A','#F5E8E8'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"OUR LITTLE","x":28,"y":15,"w":44,"h":4,"fontFamily":"CormorantGaramond_400Regular","fontSize":13,"color":"#6B3333","align":"center","bold":false,"italic":false},
    {"id":"title","label":"Title","defaultText":"Bundle of Joy","x":12,"y":18,"w":76,"h":9,"fontFamily":"Allura_400Regular","fontSize":52,"color":"#D4707A","align":"center","bold":false,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"IS TURNING","x":30,"y":27,"w":40,"h":4,"fontFamily":"CormorantGaramond_400Regular","fontSize":13,"color":"#5C3030","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Child''s Name","defaultText":"Aaradhya''s","x":8,"y":68,"w":84,"h":8,"fontFamily":"Allura_400Regular","fontSize":52,"color":"#D4707A","align":"center","bold":false,"italic":false},
    {"id":"event","label":"Event","defaultText":"1st Birthday","x":18,"y":76,"w":64,"h":6,"fontFamily":"Cinzel_700Bold","fontSize":22,"color":"#3D1A1A","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25\nMAY\n2025","x":2,"y":80,"w":24,"h":14,"fontFamily":"CormorantGaramond_400Regular","fontSize":12,"color":"#3D1A1A","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"4:00 PM\nONWARDS","x":28,"y":83,"w":36,"h":9,"fontFamily":"CormorantGaramond_400Regular","fontSize":14,"color":"#3D1A1A","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE PARTY HOUSE\n123, Celebration Street,\nHappy Town,\nNew Delhi – 110001","x":66,"y":80,"w":31,"h":14,"fontFamily":"CormorantGaramond_400Regular","fontSize":10,"color":"#D4707A","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['Allura_400Regular','Cinzel_700Bold','CormorantGaramond_400Regular'], 0
),

-- ── 11. holi-party-colors ────────────────────────────────────
(
  'holi-party-colors', 'Holi Party — Color Splash', 'festival',
  array['holi','indian','colorful'], array['holi','vibrant','rainbow','festival','indian','colorful'],
  'free', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/holi-party-colors.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/holi-party-colors.png',
  array['#FF1493','#9400D3','#FF6600','#00CED1','#F5F5F5'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"YOU''RE INVITED TO A","x":20,"y":8,"w":60,"h":5,"fontFamily":"BebasNeue_400Regular","fontSize":14,"color":"#333333","align":"center","bold":false,"italic":false},
    {"id":"event_title","label":"Event Title","defaultText":"Holi","x":10,"y":12,"w":80,"h":18,"fontFamily":"PermanentMarker_400Regular","fontSize":72,"color":"#FF1493","align":"center","bold":false,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"Party!","x":15,"y":30,"w":70,"h":10,"fontFamily":"KaushanScript_400Regular","fontSize":46,"color":"#5B2D8E","align":"center","bold":false,"italic":false},
    {"id":"tagline2","label":"Tagline 2","defaultText":"LET''S PLAY, LAUGH & GET COLORED!","x":12,"y":41,"w":76,"h":6,"fontFamily":"BebasNeue_400Regular","fontSize":14,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25 MAY 2025","x":3,"y":49,"w":30,"h":9,"fontFamily":"BebasNeue_400Regular","fontSize":13,"color":"#333333","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"11:00 AM\nONWARDS","x":36,"y":49,"w":28,"h":9,"fontFamily":"BebasNeue_400Regular","fontSize":13,"color":"#333333","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE GRAND LAWNS\n123, CELEBRATION STREET,\nHAPPY TOWN, NEW DELHI – 110001","x":66,"y":48,"w":32,"h":12,"fontFamily":"BebasNeue_400Regular","fontSize":10,"color":"#333333","align":"center","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"Wear white, bring your energy\nand let''s make it a colorful day!","x":8,"y":80,"w":84,"h":7,"fontFamily":"KaushanScript_400Regular","fontSize":14,"color":"#D4006A","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['PermanentMarker_400Regular','KaushanScript_400Regular','BebasNeue_400Regular'], 0
),

-- ── 12. kbday-teaparty-3rd-girl ──────────────────────────────
(
  'kbday-teaparty-3rd-girl', 'Tea Party Birthday — Girl', 'kids_birthday',
  array['kids','girls','tea-party'], array['pink','tea-party','cute','watercolor','pastel','bunting'],
  'free', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-teaparty-3rd-girl.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-teaparty-3rd-girl.png',
  array['#F5C5C5','#E07090','#C8A4A4','#F5EAE0'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"YOU''RE INVITED TO A","x":18,"y":17,"w":64,"h":4,"fontFamily":"PatrickHand_400Regular","fontSize":12,"color":"#5C3030","align":"center","bold":false,"italic":false},
    {"id":"event","label":"Event","defaultText":"Tea Party","x":10,"y":21,"w":80,"h":11,"fontFamily":"Allura_400Regular","fontSize":62,"color":"#E07090","align":"center","bold":false,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"TO CELEBRATE","x":18,"y":33,"w":64,"h":4,"fontFamily":"PatrickHand_400Regular","fontSize":13,"color":"#5C4520","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Child''s Name","defaultText":"Aanya''s","x":10,"y":37,"w":80,"h":10,"fontFamily":"Allura_400Regular","fontSize":60,"color":"#E07090","align":"center","bold":false,"italic":false},
    {"id":"age_event","label":"Age & Event","defaultText":"3rd Birthday!","x":10,"y":47,"w":80,"h":8,"fontFamily":"PatrickHand_400Regular","fontSize":32,"color":"#333333","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25\nMAY 2025","x":3,"y":82,"w":25,"h":10,"fontFamily":"PatrickHand_400Regular","fontSize":13,"color":"#3D1A1A","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"4:00 PM\nONWARDS","x":30,"y":83,"w":38,"h":8,"fontFamily":"PatrickHand_400Regular","fontSize":15,"color":"#E07090","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE PARTY HOUSE\n123, Celebration Street,\nHappy Town,\nNew Delhi – 110001","x":65,"y":81,"w":32,"h":12,"fontFamily":"PatrickHand_400Regular","fontSize":10,"color":"#E07090","align":"center","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"WE CAN''T WAIT TO CELEBRATE WITH YOU!","x":12,"y":95,"w":76,"h":4,"fontFamily":"PatrickHand_400Regular","fontSize":11,"color":"#5C7040","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['Allura_400Regular','PatrickHand_400Regular'], 0
),

-- ── 13. bday-18th-cinema-bash ────────────────────────────────
(
  'bday-18th-cinema-bash', '18th Birthday — Cinema Bash', 'birthday',
  array['adults','milestone','18th'], array['cinema','dark','gold','theatrical','dramatic','marquee'],
  'free', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bday-18th-cinema-bash.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bday-18th-cinema-bash.png',
  array['#2D0030','#8B0000','#C9A84C','#FFFFFF'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"YOU''RE INVITED TO CELEBRATE","x":18,"y":8,"w":64,"h":4,"fontFamily":"Cinzel_400Regular","fontSize":12,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Name","defaultText":"ROHAN''S","x":8,"y":13,"w":84,"h":11,"fontFamily":"BungeeInline_400Regular","fontSize":48,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"milestone","label":"Milestone","defaultText":"18th","x":10,"y":23,"w":80,"h":20,"fontFamily":"GreatVibes_400Regular","fontSize":76,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"event","label":"Event","defaultText":"Birthday Bash!","x":10,"y":43,"w":80,"h":10,"fontFamily":"GreatVibes_400Regular","fontSize":58,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"A NIGHT OF GLAMOUR, MUSIC & MEMORIES","x":18,"y":54,"w":64,"h":7,"fontFamily":"Cinzel_400Regular","fontSize":13,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25 MAY 2025","x":22,"y":63,"w":56,"h":8,"fontFamily":"Cinzel_400Regular","fontSize":14,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"6:00 PM\nONWARDS","x":22,"y":72,"w":56,"h":7,"fontFamily":"Cinzel_400Regular","fontSize":14,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE GRAND HALL\n123, CELEBRATION STREET,\nHAPPY TOWN, NEW DELHI – 110001","x":22,"y":80,"w":56,"h":11,"fontFamily":"Cinzel_400Regular","fontSize":11,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"Dress to Impress.\nLet''s make it a Blockbuster night!","x":12,"y":93,"w":76,"h":6,"fontFamily":"GreatVibes_400Regular","fontSize":22,"color":"#C9A84C","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['BungeeInline_400Regular','GreatVibes_400Regular','Cinzel_400Regular'], 0
),

-- ── 14. kbday-dino-1st-boy ───────────────────────────────────
(
  'kbday-dino-1st-boy', '1st Birthday — Dino Roar King', 'kids_birthday',
  array['kids','boys','1st-birthday'], array['dinosaur','jungle','green','watercolor','boys','adventure'],
  'free', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-dino-1st-boy.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-dino-1st-boy.png',
  array['#4A7C3F','#8B6914','#F5E8C8','#E67820'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"OUR LITTLE","x":28,"y":11,"w":44,"h":4,"fontFamily":"CormorantSC_400Regular","fontSize":14,"color":"#3D4510","align":"center","bold":false,"italic":false},
    {"id":"title","label":"Title","defaultText":"ROAR KING","x":8,"y":13,"w":84,"h":9,"fontFamily":"Ultra_400Regular","fontSize":44,"color":"#1A3A10","align":"center","bold":false,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"IS TURNING","x":20,"y":29,"w":60,"h":5,"fontFamily":"CormorantSC_400Regular","fontSize":14,"color":"#6B4F20","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Child''s Name","defaultText":"AARAV''S","x":8,"y":62,"w":84,"h":7,"fontFamily":"Ultra_400Regular","fontSize":42,"color":"#1A3A10","align":"center","bold":false,"italic":false},
    {"id":"event","label":"Event","defaultText":"1ST BIRTHDAY PARTY","x":12,"y":69,"w":76,"h":5,"fontFamily":"BebasNeue_400Regular","fontSize":18,"color":"#5C3A10","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25\nMAY\n2025","x":3,"y":77,"w":24,"h":10,"fontFamily":"BebasNeue_400Regular","fontSize":12,"color":"#3D2010","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"4:00 PM\nONWARDS","x":32,"y":78,"w":34,"h":8,"fontFamily":"BebasNeue_400Regular","fontSize":14,"color":"#E67820","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE PARTY HOUSE\n123, Celebration Street,\nHappy Town,\nNew Delhi – 110001","x":68,"y":76,"w":29,"h":12,"fontFamily":"BebasNeue_400Regular","fontSize":10,"color":"#3D2010","align":"center","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"WE CAN''T WAIT TO CELEBRATE WITH YOU!","x":12,"y":89,"w":76,"h":6,"fontFamily":"BebasNeue_400Regular","fontSize":12,"color":"#E67820","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['Ultra_400Regular','CormorantSC_400Regular','BebasNeue_400Regular'], 0
),

-- ── 15. kbday-superhero-4th-boy ──────────────────────────────
(
  'kbday-superhero-4th-boy', '4th Birthday — Superhero Bash', 'kids_birthday',
  array['kids','boys','superhero'], array['superhero','comics','blue','action','bold','boys'],
  'free', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-superhero-4th-boy.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-superhero-4th-boy.png',
  array['#1A3A8C','#CC0000','#FFD700','#F5F5F0'],
  '[
    {"id":"name","label":"Name","defaultText":"ROHAN''S","x":12,"y":16,"w":76,"h":16,"fontFamily":"Bangers_400Regular","fontSize":52,"color":"#1A3A8C","align":"center","bold":false,"italic":false},
    {"id":"age","label":"Age","defaultText":"4TH","x":18,"y":38,"w":64,"h":15,"fontFamily":"Bangers_400Regular","fontSize":68,"color":"#FFD700","align":"center","bold":false,"italic":false},
    {"id":"quote","label":"Quote","defaultText":"A SUPER\nADVENTURE\nAWAITS!","x":2,"y":39,"w":32,"h":13,"fontFamily":"Bangers_400Regular","fontSize":13,"color":"#CC0000","align":"center","bold":false,"italic":false},
    {"id":"event","label":"Event","defaultText":"BIRTHDAY!","x":15,"y":50,"w":70,"h":7,"fontFamily":"Bangers_400Regular","fontSize":40,"color":"#1A3A8C","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25 MAY 2025","x":48,"y":63,"w":48,"h":9,"fontFamily":"Montserrat_400Regular","fontSize":13,"color":"#CC0000","align":"left","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"4:00 PM\nONWARDS","x":48,"y":73,"w":48,"h":8,"fontFamily":"Montserrat_400Regular","fontSize":13,"color":"#CC0000","align":"left","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE PARTY HOUSE\n123, Celebration Street,\nHappy Town,\nNew Delhi – 110001","x":48,"y":82,"w":48,"h":10,"fontFamily":"Montserrat_400Regular","fontSize":11,"color":"#CC0000","align":"left","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"SUIT UP & LET''S PARTY!","x":12,"y":92,"w":76,"h":6,"fontFamily":"Bangers_400Regular","fontSize":16,"color":"#FFD700","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['Bangers_400Regular','Montserrat_400Regular'], 0
),

-- ── 16. anniv-25th-sage-dinner ───────────────────────────────
(
  'anniv-25th-sage-dinner', '25th Anniversary — Sage Champagne', 'anniversary',
  array['25th','silver','dinner'], array['sage','green','watercolor','elegant','dining','champagne'],
  'free', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-25th-sage-dinner.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-25th-sage-dinner.png',
  array['#F5F0E8','#C9A84C','#4A6B4A','#1A1A1A'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"YOU''RE INVITED TO CELEBRATE OUR","x":18,"y":5,"w":64,"h":5,"fontFamily":"CormorantGaramond_400Regular","fontSize":12,"color":"#1A1A1A","align":"center","bold":false,"italic":false},
    {"id":"milestone","label":"Milestone","defaultText":"25th","x":18,"y":9,"w":64,"h":20,"fontFamily":"Prata_400Regular","fontSize":72,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"event_type","label":"Event Type","defaultText":"Anniversary","x":18,"y":29,"w":64,"h":9,"fontFamily":"AlexBrush_400Regular","fontSize":42,"color":"#2D4A2D","align":"center","bold":false,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"25 YEARS OF LOVE, LAUGHTER & BEAUTIFUL MEMORIES","x":18,"y":41,"w":64,"h":7,"fontFamily":"CormorantGaramond_400Regular","fontSize":11,"color":"#1A1A1A","align":"center","bold":false,"italic":false},
    {"id":"description","label":"Description","defaultText":"JOIN US FOR AN EVENING OF CELEBRATION, DINNER & TOASTS AS WE CELEBRATE THIS SPECIAL MILESTONE TOGETHER.","x":18,"y":48,"w":64,"h":11,"fontFamily":"CormorantGaramond_400Regular","fontSize":11,"color":"#1A1A1A","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25 MAY 2025","x":8,"y":83,"w":24,"h":9,"fontFamily":"DancingScript_400Regular","fontSize":13,"color":"#1A1A1A","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"6:00 PM\nONWARDS","x":37,"y":83,"w":24,"h":9,"fontFamily":"DancingScript_400Regular","fontSize":13,"color":"#1A1A1A","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE GRAND HALL\n123, CELEBRATION STREET,\nHAPPY TOWN, NEW DELHI – 110001","x":65,"y":81,"w":32,"h":12,"fontFamily":"CormorantGaramond_400Regular","fontSize":10,"color":"#1A1A1A","align":"center","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"WE CAN''T WAIT TO CELEBRATE WITH YOU!","x":15,"y":95,"w":70,"h":4,"fontFamily":"CormorantGaramond_400Regular","fontSize":11,"color":"#1A1A1A","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['Prata_400Regular','AlexBrush_400Regular','CormorantGaramond_400Regular','DancingScript_400Regular'], 0
),

-- ── 17. bday-18th-blackgold ──────────────────────────────────
(
  'bday-18th-blackgold', '18th Birthday — Black Gold', 'birthday',
  array['adults','milestone','18th'], array['black','gold','balloons','elegant','luxury','dark'],
  'free', 'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bday-18th-blackgold.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bday-18th-blackgold.png',
  array['#000000','#C9A84C','#FFFFFF'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"YOU''RE INVITED TO","x":20,"y":6,"w":60,"h":4,"fontFamily":"Montserrat_400Regular","fontSize":13,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"tagline2","label":"Tagline 2","defaultText":"Celebrate","x":20,"y":9,"w":60,"h":6,"fontFamily":"GreatVibes_400Regular","fontSize":44,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"milestone","label":"Milestone","defaultText":"18th","x":12,"y":15,"w":76,"h":22,"fontFamily":"BodoniModa_700Bold","fontSize":80,"color":"#C9A84C","align":"center","bold":true,"italic":false},
    {"id":"event","label":"Event","defaultText":"Birthday","x":12,"y":37,"w":76,"h":10,"fontFamily":"GreatVibes_400Regular","fontSize":62,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"connector","label":"Connector","defaultText":"OF","x":35,"y":47,"w":30,"h":3,"fontFamily":"Montserrat_400Regular","fontSize":14,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Name","defaultText":"ROHAN","x":12,"y":50,"w":76,"h":11,"fontFamily":"Cinzel_700Bold","fontSize":46,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"description","label":"Description","defaultText":"JOIN US FOR AN EVENING OF\nMUSIC, DINNER & LOTS OF MEMORIES!","x":12,"y":62,"w":76,"h":7,"fontFamily":"Montserrat_400Regular","fontSize":12,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY, 25 MAY 2025","x":12,"y":71,"w":76,"h":5,"fontFamily":"Montserrat_400Regular","fontSize":14,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"6:00 PM ONWARDS","x":12,"y":76,"w":76,"h":4,"fontFamily":"Montserrat_400Regular","fontSize":14,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE GRAND HALL\n123, CELEBRATION STREET,\nHAPPY TOWN,\nNEW DELHI – 110001","x":12,"y":81,"w":76,"h":11,"fontFamily":"Montserrat_400Regular","fontSize":12,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"Come Celebrate!\nSEE YOU THERE!","x":18,"y":93,"w":64,"h":6,"fontFamily":"GreatVibes_400Regular","fontSize":24,"color":"#C9A84C","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['BodoniModa_700Bold','GreatVibes_400Regular','Cinzel_700Bold','Montserrat_400Regular'], 0
)

on conflict (id) do update set
  name          = excluded.name,
  text_zones    = excluded.text_zones,
  color_palette = excluded.color_palette,
  style_tags    = excluded.style_tags,
  fonts_used    = excluded.fonts_used,
  bg_image_url  = excluded.bg_image_url,
  thumb_url     = excluded.thumb_url,
  aspect_ratio  = excluded.aspect_ratio,
  orientation   = excluded.orientation;
