import { useQuery } from '@tanstack/react-query';
import { fetchTemplates, fetchTemplateById } from '@/services/templates';
import { useTemplateStore } from '@/store/templateStore';
import type { TemplateCategory } from '@/types/template';

export function useTemplates(category?: TemplateCategory) {
  const addToCache = useTemplateStore((s) => s.addToCache);

  return useQuery({
    queryKey: ['templates', category ?? 'all'],
    queryFn: async () => {
      const templates = await fetchTemplates(category);
      addToCache(templates);
      return templates;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useTemplate(id: string) {
  const cache = useTemplateStore((s) => s.cache);
  const addToCache = useTemplateStore((s) => s.addToCache);

  return useQuery({
    queryKey: ['template', id],
    queryFn: async () => {
      const template = await fetchTemplateById(id);
      addToCache([template]);
      return template;
    },
    initialData: cache[id],
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
}
