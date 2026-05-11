import React, { useRef } from 'react';
import { View, Text, TextInput, PanResponder, StyleSheet } from 'react-native';
import type { ZoneState } from '@/types/editor';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './EditorCanvas';
import { COLORS } from '@/constants/colors';

interface TextZoneProps {
  zone: ZoneState;
  isSelected: boolean;
  onSelect: () => void;
  onChangeText: (text: string) => void;
  onMove: (x: number, y: number) => void;
  canvasHeight?: number;
}

export function TextZone({ zone, isSelected, onSelect, onChangeText, onMove, canvasHeight }: TextZoneProps) {
  const inputRef = useRef<TextInput>(null);
  const resolvedHeight = canvasHeight ?? CANVAS_HEIGHT;

  // Keep mutable refs in sync so PanResponder callbacks never go stale
  const isSelectedRef = useRef(isSelected);
  isSelectedRef.current = isSelected;
  const zoneRef = useRef(zone);
  zoneRef.current = zone;
  const resolvedHeightRef = useRef(resolvedHeight);
  resolvedHeightRef.current = resolvedHeight;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  const totalMovement = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isSelectedRef.current,
      onMoveShouldSetPanResponder: (_, g) =>
        !isSelectedRef.current && (Math.abs(g.dx) > 3 || Math.abs(g.dy) > 3),
      onPanResponderGrant: () => {
        totalMovement.current = 0;
      },
      onPanResponderMove: (_, g) => {
        totalMovement.current = Math.sqrt(g.dx ** 2 + g.dy ** 2);
        const z = zoneRef.current;
        const h = resolvedHeightRef.current;
        const newX = z.x + (g.dx / CANVAS_WIDTH) * 100;
        const newY = z.y + (g.dy / h) * 100;
        onMoveRef.current(
          Math.max(0, Math.min(100 - z.w, newX)),
          Math.max(0, Math.min(100 - z.h, newY))
        );
      },
      onPanResponderRelease: () => {
        if (totalMovement.current < 5) {
          onSelectRef.current();
        }
      },
    })
  ).current;

  const left = (zone.x / 100) * CANVAS_WIDTH;
  const top = (zone.y / 100) * resolvedHeight;
  const width = (zone.w / 100) * CANVAS_WIDTH;
  const displayText = zone.caps ? zone.text.toUpperCase() : zone.text;

  const textStyle = {
    fontSize: zone.fontSize,
    color: zone.color,
    fontFamily: zone.fontFamily,
    fontWeight: zone.bold ? ('bold' as const) : ('normal' as const),
    fontStyle: zone.italic ? ('italic' as const) : ('normal' as const),
    textAlign: zone.align,
    letterSpacing: zone.letterSpacing,
    lineHeight: zone.fontSize * zone.lineHeight,
  };

  return (
    <View
      style={[styles.container, { left, top, width }]}
      {...(!isSelected ? panResponder.panHandlers : {})}
    >
      {isSelected ? (
        <TextInput
          ref={inputRef}
          style={[styles.field, textStyle]}
          value={displayText}
          onChangeText={onChangeText}
          multiline
          autoFocus
          submitBehavior="newline"
          selectionColor={COLORS.primary}
        />
      ) : (
        <Text style={[styles.field, textStyle]}>{displayText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    minHeight: 24,
  },
  field: {
    padding: 0,
    margin: 0,
    includeFontPadding: false,
    backgroundColor: 'transparent',
  },
});
