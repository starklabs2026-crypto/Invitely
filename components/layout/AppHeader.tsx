import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showUndo?: boolean;
  showRedo?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  rightAction?: { label: string; onPress: () => void; variant?: 'primary' | 'default' };
}

export function AppHeader({
  title,
  showBack = false,
  showUndo = false,
  showRedo = false,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  rightAction,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={22} color={COLORS.ink} />
          </TouchableOpacity>
        )}
        {showUndo && (
          <TouchableOpacity
            onPress={onUndo}
            style={[styles.iconButton, !canUndo && styles.disabled]}
            disabled={!canUndo}
          >
            <Ionicons name="arrow-undo" size={20} color={canUndo ? COLORS.ink : COLORS.muted} />
          </TouchableOpacity>
        )}
        {showRedo && (
          <TouchableOpacity
            onPress={onRedo}
            style={[styles.iconButton, !canRedo && styles.disabled]}
            disabled={!canRedo}
          >
            <Ionicons name="arrow-redo" size={20} color={canRedo ? COLORS.ink : COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>

      {title && <Text style={styles.title}>{title}</Text>}

      <View style={styles.right}>
        {rightAction && (
          <TouchableOpacity
            onPress={rightAction.onPress}
            style={[
              styles.rightActionButton,
              rightAction.variant === 'primary' && styles.rightActionPrimary,
            ]}
          >
            <Text
              style={[
                styles.rightActionLabel,
                rightAction.variant === 'primary' && styles.rightActionLabelPrimary,
              ]}
            >
              {rightAction.label}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.4,
  },
  title: {
    fontFamily: FONTS.semibold,
    fontSize: 16,
    color: COLORS.ink,
    textAlign: 'center',
  },
  rightActionButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  rightActionPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  rightActionLabel: {
    fontFamily: FONTS.semibold,
    fontSize: 13,
    color: COLORS.ink,
  },
  rightActionLabelPrimary: {
    color: COLORS.white,
  },
});
