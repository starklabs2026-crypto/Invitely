import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ZoneState } from '@/types/editor';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './EditorCanvas';

interface SelectionBoxProps {
  zone: ZoneState;
  canvasHeight?: number;
}

export function SelectionBox({ zone, canvasHeight }: SelectionBoxProps) {
  const resolvedHeight = canvasHeight ?? CANVAS_HEIGHT;
  const left = (zone.x / 100) * CANVAS_WIDTH - 4;
  const top = (zone.y / 100) * resolvedHeight - 4;
  const width = (zone.w / 100) * CANVAS_WIDTH + 8;
  const height = (zone.h / 100) * resolvedHeight + 8;

  return (
    <View style={[styles.box, { left, top, width, height }]} pointerEvents="none">
      <View style={[styles.handle, styles.tl]} />
      <View style={[styles.handle, styles.tr]} />
      <View style={[styles.handle, styles.bl]} />
      <View style={[styles.handle, styles.br]} />
    </View>
  );
}

const HANDLE_SIZE = 10;
const HANDLE_OFFSET = -(HANDLE_SIZE / 2);

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#22C55E',
    borderStyle: 'dashed',
    borderRadius: 4,
  },
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: '#22C55E',
  },
  tl: { top: HANDLE_OFFSET, left: HANDLE_OFFSET },
  tr: { top: HANDLE_OFFSET, right: HANDLE_OFFSET },
  bl: { bottom: HANDLE_OFFSET, left: HANDLE_OFFSET },
  br: { bottom: HANDLE_OFFSET, right: HANDLE_OFFSET },
});
