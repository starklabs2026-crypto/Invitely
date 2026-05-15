-- ============================================================
-- Invitely — Seed Batch 2 (10 new templates)
--
-- BEFORE RUNNING:
--   1. Run the ALTER TABLE below in Supabase SQL editor to allow the
--      'festival' category (needed for the Holi template).
--   2. Upload all 10 PNGs to Supabase Storage → bucket "templates":
--        anniv-25th-champagne-gold.png
--        anniv-25th-navy-lights.png
--        kbday-teddy-1st-girl.png
--        holi-party-colors.png
--        kbday-teaparty-3rd-girl.png
--        bday-18th-cinema-bash.png
--        kbday-dino-1st-boy.png
--        kbday-superhero-4th-boy.png
--        anniv-25th-sage-dinner.png
--        bday-18th-blackgold.png
--   3. Then run the INSERT block below.
--
-- Storage URL pattern:
--   https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/{filename}
-- ============================================================

-- Step 1: Widen the category check constraint to allow 'festival'
alter table templates drop constraint if exists templates_category_check;
alter table templates add constraint templates_category_check
  check (category in (
    'birthday', 'kids_birthday', 'wedding',
    'baby_shower', 'baby_announcement', 'anniversary', 'festival'
  ));

-- ============================================================
-- Step 2: Insert 10 templates
-- ============================================================

insert into templates (
  id, name, category, subcategory, style_tags, tier,
  orientation, aspect_ratio,
  bg_image_url, thumb_url,
  color_palette, text_zones, fonts_used, usage_count
) values

