import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

interface BadgeProps {
  type: 'free' | 'premium';
}

export function Badge({ type }: BadgeProps) {
  if (type === 'premium') {
    return (
      <View style={styles.premium}>
        <Ionicons name="diamond" size={10} color={COLORS.white} />
      </View>
    );
  }

  return (
    <View style={styles.free}>
      <Text style={styles.freeText}>Free</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  premium: {
    backgroundColor: COLORS.gold,
    borderRadius: 4,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  free: {
    backgroundColor: COLORS.sage,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  freeText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.white,
  },
});
