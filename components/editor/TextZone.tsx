import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import type { ZoneState } from '@/types/editor';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './EditorCanvas';
import { COLORS } from '@/constants/colors';

interface TextZoneProps {
  zone: ZoneState;
  isSelected: boolean;
  onSelect: () => void;
  onChangeText: (text: string) => void;
  canvasHeight?: number;
}

export function TextZone({ zone, isSelected, onSelect, onChangeText, canvasHeight }: TextZoneProps) {
  const inputRef = useRef<TextInput>(null);
  const resolvedHeight = canvasHeight ?? CANVAS_HEIGHT;

  const left = (zone.x / 100) * CANVAS_WIDTH;
  const top = (zone.y / 100) * resolvedHeight;
  const width = (zone.w / 100) * CANVAS_WIDTH;

  const displayText = zone.caps ? zone.text.toUpperCase() : zone.text;

  return (
    <View style={[styles.container, { left, top, width }]} pointerEvents="box-none">
      {isSelected ? (
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              fontSize: zone.fontSize,
              color: zone.color,
              fontWeight: zone.bold ? 'bold' : 'normal',
              fontStyle: zone.italic ? 'italic' : 'normal',
              textAlign: zone.align,
              letterSpacing: zone.letterSpacing,
              lineHeight: zone.fontSize * zone.lineHeight,
            },
          ]}
          value={displayText}
          onChangeText={onChangeText}
          multiline
          autoFocus
          blurOnSubmit={false}
          selectionColor={COLORS.primary}
        />
      ) : (
        <View
          style={styles.touchArea}
          onTouchStart={onSelect}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    minHeight: 24,
  },
  input: {
    padding: 0,
    margin: 0,
    includeFontPadding: false,
    backgroundColor: 'transparent',
  },
  touchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 24,
  },
});
