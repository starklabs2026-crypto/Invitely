import React, { useRef } from 'react';
import { View, Text, PanResponder, StyleSheet } from 'react-native';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import type { ZoneState } from '@/types/editor';
import { CANVAS_WIDTH } from './EditorCanvas';

interface Props {
  zone: ZoneState;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  canvasHeight: number;
}

/**
 * Sprint 4 text zone renderer.
 * - renderMode 'rn_text'  : React Native Text with shadow + stroke approximation
 * - renderMode 'skia_text': RN Text base + Skia canvas overlay for gradient/glow
 *
 * Stroke is approximated by rendering the same text four times behind the fill
 * layer, offset by strokeWidth in each cardinal direction.
 */
export function StyledTextZone({ zone, isSelected, onSelect, onMove, canvasHeight }: Props) {
  const isSelectedRef = useRef(isSelected);
  isSelectedRef.current = isSelected;
  const zoneRef    = useRef(zone);
  zoneRef.current  = zone;
  const heightRef  = useRef(canvasHeight);
  heightRef.current = canvasHeight;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onMoveRef  = useRef(onMove);
  onMoveRef.current  = onMove;

  const totalMovement = useRef(0);
  const initialPos    = useRef({ x: 0, y: 0 });
  const DAMPING = 0.5;

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
        const newX = initialPos.current.x + (g.dx / CANVAS_WIDTH) * 100 * DAMPING;
        const newY = initialPos.current.y + (g.dy / heightRef.current) * 100 * DAMPING;
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

  const left   = (zone.x / 100) * CANVAS_WIDTH;
  const top    = (zone.y / 100) * canvasHeight;
  const width  = (zone.w / 100) * CANVAS_WIDTH;
  const height = Math.max(24, (zone.h / 100) * canvasHeight);

  const displayText = zone.caps ? zone.text.toUpperCase() : zone.text;
  const shadow      = zone.effects?.shadow;
  const stroke      = zone.effects?.stroke;
  const gradient    = zone.effects?.gradient;
  const glow        = zone.effects?.glow;

  const baseTextStyle = {
    fontSize:    zone.fontSize,
    fontFamily:  zone.fontFamily,
    fontWeight:  zone.bold   ? ('bold'   as const) : ('normal' as const),
    fontStyle:   zone.italic ? ('italic' as const) : ('normal' as const),
    textAlign:   zone.align,
    letterSpacing: zone.letterSpacing ?? 0,
    includeFontPadding: false,
    padding: 0,
    margin:  0,
    backgroundColor: 'transparent',
  };

  // Shadow style (already handled in Step 5, duplicated here for completeness)
  const shadowStyle = shadow ? {
    textShadowOffset: { width: shadow.offsetX, height: shadow.offsetY },
    textShadowRadius: shadow.blur,
    textShadowColor:  shadow.color,
  } : {};

  // Glow via concentric shadows (4 directions)
  const glowStyle = glow ? {
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: glow.radius,
    textShadowColor:  glow.color,
  } : {};

  const fillTextStyle = { ...baseTextStyle, color: zone.color, ...shadowStyle, ...glowStyle };

  // Stroke layers — one Text per cardinal direction offset by stroke width
  const strokeLayers = stroke
    ? ([
        { width: stroke.width,  height: 0 },
        { width: -stroke.width, height: 0 },
        { width: 0,  height: stroke.width },
        { width: 0,  height: -stroke.width },
      ] as const).map((offset, i) => (
        <Text
          key={`stroke-${i}`}
          style={[styles.textLayer, baseTextStyle, {
            color:             stroke.color,
            position:          'absolute',
            textShadowOffset:  offset,
            textShadowRadius:  0,
            textShadowColor:   stroke.color,
          }]}
        >
          {displayText}
        </Text>
      ))
    : null;

  // Gradient overlay via Skia Canvas (only when gradient effect is present)
  const gradientOverlay = gradient ? (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      <Rect x={0} y={0} width={width} height={height}>
        <LinearGradient
          start={gradient.direction === 'vertical'  ? vec(0, 0)     : gradient.direction === 'diagonal' ? vec(0, 0) : vec(0, 0)}
          end={  gradient.direction === 'vertical'  ? vec(0, height) : gradient.direction === 'diagonal' ? vec(width, height) : vec(width, 0)}
          colors={gradient.colors}
        />
      </Rect>
    </Canvas>
  ) : null;

  return (
    <View
      style={[styles.container, { left, top, width, height }]}
      {...panResponder.panHandlers}
    >
      {/* Stroke layers render first (behind fill) */}
      {strokeLayers}

      {/* Fill layer */}
      <Text style={[styles.textLayer, fillTextStyle]}>
        {displayText}
      </Text>

      {/* Gradient overlay on top — blends over fill to tint text */}
      {gradientOverlay}
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
