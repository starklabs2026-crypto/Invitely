-- ============================================================
-- Migration: Standardize all templates to 9:16 portrait
-- Run in Supabase SQL editor.
-- Safe to re-run (idempotent UPDATE).
--
-- After running this, start the dev server and visually check
-- each template. Templates originally at 7:5 landscape will
-- need new background images uploaded to Supabase Storage.
-- Templates at 5:7 portrait may need minor text zone tweaks.
-- ============================================================

update templates
set
  aspect_ratio = '9:16',
  orientation  = 'portrait'
where id in (
  'bday-30th-sarah',
  'bday-40th-robert',
  'kbday-blastoff-leo',
  'kbday-woodland-maya',
  'bshower-littlestar',
  'anniv-25th-emily-liam',
  'anniv-hearts-sarah-david',
  'anniv-25th-champagne-gold',
  'anniv-25th-navy-lights',
  'holi-party-colors',
  'kbday-teaparty-3rd-girl',
  'bday-18th-cinema-bash',
  'kbday-superhero-4th-boy',
  'anniv-25th-sage-dinner',
  'bday-18th-blackgold'
);
-- Note: kbday-teddy-1st-girl, kbday-teaparty-3rd-girl, kbday-dino-1st-boy
-- are already 9:16 — included above for completeness, UPDATE is a no-op for them.
