import 'dotenv/config';
import { Command } from 'commander';
import { supabase } from './lib/clients';
import { analyzeTemplate } from './lib/analyzer';
import { resolveFont } from './lib/fontMatcher';
import { removeTextFromBackground } from './lib/remover';
import { createJob, writeZoneReview, finaliseJob, failJob } from './lib/writer';

const program = new Command();

program
  .name('ingest')
  .description('Process a single template through GPT-4o and write AI zone proposals to DB')
  .requiredOption('-t, --template <id>', 'Template ID (e.g. bday-30th-sarah)')
  .option('--remove-text', 'Run DALL-E 2 inpainting to remove baked-in text from background', false)
  .option('--hint <text>', 'Additional placement hint appended to the GPT-4o user message')
  .parse(process.argv);

const opts = program.opts<{ template: string; removeText: boolean; hint?: string }>();

async function run() {
  const templateId = opts.template;
  console.log(`\nIngesting template: ${templateId}`);

  // 1. Fetch template from DB
  const { data: template, error } = await supabase
    .from('templates')
    .select('id, name, bg_image_url')
    .eq('id', templateId)
    .single();

  if (error || !template) {
    console.error(`✗ Template "${templateId}" not found in DB.`);
    process.exit(1);
  }
  console.log(`  Found: "${template.name}"`);

  // 2. Create ingestion job
  const jobId = await createJob(templateId, template.bg_image_url);
  console.log(`  Job created: ${jobId}`);

  try {
    // 3. GPT-4o vision analysis
    const analysis = await analyzeTemplate(template.bg_image_url, templateId, opts.hint);

    // 4. Resolve fonts — ensure every zone uses a font from our bundle
    const resolvedZones = analysis.zones.map((zone) => ({
      ...zone,
      fontFamily: resolveFont(zone.fontFamily),
    }));

    // 5. Optional: text removal via DALL-E 2
    let extractedBgUrl: string | null = null;
    if (opts.removeText && analysis.has_baked_text) {
      extractedBgUrl = await removeTextFromBackground(
        template.bg_image_url,
        templateId,
        resolvedZones
      );
    } else if (analysis.has_baked_text) {
      console.log(`  ⚠ Baked-in text detected but --remove-text not set. Skipping removal.`);
    }

    // 6. Write zone review to DB
    const reviewId = await writeZoneReview(jobId, templateId, resolvedZones);
    console.log(`  Zone review created: ${reviewId}`);

    // 7. Finalise job
    await finaliseJob(jobId, analysis, extractedBgUrl);

    console.log(`\n✓ Done. Template is now in "needs_review" state.`);
    console.log(`  Run: npm run review -- --list   to see pending reviews`);
    console.log(`  Run: npm run review -- --approve ${reviewId}   to promote zones to live\n`);

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await failJob(jobId, msg);
    console.error(`\n✗ Ingestion failed: ${msg}\n`);
    process.exit(1);
  }
}

run();
