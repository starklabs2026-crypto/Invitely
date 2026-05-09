import React, { forwardRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  Canvas,
  Image as SkiaImage,
  Text as SkiaText,
  useImage,
  Fill,
  Rect,
  DashPathEffect,
} from '@shopify/react-native-skia';
import type { ZoneState } from '@/types/editor';
import { COLORS } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const CANVAS_WIDTH = SCREEN_WIDTH;

export function getCanvasHeight(aspectRatio?: string): number {
  if (!aspectRatio) return SCREEN_WIDTH * (7 / 5);
  const parts = aspectRatio.split(':').map(Number);
  if (parts.length !== 2 || !parts[0] || !parts[1]) return SCREEN_WIDTH * (7 / 5);
  return SCREEN_WIDTH * (parts[1] / parts[0]);
}

export const CANVAS_HEIGHT = getCanvasHeight();

interface EditorCanvasProps {
  bgImageUrl: string;
  zones: ZoneState[];
  selectedZoneId: string | null;
  onZoneTap: (id: string) => void;
  onCanvasTap: () => void;
  aspectRatio?: string;
}

export const EditorCanvas = forwardRef<View, EditorCanvasProps>(
  ({ bgImageUrl, zones, selectedZoneId, onZoneTap, onCanvasTap, aspectRatio }, ref) => {
    const bgImage = useImage(bgImageUrl);
    const canvasHeight = getCanvasHeight(aspectRatio);

    return (
      <View ref={ref} style={{ width: CANVAS_WIDTH, height: canvasHeight }} collapsable={false}>
        <Canvas style={{ width: CANVAS_WIDTH, height: canvasHeight, position: 'absolute' }}>
          {bgImage ? (
            <SkiaImage
              image={bgImage}
              x={0}
              y={0}
              width={CANVAS_WIDTH}
              height={canvasHeight}
              fit="cover"
            />
          ) : (
            <Fill color={COLORS.bg2} />
          )}

          {zones.map((zone) => (
            <ZoneRenderer
              key={zone.id}
              zone={zone}
              canvasWidth={CANVAS_WIDTH}
              canvasHeight={canvasHeight}
              isSelected={zone.id === selectedZoneId}
            />
          ))}
        </Canvas>

        {zones.map((zone) => (
          <ZoneTouchOverlay
            key={zone.id}
            zone={zone}
            canvasWidth={CANVAS_WIDTH}
            canvasHeight={canvasHeight}
            onTap={() => onZoneTap(zone.id)}
          />
        ))}

        <View
          style={StyleSheet.absoluteFillObject}
          onTouchStart={onCanvasTap}
          pointerEvents="box-none"
        />
      </View>
    );
  }
);

EditorCanvas.displayName = 'EditorCanvas';

interface ZoneRendererProps {
  zone: ZoneState;
  canvasWidth: number;
  canvasHeight: number;
  isSelected: boolean;
}

function ZoneRenderer({ zone, canvasWidth, canvasHeight, isSelected }: ZoneRendererProps) {
  const x = (zone.x / 100) * canvasWidth;
  const y = (zone.y / 100) * canvasHeight;
  const w = (zone.w / 100) * canvasWidth;
  const h = (zone.h / 100) * canvasHeight;

  const displayText = zone.caps ? zone.text.toUpperCase() : zone.text;

  return (
    <>
      <SkiaText
        x={x}
        y={y + zone.fontSize}
        text={displayText}
        font={null}
        color={zone.color}
      />
      {isSelected && (
        <Rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} color="transparent" strokeWidth={2}>
          <DashPathEffect intervals={[6, 3]} />
        </Rect>
      )}
    </>
  );
}

interface ZoneTouchOverlayProps {
  zone: ZoneState;
  canvasWidth: number;
  canvasHeight: number;
  onTap: () => void;
}

function ZoneTouchOverlay({ zone, canvasWidth, canvasHeight, onTap }: ZoneTouchOverlayProps) {
  const left = (zone.x / 100) * canvasWidth;
  const top = (zone.y / 100) * canvasHeight;
  const width = (zone.w / 100) * canvasWidth;
  const height = (zone.h / 100) * canvasHeight;

  return (
    <View
      style={[styles.touchOverlay, { left, top, width, height }]}
      onTouchStart={onTap}
    />
  );
}

const styles = StyleSheet.create({
  touchOverlay: {
    position: 'absolute',
  },
});
