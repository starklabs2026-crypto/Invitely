import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import type { Template } from '@/types/template';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.58;

interface TrendingCardProps {
  template: Template;
  onPress: () => void;
}

export function TrendingCard({ template, onPress }: TrendingCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri: template.thumb_url }}
        style={styles.image}
        resizeMode="cover"
        defaultSource={require('@/assets/placeholder.png')}
      />
      <View style={styles.overlay}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {template.name}
          </Text>
          {template.tier === 'premium' && (
            <View style={styles.premiumBadge}>
              <Ionicons name="diamond" size={9} color={COLORS.white} />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.3,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.bg2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  info: {
    gap: 4,
  },
  name: {
    fontFamily: FONTS.semibold,
    fontSize: 13,
    color: COLORS.white,
    lineHeight: 17,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.gold,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  premiumText: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: COLORS.white,
  },
});
