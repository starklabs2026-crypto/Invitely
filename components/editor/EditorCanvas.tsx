import React, { forwardRef } from 'react';
import { View, Dimensions } from 'react-native';
import {
  Canvas,
  Image as SkiaImage,
  Fill,
  useImage,
} from '@shopify/react-native-skia';
import { COLORS } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const CANVAS_WIDTH = SCREEN_WIDTH;

export function getCanvasHeight(aspectRatio?: string): number {
  if (!aspectRatio) return SCREEN_WIDTH * (16 / 9);
  const parts = aspectRatio.split(':').map(Number);
  if (parts.length !== 2 || !parts[0] || !parts[1]) return SCREEN_WIDTH * (16 / 9);
  return SCREEN_WIDTH * (parts[1] / parts[0]);
}

export const CANVAS_HEIGHT = getCanvasHeight();

interface EditorCanvasProps {
  bgImageUrl: string;
  onCanvasTap: () => void;
  aspectRatio?: string;
  canvasWidth?: number;
  canvasHeight?: number;
}

export const EditorCanvas = forwardRef<View, EditorCanvasProps>(
  ({ bgImageUrl, onCanvasTap, aspectRatio, canvasWidth, canvasHeight: canvasHeightProp }, ref) => {
    const bgImage = useImage(bgImageUrl);
    const w = canvasWidth ?? CANVAS_WIDTH;
    const h = canvasHeightProp ?? getCanvasHeight(aspectRatio);

    return (
      <View
        ref={ref}
        style={{ width: w, height: h }}
        onTouchStart={onCanvasTap}
        collapsable={false}
      >
        <Canvas style={{ width: w, height: h }}>
          {bgImage ? (
            <SkiaImage
              image={bgImage}
              x={0}
              y={0}
              width={w}
              height={h}
              fit="cover"
            />
          ) : (
            <Fill color={COLORS.bg2} />
          )}
        </Canvas>
      </View>
    );
  }
);

EditorCanvas.displayName = 'EditorCanvas';
