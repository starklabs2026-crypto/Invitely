import { supabase } from './clients';
import type { AnalysisResult, ProposedZone } from '../types';

export async function createJob(templateId: string, sourceImageUrl: string): Promise<string> {
  const { data, error } = await supabase
    .from('ingestion_jobs')
    .insert({
      template_id:      templateId,
      status:           'processing',
      source_image_url: sourceImageUrl,
    })
    .select('id')
    .single();

  if (error) throw new Error(`Failed to create job: ${error.message}`);
  return (data as { id: string }).id;
}

export async function writeZoneReview(
  jobId: string,
  templateId: string,
  zones: ProposedZone[]
): Promise<string> {
  const { data, error } = await supabase
    .from('ingestion_zone_reviews')
    .insert({
      job_id:         jobId,
      template_id:    templateId,
      proposed_zones: zones,
      review_status:  'ai_draft',
    })
    .select('id')
    .single();

  if (error) throw new Error(`Failed to write zone review: ${error.message}`);
  return (data as { id: string }).id;
}

export async function finaliseJob(
  jobId: string,
  result: AnalysisResult,
  extractedBgUrl: string | null
): Promise<void> {
  const { error } = await supabase
    .from('ingestion_jobs')
    .update({
      status:           'needs_review',
      extracted_bg_url: extractedBgUrl,
      ai_model_used:    'gpt-4o',
      completed_at:     new Date().toISOString(),
    })
    .eq('id', jobId);

  if (error) throw new Error(`Failed to finalise job: ${error.message}`);
}

export async function failJob(jobId: string, errorMessage: string): Promise<void> {
  await supabase
    .from('ingestion_jobs')
    .update({ status: 'failed', error_log: errorMessage, completed_at: new Date().toISOString() })
    .eq('id', jobId);
}

/** Promotes approved zones from ingestion_zone_reviews → templates.text_zones_v2 */
export async function promoteApprovedZones(reviewId: string): Promise<void> {
  const { data: review, error: fetchErr } = await supabase
    .from('ingestion_zone_reviews')
    .select('template_id, proposed_zones, job_id')
    .eq('id', reviewId)
    .single();

  if (fetchErr || !review) throw new Error(`Review not found: ${reviewId}`);

  const { error: tplErr } = await supabase
    .from('templates')
    .update({
      text_zones_v2: review.proposed_zones,
      review_status: 'approved',
    })
    .eq('id', review.template_id);

  if (tplErr) throw new Error(`Failed to promote zones: ${tplErr.message}`);

  await supabase
    .from('ingestion_zone_reviews')
    .update({ review_status: 'approved', reviewed_at: new Date().toISOString() })
    .eq('id', reviewId);

  await supabase
    .from('ingestion_jobs')
    .update({ status: 'approved' })
    .eq('id', review.job_id);

  console.log(`  ✓ Zones promoted to live for template: ${review.template_id}`);
}
