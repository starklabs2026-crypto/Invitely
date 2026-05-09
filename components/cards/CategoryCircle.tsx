import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import type { CategoryConfig } from '@/constants/categories';

interface CategoryCircleProps {
  category: CategoryConfig;
  onPress: () => void;
}

export function CategoryCircle({ category, onPress }: CategoryCircleProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.circle, { backgroundColor: category.color }]}>
        <Ionicons
          name={category.icon as React.ComponentProps<typeof Ionicons>['name']}
          size={28}
          color={COLORS.white}
        />
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 72,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.ink,
    textAlign: 'center',
    lineHeight: 14,
  },
});
