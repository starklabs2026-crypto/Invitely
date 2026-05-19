/**
 * Sprint 3 — Visual comparison renderer
 *
 * Downloads a template background and overlays coloured rectangles
 * for each proposed zone, labelled with the zone id and font name.
 * Saves a side-by-side PNG to comparisons/<template-id>.png
 *
 * Usage:
 *   npm run compare -- --template bday-30th-sarah
 *   npm run compare -- --all
 */
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import sharp from 'sharp';
import { Command } from 'commander';
import { supabase } from './lib/clients';
import type { ProposedZone } from './types';

const program = new Command();
program
  .name('compare')
  .description('Render proposed zones as a visual overlay for human review')
  .option('-t, --template <id>', 'Template ID')
  .option('--all',               'Generate comparisons for all pending reviews')
  .option('-o, --out <dir>',     'Output directory', 'comparisons')
  .parse(process.argv);

const opts = program.opts<{ template?: string; all?: boolean; out: string }>();

// Zone highlight colours by type
const ZONE_COLORS: Record<string, [number, number, number]> = {
  tagline:  [255, 193,   7],
  title:    [233,  30,  99],
  name:     [156,  39, 176],
  subtitle: [103,  58, 183],
  occasion: [ 33, 150, 243],
  date:     [  3, 169, 244],
  time:     [  0, 150, 136],
  venue:    [ 76, 175,  80],
  rsvp:     [255, 152,   0],
  footer:   [121,  85,  72],
  default:  [158, 158, 158],
};

function colorForZone(id: string): [number, number, number] {
  return ZONE_COLORS[id] ?? ZONE_COLORS['default'];
}

async function renderComparison(templateId: string, outDir: string) {
  // 1. Get latest pending review for this template
  const { data: review, error } = await supabase
    .from('ingestion_zone_reviews')
    .select('proposed_zones, template_id')
    .eq('template_id', templateId)
    .eq('review_status', 'ai_draft')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !review) {
    console.error(`  ✗ No pending review found for ${templateId}`);
    return;
  }

  // 2. Get template image URL
  const { data: template } = await supabase
    .from('templates')
    .select('bg_image_url')
    .eq('id', templateId)
    .single();
  if (!template) { console.error(`  ✗ Template ${templateId} not found`); return; }

  // 3. Download image
  const imgResp = await fetch(template.bg_image_url);
  const imgBuf  = Buffer.from(await imgResp.arrayBuffer());
  const meta    = await sharp(imgBuf).metadata();
  const W = meta.width!;
  const H = meta.height!;

  // 4. Build SVG overlay with zone rectangles and labels
  const zones = review.proposed_zones as ProposedZone[];
  const svgRects = zones.map((z) => {
    const [r, g, b] = colorForZone(z.id);
    const x  = (z.leftPct  / 100) * W;
    const y  = (z.topPct   / 100) * H;
    const w  = (z.widthPct / 100) * W;
    const h  = (z.heightPct / 100) * H;
    const labelY = y + 14 > H ? H - 4 : y + 14;
    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}"
            fill="rgba(${r},${g},${b},0.18)" stroke="rgb(${r},${g},${b})" stroke-width="2"/>
      <text x="${x + 4}" y="${labelY}"
            font-family="monospace" font-size="12" fill="white"
            paint-order="stroke" stroke="black" stroke-width="3"
            >${z.id} | ${z.fontFamily.replace('_400Regular','').replace('_700Bold','†')} | ${z.fontSize}px</text>
    `;
  }).join('');

  const svg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${svgRects}</svg>`);

  // 5. Composite SVG over background
  const annotated = await sharp(imgBuf)
    .composite([{ input: svg, blend: 'over' }])
    .png()
    .toBuffer();

  // 6. Side-by-side: original left, annotated right
  const combined = await sharp({
    create: { width: W * 2, height: H, channels: 4, background: { r: 20, g: 20, b: 20, alpha: 255 } }
  })
    .composite([
      { input: imgBuf,   left: 0, top: 0 },
      { input: annotated, left: W, top: 0 },
    ])
    .png()
    .toBuffer();

  // 7. Save
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${templateId}.png`);
  fs.writeFileSync(outPath, combined);
  console.log(`  ✓ ${templateId} → ${outPath}`);
}

async function run() {
  if (!opts.template && !opts.all) { program.help(); return; }

  if (opts.template) {
    console.log(`\nGenerating comparison for ${opts.template}...`);
    await renderComparison(opts.template, opts.out);
  } else {
    const { data: reviews } = await supabase
      .from('ingestion_zone_reviews')
      .select('template_id')
      .eq('review_status', 'ai_draft');

    const ids = [...new Set((reviews ?? []).map((r: { template_id: string }) => r.template_id))];
    console.log(`\nGenerating comparisons for ${ids.length} template(s)...`);
    for (const id of ids) await renderComparison(id, opts.out);
  }
  console.log();
}

run().catch((err) => { console.error(`\n✗ ${err.message}\n`); process.exit(1); });
