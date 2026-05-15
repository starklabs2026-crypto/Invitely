import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import type { ZoneState } from '@/types/editor';

interface TextEditModalProps {
  visible: boolean;
  zone: ZoneState | null;
  onSave: (text: string) => void;
  onClose: () => void;
}

export function TextEditModal({ visible, zone, onSave, onClose }: TextEditModalProps) {
  const [localText, setLocalText] = useState('');

  useEffect(() => {
    if (visible && zone) {
      setLocalText(zone.caps ? zone.text.toUpperCase() : zone.text);
    }
  }, [visible, zone]);

  function handleDone() {
    onSave(localText);
    onClose();
  }

  if (!zone) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <Ionicons name="close" size={22} color={COLORS.ink} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{zone.label}</Text>
            <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Input area */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.input,
                {
                  fontFamily: zone.fontFamily,
                  fontSize: Math.min(zone.fontSize, 28),
                  color: zone.color,
                  fontWeight: zone.bold ? 'bold' : 'normal',
                  fontStyle: zone.italic ? 'italic' : 'normal',
                  textAlign: zone.align,
                },
              ]}
              value={localText}
              onChangeText={setLocalText}
              multiline
              autoFocus
              placeholder={`Enter ${zone.label ?? 'text'}…`}
              placeholderTextColor={COLORS.muted}
              selectionColor={COLORS.primary}
              submitBehavior="newline"
            />
          </View>

          {/* Hint */}
          <Text style={styles.hint}>
            Formatting (font, size, color) is applied on the canvas.
          </Text>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
    padding: 4,
    minWidth: 40,
  },
  headerTitle: {
    fontFamily: FONTS.semibold,
    fontSize: 16,
    color: COLORS.ink,
  },
  doneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  doneText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.white,
  },
  inputWrapper: {
    flex: 1,
    padding: 20,
  },
  input: {
    flex: 1,
    textAlignVertical: 'top',
    padding: 0,
    margin: 0,
    includeFontPadding: false,
  },
  hint: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
});
