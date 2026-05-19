export type TemplateCategory =
  | 'birthday'
  | 'kids_birthday'
  | 'wedding'
  | 'baby_shower'
  | 'baby_announcement'
  | 'anniversary'
  | 'festival';

export type TemplateTier = 'free' | 'premium';

// ── V1 zone type (live templates, unchanged) ──────────────────────────────────
export interface TextZoneDefinition {
  id: string;
  label: string;
  defaultText: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fontFamily: string;
  fontSize: number;
  color: string;
  align: 'left' | 'center' | 'right';
  bold: boolean;
  italic: boolean;
}

// ── V2 zone types (ingestion pipeline output) ─────────────────────────────────
export interface TextShadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

export interface TextStroke {
  width: number;
  color: string;
}

export interface TextGradient {
  colors: string[];
  direction: 'horizontal' | 'vertical' | 'diagonal';
}

export interface TextGlow {
  radius: number;
  color: string;
}

export interface TextEffects {
  shadow?: TextShadow;
  stroke?: TextStroke;
  gradient?: TextGradient;
  glow?: TextGlow;
}

export type RenderMode = 'rn_text' | 'skia_text';
export type ZoneReviewStatus = 'ai_draft' | 'approved' | 'rejected';
export type TemplateReviewStatus = 'manual' | 'ai_draft' | 'pending_review' | 'approved';

export interface TextZoneDefinitionV2 {
  id: string;
  label: string;
  defaultText: string;

  leftPct: number;
  topPct: number;
  widthPct: number;
  heightPct: number;

  fontFamily: string;
  fontSize: number;
  color: string;
  align: 'left' | 'center' | 'right';
  bold: boolean;
  italic: boolean;

  effects?: TextEffects;
  renderMode: RenderMode;

  confidence?: number;
  reviewStatus?: ZoneReviewStatus;
}

// ── Template ──────────────────────────────────────────────────────────────────
export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  subcategory: string[];
  style_tags: string[];
  tier: TemplateTier;
  orientation: string;
  aspect_ratio: string;
  bg_image_url: string;
  thumb_url: string;
  color_palette: string[];
  text_zones: TextZoneDefinition[];
  fonts_used: string[];
  usage_count: number;
  is_active: boolean;
  created_at: string;

  // Populated after ingestion pipeline processes this template
  text_zones_v2?: TextZoneDefinitionV2[];
  draft_zones?: TextZoneDefinitionV2[];
  review_status?: TemplateReviewStatus;
  ai_confidence?: number;
}