-- ── 1. Anniversary — Champagne Gold (portrait 5:7) ────────────────────────────
-- Left half: champagne bottle + glasses watercolor illustration (x:0–52%, full height)
-- Right column (x:46–95%): all text zones
-- Fixed gold art: heart swirl ~y:33–40%, two heart dividers ~y:50% and ~y:63%,
--                 ornamental scroll ~y:84–87%, small heart ~y:95%
(
  'anniv-25th-champagne-gold',
  '25th Anniversary — Champagne Gold',
  'anniversary',
  array['25th', 'silver', 'classic'],
  array['champagne', 'gold', 'elegant', 'watercolor', 'cream'],
  'free',
  'portrait', '5:7',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-25th-champagne-gold.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-25th-champagne-gold.png',
  array['#F5ECD7', '#C9A84C', '#2C2C2C', '#8B7355'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"YOU''RE INVITED TO CELEBRATE OUR","x":48,"y":3,"w":46,"h":5,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#2C2C2C","align":"center","bold":false,"italic":false},
    {"id":"milestone","label":"Milestone","defaultText":"25th","x":47,"y":8,"w":47,"h":20,"fontFamily":"PlayfairDisplay_700Bold","fontSize":68,"color":"#C9A84C","align":"center","bold":true,"italic":false},
    {"id":"event_type","label":"Event Type","defaultText":"Anniversary","x":47,"y":28,"w":47,"h":5,"fontFamily":"PlayfairDisplay_400Regular","fontSize":30,"color":"#C9A84C","align":"center","bold":false,"italic":true},
    {"id":"subtitle","label":"Subtitle","defaultText":"25 YEARS OF LOVE, LAUGHTER & BEAUTIFUL MEMORIES","x":46,"y":42,"w":49,"h":7,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#2C2C2C","align":"center","bold":false,"italic":false},
    {"id":"description","label":"Description","defaultText":"JOIN US FOR AN EVENING OF CELEBRATION, DINNER & TOASTS AS WE CELEBRATE THIS SPECIAL MILESTONE TOGETHER.","x":46,"y":54,"w":49,"h":8,"fontFamily":"DMSans_400Regular","fontSize":10,"color":"#2C2C2C","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25 MAY 2025","x":46,"y":66,"w":24,"h":9,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#2C2C2C","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"6:00 PM\nONWARDS","x":70,"y":66,"w":24,"h":9,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#2C2C2C","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE GRAND HALL\n123, CELEBRATION STREET,\nHAPPY TOWN, NEW DELHI – 110001","x":46,"y":76,"w":49,"h":7,"fontFamily":"DMSans_400Regular","fontSize":10,"color":"#2C2C2C","align":"center","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"We can''t wait to celebrate with you!","x":20,"y":88,"w":60,"h":5,"fontFamily":"PlayfairDisplay_400Regular","fontSize":13,"color":"#C9A84C","align":"center","bold":false,"italic":true}
  ]'::jsonb,
  array['PlayfairDisplay_700Bold', 'PlayfairDisplay_400Regular', 'DMSans_400Regular'],
  0
),

-- ── 2. Anniversary — Navy String Lights (portrait 5:7) ────────────────────────
-- Gold botanical leaves occupy x:0–18% and x:82–100%; safe text zone x:20–80%
-- Full-width centered text stack; 3-column date/time/venue at bottom
(
  'anniv-25th-navy-lights',
  '25th Anniversary — Navy Lights',
  'anniversary',
  array['25th', 'silver', 'night'],
  array['navy', 'gold', 'string-lights', 'botanical', 'elegant', 'dark'],
  'free',
  'portrait', '5:7',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-25th-navy-lights.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-25th-navy-lights.png',
  array['#1A2744', '#C9A84C', '#FFFFFF', '#2A3D5A'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"YOU''RE INVITED TO CELEBRATE OUR","x":20,"y":17,"w":60,"h":6,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"milestone","label":"Milestone","defaultText":"25th","x":20,"y":22,"w":60,"h":22,"fontFamily":"PlayfairDisplay_700Bold","fontSize":68,"color":"#C9A84C","align":"center","bold":true,"italic":false},
    {"id":"event_type","label":"Event Type","defaultText":"Anniversary","x":20,"y":43,"w":60,"h":10,"fontFamily":"PlayfairDisplay_400Regular","fontSize":32,"color":"#C9A84C","align":"center","bold":false,"italic":true},
    {"id":"subtitle","label":"Subtitle","defaultText":"25 YEARS OF LOVE, LAUGHTER & BEAUTIFUL MEMORIES","x":20,"y":57,"w":60,"h":7,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"description","label":"Description","defaultText":"JOIN US FOR AN EVENING OF CELEBRATION, DINNER & TOASTS AS WE CELEBRATE THIS SPECIAL MILESTONE TOGETHER.","x":20,"y":66,"w":60,"h":11,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25 MAY 2025","x":3,"y":78,"w":29,"h":12,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"6:00 PM\nONWARDS","x":34,"y":78,"w":30,"h":12,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE GRAND HALL\n123, CELEBRATION STREET,\nHAPPY TOWN, NEW DELHI – 110001","x":66,"y":76,"w":31,"h":14,"fontFamily":"DMSans_400Regular","fontSize":10,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"We can''t wait to celebrate with you!","x":20,"y":93,"w":60,"h":5,"fontFamily":"PlayfairDisplay_400Regular","fontSize":13,"color":"#C9A84C","align":"center","bold":false,"italic":true}
  ]'::jsonb,
  array['PlayfairDisplay_700Bold', 'PlayfairDisplay_400Regular', 'DMSans_400Regular'],
  0
),

-- ── 3. Kids Birthday — Teddy Bear 1st Girl (portrait 9:16) ───────────────────
-- Top: tagline + "Bundle of Joy" script + "IS TURNING"
-- Middle: teddy bear + pink "1" + balloons illustration (fixed art ~y:30–63%)
-- Pink ribbon banner fixed art ~y:62–67%
-- Bottom: name below ribbon (y:68), event label, then 3-column date/time/venue
(
  'kbday-teddy-1st-girl',
  '1st Birthday — Teddy Bear Girl',
  'kids_birthday',
  array['kids', 'girls', '1st-birthday'],
  array['pink', 'teddy-bear', 'balloons', 'watercolor', 'cute', 'pastel'],
  'free',
  'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-teddy-1st-girl.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-teddy-1st-girl.png',
  array['#F5C5C5', '#E8A0A0', '#D4707A', '#F5E8E8'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"OUR LITTLE","x":28,"y":15,"w":44,"h":4,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#6B3333","align":"center","bold":false,"italic":false},
    {"id":"title","label":"Title","defaultText":"Bundle of Joy","x":12,"y":18,"w":76,"h":9,"fontFamily":"PlayfairDisplay_400Regular","fontSize":34,"color":"#D4707A","align":"center","bold":false,"italic":true},
    {"id":"subtitle","label":"Subtitle","defaultText":"IS TURNING","x":30,"y":27,"w":40,"h":4,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#5C3030","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Child''s Name","defaultText":"Aaradhya''s","x":8,"y":68,"w":84,"h":8,"fontFamily":"PlayfairDisplay_400Regular","fontSize":38,"color":"#D4707A","align":"center","bold":false,"italic":true},
    {"id":"event","label":"Event","defaultText":"1st Birthday","x":18,"y":76,"w":64,"h":6,"fontFamily":"DMSans_700Bold","fontSize":22,"color":"#3D1A1A","align":"center","bold":true,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25\nMAY\n2025","x":2,"y":80,"w":24,"h":14,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#3D1A1A","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"4:00 PM\nONWARDS","x":28,"y":83,"w":36,"h":9,"fontFamily":"DMSans_400Regular","fontSize":14,"color":"#3D1A1A","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE PARTY HOUSE\n123, Celebration Street,\nHappy Town,\nNew Delhi – 110001","x":66,"y":80,"w":31,"h":14,"fontFamily":"DMSans_400Regular","fontSize":10,"color":"#D4707A","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['PlayfairDisplay_400Regular', 'DMSans_700Bold', 'DMSans_400Regular'],
  0
),

-- ── 4. Festival — Holi Party (portrait 5:7) ───────────────────────────────────
-- Colorful powder splashes + bunting; text center-heavy
-- Feature icons row (fixed art) occupies y:64–78%; footer sits just below at y:80
(
  'holi-party-colors',
  'Holi Party — Color Splash',
  'festival',
  array['holi', 'indian', 'colorful'],
  array['holi', 'vibrant', 'rainbow', 'festival', 'indian', 'colorful'],
  'free',
  'portrait', '5:7',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/holi-party-colors.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/holi-party-colors.png',
  array['#FF1493', '#9400D3', '#FF6600', '#00CED1', '#F5F5F5'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"YOU''RE INVITED TO A","x":20,"y":8,"w":60,"h":5,"fontFamily":"DMSans_700Bold","fontSize":14,"color":"#333333","align":"center","bold":true,"italic":false},
    {"id":"event_title","label":"Event Title","defaultText":"Holi","x":10,"y":12,"w":80,"h":18,"fontFamily":"PlayfairDisplay_700Bold","fontSize":72,"color":"#FF1493","align":"center","bold":true,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"Party!","x":15,"y":30,"w":70,"h":10,"fontFamily":"PlayfairDisplay_400Regular","fontSize":46,"color":"#5B2D8E","align":"center","bold":false,"italic":true},
    {"id":"tagline2","label":"Tagline 2","defaultText":"LET''S PLAY, LAUGH & GET COLORED!","x":12,"y":41,"w":76,"h":6,"fontFamily":"DMSans_700Bold","fontSize":14,"color":"#FFFFFF","align":"center","bold":true,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25 MAY 2025","x":3,"y":49,"w":30,"h":9,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#333333","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"11:00 AM\nONWARDS","x":36,"y":49,"w":28,"h":9,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#333333","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE GRAND LAWNS\n123, CELEBRATION STREET,\nHAPPY TOWN, NEW DELHI – 110001","x":66,"y":48,"w":32,"h":12,"fontFamily":"DMSans_400Regular","fontSize":10,"color":"#333333","align":"center","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"Wear white, bring your energy\nand let''s make it a colorful day!","x":8,"y":80,"w":84,"h":7,"fontFamily":"PlayfairDisplay_400Regular","fontSize":14,"color":"#D4006A","align":"center","bold":false,"italic":true}
  ]'::jsonb,
  array['PlayfairDisplay_700Bold', 'PlayfairDisplay_400Regular', 'DMSans_700Bold', 'DMSans_400Regular'],
  0
),

-- ── 5. Kids Birthday — Tea Party 3rd Girl (portrait 9:16) ────────────────────
-- Top: tagline + "Tea Party" script + ribbon banner "TO CELEBRATE" (y:33, x:18–82%)
-- Middle: name + age label, tea-set illustration (fixed art ~y:55–80%)
-- Bottom: 3-column date/time/venue + footer
(
  'kbday-teaparty-3rd-girl',
  'Tea Party Birthday — Girl',
  'kids_birthday',
  array['kids', 'girls', 'tea-party'],
  array['pink', 'tea-party', 'cute', 'watercolor', 'pastel', 'bunting'],
  'free',
  'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-teaparty-3rd-girl.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-teaparty-3rd-girl.png',
  array['#F5C5C5', '#E07090', '#C8A4A4', '#F5EAE0'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"YOU''RE INVITED TO A","x":18,"y":17,"w":64,"h":4,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#5C3030","align":"center","bold":false,"italic":false},
    {"id":"event","label":"Event","defaultText":"Tea Party","x":10,"y":21,"w":80,"h":11,"fontFamily":"PlayfairDisplay_400Regular","fontSize":42,"color":"#E07090","align":"center","bold":false,"italic":true},
    {"id":"subtitle","label":"Subtitle","defaultText":"TO CELEBRATE","x":18,"y":33,"w":64,"h":4,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#5C4520","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Child''s Name","defaultText":"Aanya''s","x":10,"y":37,"w":80,"h":10,"fontFamily":"PlayfairDisplay_400Regular","fontSize":46,"color":"#E07090","align":"center","bold":false,"italic":true},
    {"id":"age_event","label":"Age & Event","defaultText":"3rd Birthday!","x":10,"y":47,"w":80,"h":8,"fontFamily":"PlayfairDisplay_700Bold","fontSize":32,"color":"#333333","align":"center","bold":true,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25\nMAY 2025","x":3,"y":82,"w":25,"h":10,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#3D1A1A","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"4:00 PM\nONWARDS","x":30,"y":83,"w":38,"h":8,"fontFamily":"DMSans_400Regular","fontSize":15,"color":"#E07090","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE PARTY HOUSE\n123, Celebration Street,\nHappy Town,\nNew Delhi – 110001","x":65,"y":81,"w":32,"h":12,"fontFamily":"DMSans_400Regular","fontSize":10,"color":"#E07090","align":"center","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"WE CAN''T WAIT TO CELEBRATE WITH YOU!","x":12,"y":95,"w":76,"h":4,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#5C7040","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['PlayfairDisplay_700Bold', 'PlayfairDisplay_400Regular', 'DMSans_400Regular'],
  0
),

-- ── 6. Birthday — Cinema Bash 18th (portrait 5:7) ────────────────────────────
-- Dark maroon + red curtains at x:0–20% and x:80–100%; safe text zone x:18–82%
-- All text centered; date/time/venue inset from curtains starting at x:22
(
  'bday-18th-cinema-bash',
  '18th Birthday — Cinema Bash',
  'birthday',
  array['adults', 'milestone', '18th'],
  array['cinema', 'dark', 'gold', 'theatrical', 'dramatic', 'marquee'],
  'free',
  'portrait', '5:7',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bday-18th-cinema-bash.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bday-18th-cinema-bash.png',
  array['#2D0030', '#8B0000', '#C9A84C', '#FFFFFF'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"YOU''RE INVITED TO CELEBRATE","x":18,"y":8,"w":64,"h":4,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Name","defaultText":"ROHAN''S","x":8,"y":13,"w":84,"h":11,"fontFamily":"PlayfairDisplay_700Bold","fontSize":48,"color":"#C9A84C","align":"center","bold":true,"italic":false},
    {"id":"milestone","label":"Milestone","defaultText":"18th","x":10,"y":23,"w":80,"h":20,"fontFamily":"PlayfairDisplay_700Bold","fontSize":76,"color":"#C9A84C","align":"center","bold":true,"italic":false},
    {"id":"event","label":"Event","defaultText":"Birthday Bash!","x":10,"y":43,"w":80,"h":10,"fontFamily":"PlayfairDisplay_400Regular","fontSize":38,"color":"#C9A84C","align":"center","bold":false,"italic":true},
    {"id":"subtitle","label":"Subtitle","defaultText":"A NIGHT OF GLAMOUR, MUSIC & MEMORIES","x":18,"y":54,"w":64,"h":7,"fontFamily":"DMSans_700Bold","fontSize":13,"color":"#FFFFFF","align":"center","bold":true,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25 MAY 2025","x":22,"y":63,"w":56,"h":8,"fontFamily":"DMSans_400Regular","fontSize":14,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"6:00 PM\nONWARDS","x":22,"y":72,"w":56,"h":7,"fontFamily":"DMSans_400Regular","fontSize":14,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE GRAND HALL\n123, CELEBRATION STREET,\nHAPPY TOWN, NEW DELHI – 110001","x":22,"y":80,"w":56,"h":11,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"Dress to Impress.\nLet''s make it a Blockbuster night!","x":12,"y":93,"w":76,"h":6,"fontFamily":"PlayfairDisplay_400Regular","fontSize":14,"color":"#C9A84C","align":"center","bold":false,"italic":true}
  ]'::jsonb,
  array['PlayfairDisplay_700Bold', 'PlayfairDisplay_400Regular', 'DMSans_700Bold', 'DMSans_400Regular'],
  0
),

-- ── 7. Kids Birthday — Dino Roar King 1st Boy (portrait 9:16) ────────────────
-- Top: tagline + "ROAR KING" title; scroll banner for subtitle at y:29
-- Middle: dino/jungle illustration (fixed art ~y:35–60%)
-- Bottom: name (y:62), event (y:69), 3-column date/time/venue, footer in rounded box (y:89)
(
  'kbday-dino-1st-boy',
  '1st Birthday — Dino Roar King',
  'kids_birthday',
  array['kids', 'boys', '1st-birthday'],
  array['dinosaur', 'jungle', 'green', 'watercolor', 'boys', 'adventure'],
  'free',
  'portrait', '9:16',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-dino-1st-boy.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-dino-1st-boy.png',
  array['#4A7C3F', '#8B6914', '#F5E8C8', '#E67820'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"OUR LITTLE","x":28,"y":11,"w":44,"h":4,"fontFamily":"DMSans_400Regular","fontSize":14,"color":"#3D4510","align":"center","bold":false,"italic":false},
    {"id":"title","label":"Title","defaultText":"ROAR KING","x":8,"y":13,"w":84,"h":9,"fontFamily":"PlayfairDisplay_700Bold","fontSize":44,"color":"#1A3A10","align":"center","bold":true,"italic":false},
    {"id":"subtitle","label":"Subtitle","defaultText":"IS TURNING","x":20,"y":29,"w":60,"h":5,"fontFamily":"DMSans_400Regular","fontSize":14,"color":"#6B4F20","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Child''s Name","defaultText":"AARAV''S","x":8,"y":62,"w":84,"h":7,"fontFamily":"PlayfairDisplay_700Bold","fontSize":42,"color":"#1A3A10","align":"center","bold":true,"italic":false},
    {"id":"event","label":"Event","defaultText":"1ST BIRTHDAY PARTY","x":12,"y":69,"w":76,"h":5,"fontFamily":"DMSans_700Bold","fontSize":18,"color":"#5C3A10","align":"center","bold":true,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25\nMAY\n2025","x":3,"y":77,"w":24,"h":10,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#3D2010","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"4:00 PM\nONWARDS","x":32,"y":78,"w":34,"h":8,"fontFamily":"DMSans_400Regular","fontSize":14,"color":"#E67820","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE PARTY HOUSE\n123, Celebration Street,\nHappy Town,\nNew Delhi – 110001","x":68,"y":76,"w":29,"h":12,"fontFamily":"DMSans_400Regular","fontSize":10,"color":"#3D2010","align":"center","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"WE CAN''T WAIT TO CELEBRATE WITH YOU!","x":12,"y":89,"w":76,"h":6,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#E67820","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['PlayfairDisplay_700Bold', 'DMSans_700Bold', 'DMSans_400Regular'],
  0
),

-- ── 8. Kids Birthday — Superhero 4th Boy (portrait 5:7) ──────────────────────
-- Comic-style; distinct placeholder shapes revealed by blank:
--   white burst (top) → name, red burst (mid-right) → age,
--   speech bubble (mid-left) → quote, blue banner → event label
-- Hero illustration occupies left/center; date/time/venue stacked right (x:48)
(
  'kbday-superhero-4th-boy',
  '4th Birthday — Superhero Bash',
  'kids_birthday',
  array['kids', 'boys', 'superhero'],
  array['superhero', 'comics', 'blue', 'action', 'bold', 'boys'],
  'free',
  'portrait', '5:7',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-superhero-4th-boy.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/kbday-superhero-4th-boy.png',
  array['#1A3A8C', '#CC0000', '#FFD700', '#F5F5F0'],
  '[
    {"id":"name","label":"Name","defaultText":"ROHAN''S","x":12,"y":5,"w":76,"h":22,"fontFamily":"PlayfairDisplay_700Bold","fontSize":52,"color":"#1A3A8C","align":"center","bold":true,"italic":false},
    {"id":"age","label":"Age","defaultText":"4TH","x":18,"y":33,"w":64,"h":15,"fontFamily":"PlayfairDisplay_700Bold","fontSize":68,"color":"#FFD700","align":"center","bold":true,"italic":false},
    {"id":"quote","label":"Quote","defaultText":"A SUPER\nADVENTURE\nAWAITS!","x":2,"y":39,"w":32,"h":13,"fontFamily":"DMSans_700Bold","fontSize":13,"color":"#CC0000","align":"center","bold":true,"italic":false},
    {"id":"event","label":"Event","defaultText":"BIRTHDAY!","x":15,"y":50,"w":70,"h":7,"fontFamily":"DMSans_700Bold","fontSize":40,"color":"#1A3A8C","align":"center","bold":true,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25 MAY 2025","x":48,"y":63,"w":48,"h":9,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#CC0000","align":"left","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"4:00 PM\nONWARDS","x":48,"y":73,"w":48,"h":8,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#CC0000","align":"left","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE PARTY HOUSE\n123, Celebration Street,\nHappy Town,\nNew Delhi – 110001","x":48,"y":82,"w":48,"h":10,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#CC0000","align":"left","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"SUIT UP & LET''S PARTY!","x":12,"y":92,"w":76,"h":6,"fontFamily":"DMSans_700Bold","fontSize":16,"color":"#FFD700","align":"center","bold":true,"italic":false}
  ]'::jsonb,
  array['PlayfairDisplay_700Bold', 'DMSans_700Bold', 'DMSans_400Regular'],
  0
),

-- ── 9. Anniversary — Sage Green Champagne Dinner (portrait 5:7) ───────────────
-- Soft cream/sage watercolor; text upper half, dinner illustration lower half
-- Gold divider at ~y:62%; description ends at y:59 (before divider)
(
  'anniv-25th-sage-dinner',
  '25th Anniversary — Sage Champagne',
  'anniversary',
  array['25th', 'silver', 'dinner'],
  array['sage', 'green', 'watercolor', 'elegant', 'dining', 'champagne'],
  'free',
  'portrait', '5:7',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-25th-sage-dinner.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/anniv-25th-sage-dinner.png',
  array['#F5F0E8', '#C9A84C', '#4A6B4A', '#1A1A1A'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"YOU''RE INVITED TO CELEBRATE OUR","x":18,"y":5,"w":64,"h":5,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#1A1A1A","align":"center","bold":false,"italic":false},
    {"id":"milestone","label":"Milestone","defaultText":"25th","x":18,"y":9,"w":64,"h":20,"fontFamily":"PlayfairDisplay_700Bold","fontSize":72,"color":"#C9A84C","align":"center","bold":true,"italic":false},
    {"id":"event_type","label":"Event Type","defaultText":"Anniversary","x":18,"y":29,"w":64,"h":9,"fontFamily":"PlayfairDisplay_400Regular","fontSize":34,"color":"#2D4A2D","align":"center","bold":false,"italic":true},
    {"id":"subtitle","label":"Subtitle","defaultText":"25 YEARS OF LOVE, LAUGHTER & BEAUTIFUL MEMORIES","x":18,"y":41,"w":64,"h":7,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#1A1A1A","align":"center","bold":false,"italic":false},
    {"id":"description","label":"Description","defaultText":"JOIN US FOR AN EVENING OF CELEBRATION, DINNER & TOASTS AS WE CELEBRATE THIS SPECIAL MILESTONE TOGETHER.","x":18,"y":48,"w":64,"h":11,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#1A1A1A","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY\n25 MAY 2025","x":8,"y":83,"w":24,"h":9,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#1A1A1A","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"6:00 PM\nONWARDS","x":37,"y":83,"w":24,"h":9,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#1A1A1A","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE GRAND HALL\n123, CELEBRATION STREET,\nHAPPY TOWN, NEW DELHI – 110001","x":65,"y":81,"w":32,"h":12,"fontFamily":"DMSans_400Regular","fontSize":10,"color":"#1A1A1A","align":"center","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"WE CAN''T WAIT TO CELEBRATE WITH YOU!","x":15,"y":95,"w":70,"h":4,"fontFamily":"DMSans_400Regular","fontSize":11,"color":"#1A1A1A","align":"center","bold":false,"italic":false}
  ]'::jsonb,
  array['PlayfairDisplay_700Bold', 'PlayfairDisplay_400Regular', 'DMSans_400Regular'],
  0
),

-- ── 10. Birthday — Black Gold Balloons 18th (portrait 5:7) ───────────────────
-- All-black bg; gold/black balloons only at x:0–25% and x:75–100%
-- Pure black center — all text centered, no illustration overlap
(
  'bday-18th-blackgold',
  '18th Birthday — Black Gold',
  'birthday',
  array['adults', 'milestone', '18th'],
  array['black', 'gold', 'balloons', 'elegant', 'luxury', 'dark'],
  'free',
  'portrait', '5:7',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bday-18th-blackgold.png',
  'https://iybxwbebjgkdixdtnxal.supabase.co/storage/v1/object/public/templates/bday-18th-blackgold.png',
  array['#000000', '#C9A84C', '#FFFFFF'],
  '[
    {"id":"tagline","label":"Tagline","defaultText":"YOU''RE INVITED TO","x":20,"y":6,"w":60,"h":4,"fontFamily":"DMSans_400Regular","fontSize":13,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"tagline2","label":"Tagline 2","defaultText":"Celebrate","x":20,"y":9,"w":60,"h":6,"fontFamily":"PlayfairDisplay_400Regular","fontSize":28,"color":"#C9A84C","align":"center","bold":false,"italic":true},
    {"id":"milestone","label":"Milestone","defaultText":"18th","x":12,"y":15,"w":76,"h":22,"fontFamily":"PlayfairDisplay_700Bold","fontSize":80,"color":"#C9A84C","align":"center","bold":true,"italic":false},
    {"id":"event","label":"Event","defaultText":"Birthday","x":12,"y":37,"w":76,"h":10,"fontFamily":"PlayfairDisplay_400Regular","fontSize":40,"color":"#FFFFFF","align":"center","bold":false,"italic":true},
    {"id":"connector","label":"Connector","defaultText":"OF","x":35,"y":47,"w":30,"h":3,"fontFamily":"DMSans_400Regular","fontSize":14,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"name","label":"Name","defaultText":"ROHAN","x":12,"y":50,"w":76,"h":11,"fontFamily":"PlayfairDisplay_700Bold","fontSize":46,"color":"#C9A84C","align":"center","bold":true,"italic":false},
    {"id":"description","label":"Description","defaultText":"JOIN US FOR AN EVENING OF\nMUSIC, DINNER & LOTS OF MEMORIES!","x":12,"y":62,"w":76,"h":7,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#FFFFFF","align":"center","bold":false,"italic":false},
    {"id":"date","label":"Date","defaultText":"SUNDAY, 25 MAY 2025","x":12,"y":71,"w":76,"h":5,"fontFamily":"DMSans_400Regular","fontSize":14,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"time","label":"Time","defaultText":"6:00 PM ONWARDS","x":12,"y":76,"w":76,"h":4,"fontFamily":"DMSans_400Regular","fontSize":14,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"venue","label":"Venue","defaultText":"THE GRAND HALL\n123, CELEBRATION STREET,\nHAPPY TOWN,\nNEW DELHI – 110001","x":12,"y":81,"w":76,"h":11,"fontFamily":"DMSans_400Regular","fontSize":12,"color":"#C9A84C","align":"center","bold":false,"italic":false},
    {"id":"footer","label":"Footer","defaultText":"Come Celebrate!\nSEE YOU THERE!","x":18,"y":93,"w":64,"h":6,"fontFamily":"PlayfairDisplay_400Regular","fontSize":16,"color":"#C9A84C","align":"center","bold":false,"italic":true}
  ]'::jsonb,
  array['PlayfairDisplay_700Bold', 'PlayfairDisplay_400Regular', 'DMSans_400Regular'],
  0
)

on conflict (id) do update set
  name          = excluded.name,
  text_zones    = excluded.text_zones,
  color_palette = excluded.color_palette,
  style_tags    = excluded.style_tags,
  bg_image_url  = excluded.bg_image_url,
  thumb_url     = excluded.thumb_url;
