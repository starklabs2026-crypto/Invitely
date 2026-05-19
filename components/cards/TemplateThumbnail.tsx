import React, { useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import type { Template } from '@/types/template';
import { CANVAS_WIDTH } from '@/components/editor/EditorCanvas';

interface Props {
  template: Template;
}

export function TemplateThumbnail({ template }: Props) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Prefer v2 zones (AI-ingested, accurate positions + fonts) over v1
  const useV2 = !!(template.text_zones_v2 && template.text_zones_v2.length > 0);

  return (
    <View
      style={StyleSheet.absoluteFill}
      onLayout={(e) =>
        setSize({
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        })
      }
    >
      <Image
        source={{ uri: template.bg_image_url }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {size.width > 0 && useV2 &&
        template.text_zones_v2!.map((zone) => {
          const left   = (zone.leftPct   / 100) * size.width;
          const top    = (zone.topPct    / 100) * size.height;
          const width  = (zone.widthPct  / 100) * size.width;
          const height = Math.max(4, (zone.heightPct / 100) * size.height);
          const scale  = size.width / CANVAS_WIDTH;
          const fontSize = Math.max(4, Math.round(zone.fontSize * scale));

          return (
            <Text
              key={zone.id}
              numberOfLines={2}
              style={{
                position: 'absolute',
                left,
                top,
                width,
                height,
                fontSize,
                fontFamily: zone.fontFamily,
                color: zone.color,
                fontWeight: zone.bold ? 'bold' : 'normal',
                fontStyle: zone.italic ? 'italic' : 'normal',
                textAlign: zone.align,
                includeFontPadding: false,
              }}
            >
              {zone.defaultText}
            </Text>
          );
        })}

      {size.width > 0 && !useV2 &&
        template.text_zones.map((zone) => {
          const left   = (zone.x / 100) * size.width;
          const top    = (zone.y / 100) * size.height;
          const width  = (zone.w / 100) * size.width;
          const height = Math.max(4, (zone.h / 100) * size.height);
          const scale  = size.width / CANVAS_WIDTH;
          const fontSize = Math.max(4, Math.round(zone.fontSize * scale));

          return (
            <Text
              key={zone.id}
              numberOfLines={2}
              style={{
                position: 'absolute',
                left,
                top,
                width,
                height,
                fontSize,
                fontFamily: zone.fontFamily,
                color: zone.color,
                fontWeight: zone.bold ? 'bold' : 'normal',
                fontStyle: zone.italic ? 'italic' : 'normal',
                textAlign: zone.align,
                includeFontPadding: false,
              }}
            >
              {zone.defaultText}
            </Text>
          );
        })}
    </View>
  );
}
