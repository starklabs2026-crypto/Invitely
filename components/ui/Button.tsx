import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}` as keyof typeof styles],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'secondary' ? COLORS.white : COLORS.primary}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`text_${variant}` as keyof typeof styles],
            styles[`textSize_${size}` as keyof typeof styles],
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  primary: { backgroundColor: COLORS.primary } as ViewStyle,
  secondary: { backgroundColor: COLORS.secondary } as ViewStyle,
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary } as ViewStyle,
  ghost: { backgroundColor: 'transparent' } as ViewStyle,
  disabled: { opacity: 0.5 } as ViewStyle,
  size_sm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 } as ViewStyle,
  size_md: { paddingVertical: 14, paddingHorizontal: 24 } as ViewStyle,
  size_lg: { paddingVertical: 18, paddingHorizontal: 32 } as ViewStyle,
  text: { fontFamily: FONTS.semibold } as TextStyle,
  text_primary: { color: COLORS.white } as TextStyle,
  text_secondary: { color: COLORS.white } as TextStyle,
  text_outline: { color: COLORS.primary } as TextStyle,
  text_ghost: { color: COLORS.primary } as TextStyle,
  textSize_sm: { fontSize: 13 } as TextStyle,
  textSize_md: { fontSize: 15 } as TextStyle,
  textSize_lg: { fontSize: 17 } as TextStyle,
});
