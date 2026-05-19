import { Dimensions } from 'react-native';
import type { TextZoneDefinition, TextZoneDefinitionV2 } from '@/types/template';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const CANVAS_WIDTH = SCREEN_WIDTH;

export interface PixelRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function zoneV2ToPixels(
  zone: TextZoneDefinitionV2,
  canvasWidth: number,
  canvasHeight: number
): PixelRect {
  return {
    left:   (zone.leftPct   / 100) * canvasWidth,
    top:    (zone.topPct    / 100) * canvasHeight,
    width:  (zone.widthPct  / 100) * canvasWidth,
    height: (zone.heightPct / 100) * canvasHeight,
  };
}

export function zoneV1ToPixels(
  zone: TextZoneDefinition,
  canvasWidth: number,
  canvasHeight: number
): PixelRect {
  return {
    left:   (zone.x / 100) * canvasWidth,
    top:    (zone.y / 100) * canvasHeight,
    width:  (zone.w / 100) * canvasWidth,
    height: (zone.h / 100) * canvasHeight,
  };
}

export function scaledFontSize(
  fontSize: number,
  canvasWidth: number,
  referenceWidth: number = CANVAS_WIDTH
): number {
  return Math.max(4, Math.round(fontSize * (canvasWidth / referenceWidth)));
}

// Convert a v1 zone to v2 (positions map 1:1, no effects, manual review status)
export function upgradeZone(zone: TextZoneDefinition): TextZoneDefinitionV2 {
  return {
    id:          zone.id,
    label:       zone.label,
    defaultText: zone.defaultText,
    leftPct:     zone.x,
    topPct:      zone.y,
    widthPct:    zone.w,
    heightPct:   zone.h,
    fontFamily:  zone.fontFamily,
    fontSize:    zone.fontSize,
    color:       zone.color,
    align:       zone.align,
    bold:        zone.bold,
    italic:      zone.italic,
    renderMode:  'rn_text',
    reviewStatus: 'approved',
  };
}
