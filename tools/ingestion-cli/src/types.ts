import { z } from 'zod';

export const TextEffectsSchema = z.object({
  shadow: z.object({
    offsetX: z.number(),
    offsetY: z.number(),
    blur:    z.number(),
    color:   z.string(),
  }).optional(),
  stroke: z.object({
    width: z.number(),
    color: z.string(),
  }).optional(),
  gradient: z.object({
    colors:    z.array(z.string()).min(2),
    direction: z.enum(['horizontal', 'vertical', 'diagonal']),
  }).optional(),
  glow: z.object({
    radius: z.number(),
    color:  z.string(),
  }).optional(),
});

export const ProposedZoneSchema = z.object({
  id:          z.string(),
  label:       z.string(),
  defaultText: z.string(),
  leftPct:     z.number().min(0).max(100),
  topPct:      z.number().min(0).max(100),
  widthPct:    z.number().min(1).max(100),
  heightPct:   z.number().min(1).max(100),
  fontFamily:  z.string(),
  fontSize:    z.number().min(8).max(120),
  color:       z.string(),
  align:       z.enum(['left', 'center', 'right']),
  bold:        z.boolean(),
  italic:      z.boolean(),
  effects:     TextEffectsSchema.nullish(),
  confidence:  z.number().min(0).max(1),
});

export const AnalysisResultSchema = z.object({
  overall_confidence:     z.number().min(0).max(1),
  has_baked_text:         z.boolean(),
  background_description: z.string(),
  zones:                  z.array(ProposedZoneSchema).min(1).max(12),
});

export type TextEffects    = z.infer<typeof TextEffectsSchema>;
export type ProposedZone   = z.infer<typeof ProposedZoneSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

export interface IngestionJob {
  id:               string;
  template_id:      string;
  status:           'queued' | 'processing' | 'needs_review' | 'approved' | 'failed';
  source_image_url: string;
  extracted_bg_url: string | null;
  ai_model_used:    string | null;
  error_log:        string | null;
  created_at:       string;
  completed_at:     string | null;
}

export interface ZoneReview {
  id:             string;
  job_id:         string;
  template_id:    string;
  proposed_zones: ProposedZone[];
  review_status:  'ai_draft' | 'approved' | 'rejected';
  reviewer_notes: string | null;
  reviewed_at:    string | null;
}
