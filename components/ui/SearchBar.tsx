import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onSubmit?: () => void;
  placeholder?: string;
  editable?: boolean;
  style?: ViewStyle;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  onFocus,
  onSubmit,
  placeholder = 'Search templates...',
  editable = true,
  style,
  autoFocus = false,
}: SearchBarProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={!editable ? onFocus : undefined}
      activeOpacity={editable ? 1 : 0.7}
    >
      <Ionicons name="search-outline" size={18} color={COLORS.muted} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={COLORS.muted}
        editable={editable}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg2,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.ink,
    padding: 0,
  },
});
