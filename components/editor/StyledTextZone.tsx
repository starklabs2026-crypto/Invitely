import React, { useRef } from 'react';
import { View, Text, PanResponder, StyleSheet } from 'react-native';
import type { ZoneState } from '@/types/editor';
import { scaledFontSize } from '@/utils/zoneGeometry';

interface Props {
  zone: ZoneState;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  canvasHeight: number;
  canvasWidth: number;
}

export function StyledTextZone({ zone, isSelected, onSelect, onMove, canvasHeight, canvasWidth }: Props) {
  const isSelectedRef = useRef(isSelected);
  isSelectedRef.current = isSelected;
  const zoneRef    = useRef(zone);
  zoneRef.current  = zone;
  const canvasHeightRef  = useRef(canvasHeight);
  canvasHeightRef.current = canvasHeight;
  const canvasWidthRef   = useRef(canvasWidth);
  canvasWidthRef.current  = canvasWidth;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onMoveRef  = useRef(onMove);
  onMoveRef.current  = onMove;

  const totalMovement = useRef(0);
  const initialPos    = useRef({ x: 0, y: 0 });
  const DAMPING = 1;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  (_, g) => Math.abs(g.dx) > 3 || Math.abs(g.dy) > 3,
      onPanResponderGrant: () => {
        totalMovement.current = 0;
        initialPos.current = { x: zoneRef.current.x, y: zoneRef.current.y };
      },
      onPanResponderMove: (_, g) => {
        totalMovement.current = Math.sqrt(g.dx ** 2 + g.dy ** 2);
        const z    = zoneRef.current;
        const newX = initialPos.current.x + (g.dx / canvasWidthRef.current) * 100 * DAMPING;
        const newY = initialPos.current.y + (g.dy / canvasHeightRef.current) * 100 * DAMPING;
        onMoveRef.current(
          Math.max(0, Math.min(100 - z.w, newX)),
          Math.max(0, Math.min(100 - z.h, newY))
        );
      },
      onPanResponderRelease: () => {
        if (totalMovement.current < 5) onSelectRef.current();
      },
    })
  ).current;

  const left   = (zone.x / 100) * canvasWidth;
  const top    = (zone.y / 100) * canvasHeight;
  const width  = (zone.w / 100) * canvasWidth;
  const height = Math.max(24, (zone.h / 100) * canvasHeight);

  const displayText = zone.caps ? zone.text.toUpperCase() : zone.text;
  const shadow      = zone.effects?.shadow;

  const scaledSize = scaledFontSize(zone.fontSize, canvasWidth, 390);
  const textStyle = {
    fontSize:    scaledSize,
    lineHeight:  zone.lineHeight * scaledSize,
    fontFamily:  zone.fontFamily,
    fontWeight:  zone.bold   ? ('bold'   as const) : ('normal' as const),
    fontStyle:   zone.italic ? ('italic' as const) : ('normal' as const),
    textAlign:   zone.align,
    letterSpacing: zone.letterSpacing ?? 0,
    color:       zone.color,
    includeFontPadding: false,
    padding: 0,
    margin:  0,
    backgroundColor: 'transparent',
    ...(shadow && {
      textShadowOffset: { width: shadow.offsetX, height: shadow.offsetY },
      textShadowRadius: shadow.blur,
      textShadowColor:  shadow.color,
    }),
  };

  return (
    <View
      style={[styles.container, { left, top, width, height }]}
      {...panResponder.panHandlers}
    >
      <Text style={[styles.textLayer, textStyle]}>
        {displayText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    minHeight: 24,
  },
  textLayer: {
    position: 'absolute',
    width:    '100%',
  },
});
