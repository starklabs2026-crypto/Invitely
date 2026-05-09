import { supabase } from './supabase';
import type { Template, TemplateCategory } from '@/types/template';

export async function fetchTemplates(category?: TemplateCategory): Promise<Template[]> {
  let query = supabase
    .from('templates')
    .select('*')
    .eq('is_active', true)
    .order('usage_count', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Template[];
}

export async function fetchTemplateById(id: string): Promise<Template> {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data as Template;
}

export async function saveDraft(
  userId: string,
  templateId: string,
  cardData: object,
  cardId?: string
): Promise<string> {
  if (cardId) {
    const { error } = await supabase
      .from('saved_cards')
      .update({ card_data: cardData, updated_at: new Date().toISOString() })
      .eq('id', cardId);
    if (error) throw new Error(error.message);
    return cardId;
  }

  const { data, error } = await supabase
    .from('saved_cards')
    .insert({ user_id: userId, template_id: templateId, card_data: cardData, status: 'draft' })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return (data as { id: string }).id;
}

export async function fetchSavedCards(userId: string, status?: 'draft' | 'completed') {
  let query = supabase
    .from('saved_cards')
    .select('*, templates(*)')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function toggleFavouriteInDb(userId: string, templateId: string, add: boolean) {
  if (add) {
    const { error } = await supabase
      .from('user_favourites')
      .upsert({ user_id: userId, template_id: templateId });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('user_favourites')
      .delete()
      .eq('user_id', userId)
      .eq('template_id', templateId);
    if (error) throw new Error(error.message);
  }
}
