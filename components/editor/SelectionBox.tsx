import React, { useRef } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import type { ZoneState } from '@/types/editor';

// EXPAND: how far the outer container bleeds past the zone on each side.
// Handles are 32×32 touch targets centered on each zone corner, so they
// each need 16px of bleed. We use 16 to keep them fully inside the container.
const EXPAND = 16;
const TOUCH  = 32;  // touch target per handle
const DOT    = 14;  // visual circle diameter

type Corner = 'tl' | 'tr' | 'bl' | 'br';

interface SelectionBoxProps {
  zone: ZoneState;
  canvasHeight: number;
  canvasWidth: number;
  onResizeStart: () => void;
  onResize: (updates: Pick<ZoneState, 'x' | 'y' | 'w' | 'h'>) => void;
}

export function SelectionBox({
  zone,
  canvasHeight,
  canvasWidth,
  onResizeStart,
  onResize,
}: SelectionBoxProps) {
  const zoneRef          = useRef(zone);
  zoneRef.current        = zone;
  const cwRef            = useRef(canvasWidth);
  cwRef.current          = canvasWidth;
  const chRef            = useRef(canvasHeight);
  chRef.current          = canvasHeight;
  const onResizeRef      = useRef(onResize);
  onResizeRef.current    = onResize;
  const onStartRef       = useRef(onResizeStart);
  onStartRef.current     = onResizeStart;

  const initialZone = useRef({ x: 0, y: 0, w: 0, h: 0 });

  function makeHandlePR(corner: Corner) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderGrant: () => {
        onStartRef.current();                           // snapshot for undo
        const z = zoneRef.current;
        initialZone.current = { x: z.x, y: z.y, w: z.w, h: z.h };
      },
      onPanResponderMove: (_, g) => {
        const iz = initialZone.current;
        const dx = (g.dx / cwRef.current) * 100;
        const dy = (g.dy / chRef.current) * 100;
        let { x, y, w, h } = iz;

        if (corner === 'tl') {
          w = Math.max(5, iz.w - dx);
          h = Math.max(5, iz.h - dy);
          x = iz.x + (iz.w - w);
          y = iz.y + (iz.h - h);
        } else if (corner === 'tr') {
          w = Math.max(5, iz.w + dx);
          h = Math.max(5, iz.h - dy);
          y = iz.y + (iz.h - h);
        } else if (corner === 'bl') {
          w = Math.max(5, iz.w - dx);
          h = Math.max(5, iz.h + dy);
          x = iz.x + (iz.w - w);
        } else {
          w = Math.max(5, iz.w + dx);
          h = Math.max(5, iz.h + dy);
        }

        x = Math.max(0, Math.min(100 - w, x));
        y = Math.max(0, Math.min(100 - h, y));
        onResizeRef.current({ x, y, w, h });
      },
    });
  }

  const tlPR = useRef(makeHandlePR('tl')).current;
  const trPR = useRef(makeHandlePR('tr')).current;
  const blPR = useRef(makeHandlePR('bl')).current;
  const brPR = useRef(makeHandlePR('br')).current;

  const left   = (zone.x / 100) * canvasWidth  - EXPAND;
  const top    = (zone.y / 100) * canvasHeight - EXPAND;
  const width  = (zone.w / 100) * canvasWidth  + EXPAND * 2;
  const height = (zone.h / 100) * canvasHeight + EXPAND * 2;

  return (
    <View
      style={[styles.outer, { left, top, width, height }]}
      pointerEvents="box-none"
    >
      {/* Dashed border aligned to zone bounds */}
      <View style={styles.border} pointerEvents="none" />

      {/* 32×32 touch targets centered on each zone corner */}
      <View style={[styles.handle, styles.tl]} {...tlPR.panHandlers}>
        <View style={styles.dot} />
      </View>
      <View style={[styles.handle, styles.tr]} {...trPR.panHandlers}>
        <View style={styles.dot} />
      </View>
      <View style={[styles.handle, styles.bl]} {...blPR.panHandlers}>
        <View style={styles.dot} />
      </View>
      <View style={[styles.handle, styles.br]} {...brPR.panHandlers}>
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
  },
  border: {
    position: 'absolute',
    top:    EXPAND - 1,
    left:   EXPAND - 1,
    right:  EXPAND - 1,
    bottom: EXPAND - 1,
    borderWidth:  2,
    borderColor:  '#22C55E',
    borderStyle:  'dashed',
    borderRadius: 4,
  },
  handle: {
    position:        'absolute',
    width:           TOUCH,
    height:          TOUCH,
    alignItems:      'center',
    justifyContent:  'center',
  },
  tl: { top: 0,    left:  0  },
  tr: { top: 0,    right: 0  },
  bl: { bottom: 0, left:  0  },
  br: { bottom: 0, right: 0  },
  dot: {
    width:           DOT,
    height:          DOT,
    borderRadius:    DOT / 2,
    backgroundColor: '#22C55E',
    borderWidth:     2,
    borderColor:     '#FFFFFF',
  },
});
