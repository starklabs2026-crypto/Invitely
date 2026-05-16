import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import { COLORS } from '@/constants/colors';
import { AppHeader } from '@/components/layout/AppHeader';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { SelectionBox } from '@/components/editor/SelectionBox';
import { TextZone } from '@/components/editor/TextZone';
import { TextEditModal } from '@/components/editor/TextEditModal';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { useEditor } from '@/hooks/useEditor';
import { useEditorFonts } from '@/hooks/useEditorFonts';
import { useTemplate } from '@/hooks/useTemplates';
import { useAuth } from '@/hooks/useAuth';
import { saveDraft } from '@/services/templates';
import { getCanvasHeight } from '@/components/editor/EditorCanvas';
import { useEditorStore } from '@/store/editorStore';

export default function EditorScreen() {
  const { templateId } = useLocalSearchParams<{ templateId: string }>();
  const { data: template } = useTemplate(templateId!);
  const editor = useEditor();
  useEditorFonts();
  const { user } = useAuth();
  const setCapturedUri = useEditorStore((s) => s.setCapturedUri);
  const cardId = useEditorStore((s) => s.cardId);
  const setCardId = useEditorStore((s) => s.setCardId);
  const [saving, setSaving] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const viewShotRef = useRef<ViewShot>(null);
  const canvasHeight = getCanvasHeight(template?.aspect_ratio);

  useEffect(() => {
    if (template && editor.template?.id !== template.id) {
      editor.initFromTemplate(template);
    }
  }, [template]);

  const editingZone = editingZoneId
    ? editor.zones.find((z) => z.id === editingZoneId) ?? null
    : null;

  function openEdit(zoneId: string) {
    setEditingZoneId(zoneId);
  }

  function handleEditSave(text: string) {
    if (editingZoneId) {
      editor.updateZone(editingZoneId, { text });
    }
  }

  async function handleSaveDraft() {
    if (!user || !editor.template) return;
    setDraftSaving(true);
    try {
      const id = await saveDraft(user.id, editor.template.id, { zones: editor.zones }, cardId ?? undefined);
      setCardId(id);
      Alert.alert('Saved', 'Your draft has been saved to My Designs.');
    } catch {
      Alert.alert('Error', 'Could not save draft. Please try again.');
    } finally {
      setDraftSaving(false);
    }
  }

  async function handleNext() {
    editor.selectZone(null);
    setSaving(true);
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (uri) setCapturedUri(uri);
      if (user && editor.template) {
        saveDraft(user.id, editor.template.id, { zones: editor.zones }).catch(() => {});
      }
    } catch {
      // proceed anyway
    } finally {
      setSaving(false);
    }
    router.push(`/share/new?templateId=${templateId}`);
  }

  const selectedZone = editor.selectedZone;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader
        showBack
        showUndo
        showRedo
        showSave
        canUndo={editor.canUndo}
        canRedo={editor.canRedo}
        isSaving={draftSaving}
        onUndo={editor.undo}
        onRedo={editor.redo}
        onSave={handleSaveDraft}
        rightAction={{
          label: saving ? 'Capturing...' : 'Next >',
          onPress: handleNext,
          variant: 'primary',
        }}
      />

      <ScrollView
        contentContainerStyle={styles.canvasScroll}
        scrollEnabled={!selectedZone}
        showsVerticalScrollIndicator={false}
      >
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', quality: 1.0 }}
          style={styles.canvasWrapper}
        >
          {template && (
            <EditorCanvas
              bgImageUrl={template.bg_image_url}
              onCanvasTap={() => editor.selectZone(null)}
              aspectRatio={template.aspect_ratio}
            />
          )}

          {editor.zones.map((zone) => (
            <TextZone
              key={zone.id}
              zone={zone}
              isSelected={zone.id === editor.selectedZoneId}
              onSelect={() => editor.selectZone(zone.id)}
              onMove={(x, y) => editor.updateZone(zone.id, { x, y })}
              canvasHeight={canvasHeight}
            />
          ))}

          {selectedZone && <SelectionBox zone={selectedZone} canvasHeight={canvasHeight} />}
        </ViewShot>
      </ScrollView>

      <EditorToolbar
        selectedZone={selectedZone}
        onUpdateZone={(updates) => {
          if (editor.selectedZoneId) {
            editor.updateZone(editor.selectedZoneId, updates);
          }
        }}
        onDuplicate={() => {
          if (editor.selectedZoneId) {
            editor.duplicateZone(editor.selectedZoneId);
          }
        }}
        onDelete={() => {
          if (editor.selectedZoneId) {
            editor.deleteZone(editor.selectedZoneId);
          }
        }}
        onEdit={() => {
          if (editor.selectedZoneId) {
            openEdit(editor.selectedZoneId);
          }
        }}
      />

      <TextEditModal
        visible={editingZoneId !== null}
        zone={editingZone}
        onSave={handleEditSave}
        onClose={() => setEditingZoneId(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.ink },
  canvasScroll: {
    alignItems: 'center',
  },
  canvasWrapper: {
    position: 'relative',
  },
});
