export type TemplateCategory =
  | 'birthday'
  | 'kids_birthday'
  | 'wedding'
  | 'baby_shower'
  | 'baby_announcement'
  | 'anniversary';

export type TemplateTier = 'free' | 'premium';

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
}
