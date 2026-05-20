import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  StyleSheet,
  Alert,
  View,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import { COLORS } from '@/constants/colors';
import { AppHeader } from '@/components/layout/AppHeader';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { SelectionBox } from '@/components/editor/SelectionBox';
import { TextZone } from '@/components/editor/TextZone';
import { StyledTextZone } from '@/components/editor/StyledTextZone';
import { SkiaTextZone } from '@/components/editor/SkiaTextZone';
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
  const { fontsLoaded } = useEditorFonts();
  const { user } = useAuth();
  const setCapturedUri = useEditorStore((s) => s.setCapturedUri);
  const cardId = useEditorStore((s) => s.cardId);
  const setCardId = useEditorStore((s) => s.setCardId);
  const [saving, setSaving] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const viewShotRef = useRef<ViewShot>(null);
  const { width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    if (template && editor.template?.id !== template.id) {
      editor.initFromTemplate(template);
    }
  }, [template]);

  const naturalCanvasHeight = getCanvasHeight(template?.aspect_ratio);

  // Fit the entire canvas within the container — no scroll, so PanResponder works cleanly
  const { canvasWidth, canvasHeight } = useMemo(() => {
    if (containerSize.width === 0 || containerSize.height === 0) {
      return { canvasWidth: screenWidth, canvasHeight: naturalCanvasHeight };
    }
    const scale = Math.min(
      containerSize.width / screenWidth,
      containerSize.height / naturalCanvasHeight,
      1,
    );
    return {
      canvasWidth: Math.floor(screenWidth * scale),
      canvasHeight: Math.floor(naturalCanvasHeight * scale),
    };
  }, [containerSize, screenWidth, naturalCanvasHeight]);

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
      await new Promise((r) => setTimeout(r, 150));
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
    // edges={['bottom']} — AppHeader handles the top inset via useSafeAreaInsets()
    <SafeAreaView style={styles.safe} edges={['bottom']}>
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

      {/* Canvas container fills all remaining space between header and toolbar */}
      <View
        style={styles.canvasContainer}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setContainerSize((prev) =>
            prev.width === width && prev.height === height ? prev : { width, height }
          );
        }}
      >
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', quality: 1.0 }}
          style={{ width: canvasWidth, height: canvasHeight }}
        >
          {template && (
            <EditorCanvas
              bgImageUrl={template.bg_image_url}
              onCanvasTap={() => editor.selectZone(null)}
              aspectRatio={template.aspect_ratio}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
            />
          )}

          {fontsLoaded && editor.zones.map((zone) => {
            const fx = zone.effects;
            const needsSkia    = !!(fx?.gradient || fx?.glow || fx?.stroke);
            const hasShadowOnly = !!fx?.shadow && !needsSkia;
            const ZoneComponent = needsSkia ? SkiaTextZone : hasShadowOnly ? StyledTextZone : TextZone;
            return (
              <ZoneComponent
                key={zone.id}
                zone={zone}
                isSelected={zone.id === editor.selectedZoneId}
                onSelect={() => editor.selectZone(zone.id)}
                onMove={(x, y) => editor.updateZone(zone.id, { x, y })}
                canvasHeight={canvasHeight}
                canvasWidth={canvasWidth}
              />
            );
          })}

          {fontsLoaded && selectedZone && (
            <SelectionBox
              zone={selectedZone}
              canvasHeight={canvasHeight}
              canvasWidth={canvasWidth}
              onResizeStart={() => {
                editor.pushToUndo();
              }}
              onResize={(updates) => {
                if (editor.selectedZoneId) {
                  editor.updateZoneLive(editor.selectedZoneId, updates);
                }
              }}
            />
          )}
        </ViewShot>
      </View>

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
  canvasContainer: {
    flex: 1,
    backgroundColor: COLORS.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
