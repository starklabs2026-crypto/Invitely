import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import type { Template } from '@/types/template';
import { TemplateThumbnail } from './TemplateThumbnail';

interface TemplateCardProps {
  template: Template;
  onPress: (id: string) => void;
  onFavourite: (id: string) => void;
  isFavourited: boolean;
}

export function TemplateCard({ template, onPress, onFavourite, isFavourited }: TemplateCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(template.id)}
      activeOpacity={0.9}
    >
      <View style={styles.imageWrapper}>
        <TemplateThumbnail template={template} />

        {template.tier === 'premium' && (
          <View style={styles.crownBadge}>
            <Ionicons name="diamond" size={10} color={COLORS.white} />
          </View>
        )}

        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => onFavourite(template.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isFavourited ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavourited ? '#E53935' : COLORS.white}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {template.name}
      </Text>

      <View style={styles.colorDots}>
        {template.color_palette.slice(0, 3).map((color, i) => (
          <View key={i} style={[styles.dot, { backgroundColor: color }]} />
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
  },
  imageWrapper: {
    aspectRatio: 5 / 7,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.bg2,
  },
  crownBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.gold,
    borderRadius: 6,
    padding: 4,
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 14,
    padding: 5,
  },
  name: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.ink,
    marginTop: 6,
    marginBottom: 4,
  },
  colorDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
