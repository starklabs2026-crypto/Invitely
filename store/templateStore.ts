import { create } from 'zustand';
import type { Template, TemplateCategory } from '@/types/template';

interface TemplateStore {
  cache: Record<string, Template>;
  favourites: string[];
  activeCategory: TemplateCategory | null;
  addToCache: (templates: Template[]) => void;
  toggleFavourite: (id: string) => void;
  setActiveCategory: (category: TemplateCategory | null) => void;
  isFavourited: (id: string) => boolean;
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  cache: {},
  favourites: [],
  activeCategory: null,

  addToCache: (templates) =>
    set((state) => ({
      cache: {
        ...state.cache,
        ...Object.fromEntries(templates.map((t) => [t.id, t])),
      },
    })),

  toggleFavourite: (id) =>
    set((state) => ({
      favourites: state.favourites.includes(id)
        ? state.favourites.filter((f) => f !== id)
        : [...state.favourites, id],
    })),

  setActiveCategory: (category) => set({ activeCategory: category }),

  isFavourited: (id) => get().favourites.includes(id),
}));
