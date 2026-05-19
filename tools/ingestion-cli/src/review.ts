import 'dotenv/config';
import { Command } from 'commander';
import { supabase } from './lib/clients';
import { promoteApprovedZones } from './lib/writer';
import type { ProposedZone, ZoneReview } from './types';

const program = new Command();

program
  .name('review')
  .description('List pending zone reviews and approve or reject them')
  .option('--list',              'List all pending zone reviews')
  .option('--approve <id>',      'Approve a zone review by its ID (promotes zones to live)')
  .option('--reject  <id>',      'Reject a zone review by its ID')
  .option('--notes   <text>',    'Notes to attach when rejecting')
  .option('--show    <id>',      'Print the proposed zones for a review ID')
  .parse(process.argv);

const opts = program.opts<{
  list?: boolean;
  approve?: string;
  reject?: string;
  notes?: string;
  show?: string;
}>();

async function listPending() {
  const { data, error } = await supabase
    .from('ingestion_zone_reviews')
    .select('id, template_id, review_status, created_at, ingestion_jobs(status)')
    .eq('review_status', 'ai_draft')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    console.log('\nNo pending reviews.\n');
    return;
  }

  console.log(`\nPending reviews (${data.length}):\n`);
  for (const row of data) {
    console.log(`  ${row.id}  |  template: ${row.template_id}  |  created: ${row.created_at.slice(0, 10)}`);
  }
  console.log();
}

async function showZones(reviewId: string) {
  const { data, error } = await supabase
    .from('ingestion_zone_reviews')
    .select('template_id, proposed_zones')
    .eq('id', reviewId)
    .single();

  if (error || !data) {
    console.error(`Review ${reviewId} not found.`);
    return;
  }

  console.log(`\nProposed zones for ${data.template_id} (review: ${reviewId}):\n`);
  const zones = data.proposed_zones as ProposedZone[];
  for (const z of zones) {
    console.log(`  [${z.id}] "${z.defaultText}"`);
    console.log(`    pos:    left ${z.leftPct.toFixed(1)}%  top ${z.topPct.toFixed(1)}%  w ${z.widthPct.toFixed(1)}%  h ${z.heightPct.toFixed(1)}%`);
    console.log(`    font:   ${z.fontFamily}  ${z.fontSize}px  ${z.bold ? 'bold' : 'normal'}${z.italic ? ' italic' : ''}`);
    console.log(`    color:  ${z.color}  align: ${z.align}`);
    if (z.effects?.shadow) {
      const s = z.effects.shadow;
      console.log(`    shadow: offset(${s.offsetX},${s.offsetY}) blur ${s.blur} ${s.color}`);
    }
    if (z.effects?.stroke) {
      console.log(`    stroke: ${z.effects.stroke.width}px ${z.effects.stroke.color}`);
    }
    console.log(`    confidence: ${(z.confidence * 100).toFixed(0)}%`);
    console.log();
  }
}

async function approve(reviewId: string) {
  await promoteApprovedZones(reviewId);
  console.log(`\n✓ Review ${reviewId} approved. Zones are now live in the app.\n`);
}

async function reject(reviewId: string, notes?: string) {
  const { error } = await supabase
    .from('ingestion_zone_reviews')
    .update({
      review_status:  'rejected',
      reviewer_notes: notes ?? null,
      reviewed_at:    new Date().toISOString(),
    })
    .eq('id', reviewId);

  if (error) throw new Error(error.message);
  console.log(`\n✓ Review ${reviewId} rejected.\n`);
}

async function run() {
  if (opts.list)             return listPending();
  if (opts.show)             return showZones(opts.show);
  if (opts.approve)          return approve(opts.approve);
  if (opts.reject)           return reject(opts.reject, opts.notes);

  program.help();
}

run().catch((err) => {
  console.error(`\n✗ ${err.message}\n`);
  process.exit(1);
});
