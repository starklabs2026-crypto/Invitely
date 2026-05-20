import React, { useRef, useMemo } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import {
  Canvas,
  Paragraph,
  Skia,
  TileMode,
  TextAlign,
  FontWeight,
  FontSlant,
  PaintStyle,
} from '@shopify/react-native-skia';
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

const ALIGN_MAP: Record<'left' | 'center' | 'right', TextAlign> = {
  left:   TextAlign.Left,
  center: TextAlign.Center,
  right:  TextAlign.Right,
};

export function SkiaTextZone({ zone, isSelected, onSelect, onMove, canvasHeight, canvasWidth }: Props) {
  const isSelectedRef = useRef(isSelected);
  isSelectedRef.current = isSelected;
  const zoneRef = useRef(zone);
  zoneRef.current = zone;
  const canvasHeightRef = useRef(canvasHeight);
  canvasHeightRef.current = canvasHeight;
  const canvasWidthRef = useRef(canvasWidth);
  canvasWidthRef.current = canvasWidth;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

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
          Math.max(0, Math.min(100 - z.h, newY)),
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

  const fontSize = scaledFontSize(zone.fontSize, canvasWidth, 390);
  const displayText = zone.caps ? zone.text.toUpperCase() : zone.text;
  const fx = zone.effects;

  const paragraph = useMemo(() => {
    const paraStyle = {
      textAlign: ALIGN_MAP[zone.align],
      textStyle: {
        fontSize,
        fontFamilies: [zone.fontFamily],
        fontStyle: {
          weight: zone.bold   ? FontWeight.Bold   : FontWeight.Normal,
          slant:  zone.italic ? FontSlant.Italic  : FontSlant.Upright,
        },
        letterSpacing: zone.letterSpacing ?? 0,
        heightMultiplier: zone.lineHeight,
      },
    };

    const builder = Skia.ParagraphBuilder.Make(paraStyle);

    const gradient = fx?.gradient;
    const shadow   = fx?.shadow;
    const glow     = fx?.glow;
    const stroke   = fx?.stroke;

    const baseTextStyle: Parameters<typeof builder.pushStyle>[0] = {
      color: gradient ? Skia.Color('transparent') : Skia.Color(zone.color),
      fontSize,
      fontFamilies: [zone.fontFamily],
      fontStyle: {
        weight: zone.bold   ? FontWeight.Bold   : FontWeight.Normal,
        slant:  zone.italic ? FontSlant.Italic  : FontSlant.Upright,
      },
      letterSpacing: zone.letterSpacing ?? 0,
      ...(shadow && {
        shadows: [{
          color:      Skia.Color(shadow.color),
          offset:     { x: shadow.offsetX, y: shadow.offsetY },
          blurRadius: shadow.blur,
        }],
      }),
      ...(glow && {
        shadows: [{
          color:      Skia.Color(glow.color),
          offset:     { x: 0, y: 0 },
          blurRadius: glow.radius,
        }],
      }),
    };

    let fillPaint: ReturnType<typeof Skia.Paint> | undefined;

    if (gradient) {
      fillPaint = Skia.Paint();
      const colors = gradient.colors.map((c) => Skia.Color(c));
      let start = { x: 0, y: 0 };
      let end   = { x: width, y: 0 };
      if (gradient.direction === 'vertical') {
        end = { x: 0, y: height };
      } else if (gradient.direction === 'diagonal') {
        end = { x: width, y: height };
      }
      const shader = Skia.Shader.MakeLinearGradient(start, end, colors, null, TileMode.Clamp);
      fillPaint.setShader(shader);
    }

    builder.pushStyle(baseTextStyle, fillPaint);
    builder.addText(displayText);
    builder.pop();

    if (stroke) {
      const strokePaint = Skia.Paint();
      strokePaint.setStyle(PaintStyle.Stroke);
      strokePaint.setStrokeWidth(stroke.width);
      strokePaint.setColor(Skia.Color(stroke.color));

      builder.pushStyle(
        { ...baseTextStyle, color: Skia.Color('transparent') },
        strokePaint,
      );
      builder.addText(displayText);
      builder.pop();
    }

    const para = builder.build();
    para.layout(width);
    return para;
  }, [
    zone.align, zone.bold, zone.italic, zone.fontFamily, zone.color,
    zone.letterSpacing, zone.lineHeight, zone.caps, zone.text,
    fontSize, width, height,
    fx?.gradient?.colors.join(','), fx?.gradient?.direction,
    fx?.shadow?.color, fx?.shadow?.offsetX, fx?.shadow?.offsetY, fx?.shadow?.blur,
    fx?.glow?.color, fx?.glow?.radius,
    fx?.stroke?.color, fx?.stroke?.width,
  ]);

  return (
    <View
      style={[styles.container, { left, top, width, height }]}
      {...panResponder.panHandlers}
    >
      <Canvas style={styles.canvas} pointerEvents="none">
        <Paragraph paragraph={paragraph} x={0} y={0} width={width} />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    minHeight: 24,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
});
