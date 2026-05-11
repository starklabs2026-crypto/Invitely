import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { AppHeader } from '@/components/layout/AppHeader';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { SelectionBox } from '@/components/editor/SelectionBox';
import { TextZone } from '@/components/editor/TextZone';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { useEditor } from '@/hooks/useEditor';
import { useTemplate } from '@/hooks/useTemplates';
import { useAuth } from '@/hooks/useAuth';
import { saveDraft } from '@/services/templates';
import { getCanvasHeight } from '@/components/editor/EditorCanvas';

export default function EditorScreen() {
  const { templateId } = useLocalSearchParams<{ templateId: string }>();
  const { data: template } = useTemplate(templateId!);
  const editor = useEditor();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<View>(null);
  const canvasHeight = getCanvasHeight(template?.aspect_ratio);

  useEffect(() => {
    if (template && editor.template?.id !== template.id) {
      editor.initFromTemplate(template);
    }
  }, [template]);

  async function handleNext() {
    if (user && editor.template) {
      setSaving(true);
      try {
        await saveDraft(user.id, editor.template.id, { zones: editor.zones });
      } catch {
        // non-blocking — proceed to share even if save fails
      } finally {
        setSaving(false);
      }
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
        canUndo={editor.canUndo}
        canRedo={editor.canRedo}
        onUndo={editor.undo}
        onRedo={editor.redo}
        rightAction={{
          label: saving ? 'Saving...' : 'Next >',
          onPress: handleNext,
          variant: 'primary',
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.canvasScroll}
          scrollEnabled={!selectedZone}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.canvasWrapper}>
            {template && (
              <EditorCanvas
                ref={canvasRef}
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
                onChangeText={(text) => editor.updateZone(zone.id, { text })}
                onMove={(x, y) => editor.updateZone(zone.id, { x, y })}
                canvasHeight={canvasHeight}
              />
            ))}

            {selectedZone && <SelectionBox zone={selectedZone} canvasHeight={canvasHeight} />}
          </View>
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
        />
      </KeyboardAvoidingView>
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
