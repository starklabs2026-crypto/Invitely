import { create } from 'zustand';
import type { ZoneState, EditorState } from '@/types/editor';
import type { Template } from '@/types/template';

interface EditorStore extends EditorState {
  template: Template | null;
  capturedUri: string | null;
  cardId: string | null;
  setTemplate: (template: Template) => void;
  initZones: (zones: ZoneState[]) => void;
  selectZone: (id: string | null) => void;
  updateZone: (id: string, updates: Partial<ZoneState>) => void;
  duplicateZone: (id: string) => void;
  deleteZone: (id: string) => void;
  setCapturedUri: (uri: string | null) => void;
  setCardId: (id: string) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

const INITIAL_STATE: EditorState = {
  templateId: null,
  zones: [],
  selectedZoneId: null,
  undoStack: [],
  redoStack: [],
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...INITIAL_STATE,
  template: null,
  capturedUri: null,
  cardId: null,

  setTemplate: (template) => set({ template, templateId: template.id }),
  setCapturedUri: (uri) => set({ capturedUri: uri }),
  setCardId: (id) => set({ cardId: id }),

  initZones: (zones) => set({ zones, undoStack: [], redoStack: [] }),

  selectZone: (id) =>
    set((state) => ({
      zones: state.zones.map((z) => ({ ...z, isSelected: z.id === id })),
      selectedZoneId: id,
    })),

  updateZone: (id, updates) => {
    const { zones, undoStack } = get();
    set({
      undoStack: [...undoStack.slice(-19), zones],
      redoStack: [],
      zones: zones.map((z) => (z.id === id ? { ...z, ...updates } : z)),
    });
  },

  duplicateZone: (id) => {
    const { zones, undoStack } = get();
    const zone = zones.find((z) => z.id === id);
    if (!zone) return;
    const newZone: ZoneState = {
      ...zone,
      id: `${id}_copy_${Date.now()}`,
      x: Math.max(0, Math.min(100 - zone.w, zone.x + 2)),
      y: Math.max(0, Math.min(100 - zone.h, zone.y + 2)),
      isSelected: false,
    };
    set({
      undoStack: [...undoStack.slice(-19), zones],
      redoStack: [],
      zones: [...zones, newZone],
    });
  },

  deleteZone: (id) => {
    const { zones, undoStack } = get();
    set({
      undoStack: [...undoStack.slice(-19), zones],
      redoStack: [],
      zones: zones.filter((z) => z.id !== id),
      selectedZoneId: null,
    });
  },

  undo: () => {
    const { undoStack, zones, redoStack } = get();
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    set({
      zones: previous,
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack.slice(-19), zones],
    });
  },

  redo: () => {
    const { redoStack, zones, undoStack } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    set({
      zones: next,
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack.slice(-19), zones],
    });
  },

  reset: () => set({ ...INITIAL_STATE, template: null, capturedUri: null, cardId: null }),
}));
