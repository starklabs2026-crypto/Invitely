import { useEditorStore } from '@/store/editorStore';
import type { ZoneState } from '@/types/editor';
import type { Template } from '@/types/template';

export function useEditor() {
  const store = useEditorStore();

  function initFromTemplate(template: Template) {
    store.setTemplate(template);
    const zones: ZoneState[] = template.text_zones.map((tz) => ({
      id: tz.id,
      label: tz.label,
      text: tz.defaultText,
      fontFamily: tz.fontFamily,
      fontSize: tz.fontSize,
      color: tz.color,
      bold: tz.bold,
      italic: tz.italic,
      align: tz.align,
      letterSpacing: 0,
      lineHeight: 1.2,
      caps: false,
      x: tz.x,
      y: tz.y,
      w: tz.w,
      h: tz.h,
      isSelected: false,
    }));
    store.initZones(zones);
  }

  return {
    template: store.template,
    zones: store.zones,
    selectedZoneId: store.selectedZoneId,
    selectedZone: store.zones.find((z) => z.id === store.selectedZoneId) ?? null,
    canUndo: store.undoStack.length > 0,
    canRedo: store.redoStack.length > 0,
    initFromTemplate,
    selectZone: store.selectZone,
    updateZone: store.updateZone,
    duplicateZone: store.duplicateZone,
    deleteZone: store.deleteZone,
    undo: store.undo,
    redo: store.redo,
    reset: store.reset,
  };
}
