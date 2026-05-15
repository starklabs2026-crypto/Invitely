import type { TemplateCategory } from '@/types/template';

export interface CategoryConfig {
  id: TemplateCategory;
  label: string;
  icon: string;
  color: string;
  count: number;
}

export const CATEGORIES: CategoryConfig[] = [
  { id: 'birthday', label: 'Birthday', icon: 'gift-outline', color: '#C96442', count: 12 },
  { id: 'kids_birthday', label: 'Kids Birthday', icon: 'balloon-outline', color: '#8B7DB8', count: 12 },
  { id: 'wedding', label: 'Wedding', icon: 'diamond-outline', color: '#C96480', count: 8 },
  { id: 'baby_shower', label: 'Baby Shower', icon: 'heart-outline', color: '#3D8A8A', count: 6 },
  { id: 'baby_announcement', label: 'Baby Announcement', icon: 'star-outline', color: '#C9A96E', count: 6 },
  { id: 'anniversary', label: 'Anniversary', icon: 'wine-outline', color: '#5A8A5A', count: 6 },
  { id: 'festival', label: 'Festival', icon: 'sparkles-outline', color: '#E05C1A', count: 0 },
] as const;
