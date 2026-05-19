import 'dotenv/config';
import { Command } from 'commander';
import { supabase } from './lib/clients';
import { analyzeTemplate } from './lib/analyzer';
import { resolveFont } from './lib/fontMatcher';
import { createJob, writeZoneReview, finaliseJob, failJob } from './lib/writer';

const program = new Command();

program
  .name('batch')
  .description('Run ingestion on all active templates that have not yet been processed')
  .option('--all',        'Re-process even already-approved templates')
  .option('--dry-run',    'Show which templates would be processed without calling the API')
  .option('--limit <n>',  'Process at most N templates (default: all)', parseInt)
  .parse(process.argv);

const opts = program.opts<{ all?: boolean; dryRun?: boolean; limit?: number }>();

async function run() {
  // Fetch templates to process
  let query = supabase
    .from('templates')
    .select('id, name, bg_image_url, review_status')
    .eq('is_active', true)
    .order('usage_count', { ascending: false });

  if (!opts.all) {
    // Only process templates that haven't been through the pipeline yet
    query = query.eq('review_status', 'manual');
  }

  if (opts.limit) query = query.limit(opts.limit);

  const { data: templates, error } = await query;
  if (error) throw new Error(error.message);
  if (!templates || templates.length === 0) {
    console.log('\nNo templates to process.\n');
    return;
  }

  console.log(`\nBatch ingestion — ${templates.length} template(s) to process`);
  if (opts.dryRun) {
    console.log('(dry-run — no API calls)\n');
    for (const t of templates) console.log(`  • ${t.id}  "${t.name}"`);
    console.log();
    return;
  }

  const results = { success: 0, failed: 0 };

  for (let i = 0; i < templates.length; i++) {
    const t = templates[i];
    console.log(`\n[${i + 1}/${templates.length}] ${t.id}`);

    const jobId = await createJob(t.id, t.bg_image_url);
    try {
      const analysis = await analyzeTemplate(t.bg_image_url, t.id);
      const zones    = analysis.zones.map((z) => ({ ...z, fontFamily: resolveFont(z.fontFamily) }));
      await writeZoneReview(jobId, t.id, zones);
      await finaliseJob(jobId, analysis, null);
      results.success++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await failJob(jobId, msg);
      console.error(`  ✗ Failed: ${msg}`);
      results.failed++;
    }

    // Polite delay between API calls to avoid rate limiting
    if (i < templates.length - 1) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  console.log(`\n── Batch complete ──`);
  console.log(`  ✓ Success: ${results.success}`);
  if (results.failed > 0) console.log(`  ✗ Failed:  ${results.failed}`);
  console.log(`\nRun: npm run review -- --list   to review all pending zones\n`);
}

run().catch((err) => {
  console.error(`\n✗ ${err.message}\n`);
  process.exit(1);
});
