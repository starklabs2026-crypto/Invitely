import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { BottomSheet } from '@/components/layout/BottomSheet';
import type { ZoneState } from '@/types/editor';

interface EditorToolbarProps {
  selectedZone: ZoneState | null;
  onUpdateZone: (updates: Partial<ZoneState>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const FONT_OPTIONS = ['DMSans_400Regular', 'PlayfairDisplay_400Regular', 'PlayfairDisplay_700Bold'];
const FONT_LABELS: Record<string, string> = {
  DMSans_400Regular: 'DM Sans',
  PlayfairDisplay_400Regular: 'Playfair',
  'PlayfairDisplay_700Bold': 'Playfair Bold',
};
const COLOR_OPTIONS = [
  '#1A1614', '#FFFFFF', '#C96442', '#E8A87C', '#C9A96E',
  '#3D8A8A', '#8B7DB8', '#C96480', '#5A8A5A', '#E53935',
];
const SIZE_OPTIONS = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48];

export function EditorToolbar({ selectedZone, onUpdateZone, onDuplicate, onDelete }: EditorToolbarProps) {
  const [fontSheetOpen, setFontSheetOpen] = useState(false);
  const [colorSheetOpen, setColorSheetOpen] = useState(false);
  const [sizeSheetOpen, setSizeSheetOpen] = useState(false);

  if (!selectedZone) return null;

  const row1Items = [
    {
      label: 'Edit',
      icon: 'create-outline' as const,
      onPress: () => {},
    },
    {
      label: 'Font',
      icon: 'text-outline' as const,
      onPress: () => setFontSheetOpen(true),
    },
    {
      label: `${selectedZone.fontSize}px`,
      icon: 'expand-outline' as const,
      onPress: () => setSizeSheetOpen(true),
    },
    {
      label: 'Color',
      icon: 'color-palette-outline' as const,
      onPress: () => setColorSheetOpen(true),
      colorDot: selectedZone.color,
    },
    {
      label: 'Bold',
      icon: 'reorder-four-outline' as const,
      onPress: () => onUpdateZone({ bold: !selectedZone.bold }),
      active: selectedZone.bold,
    },
    {
      label: 'Italic',
      icon: 'text-outline' as const,
      onPress: () => onUpdateZone({ italic: !selectedZone.italic }),
      active: selectedZone.italic,
    },
  ];

  const row2Items = [
    {
      label: 'Align',
      icon: (selectedZone.align === 'left'
        ? 'reorder-four-outline'
        : selectedZone.align === 'right'
        ? 'reorder-four-outline'
        : 'reorder-three-outline') as React.ComponentProps<typeof Ionicons>['name'],
      onPress: () => {
        const next = selectedZone.align === 'left' ? 'center' : selectedZone.align === 'center' ? 'right' : 'left';
        onUpdateZone({ align: next });
      },
    },
    {
      label: 'Spacing',
      icon: 'git-commit-outline' as const,
      onPress: () =>
        onUpdateZone({ letterSpacing: selectedZone.letterSpacing === 0 ? 2 : 0 }),
    },
    {
      label: 'Line Ht',
      icon: 'list-outline' as const,
      onPress: () =>
        onUpdateZone({ lineHeight: selectedZone.lineHeight < 2 ? selectedZone.lineHeight + 0.2 : 1.0 }),
    },
    {
      label: 'CAPS',
      icon: 'arrow-up-outline' as const,
      onPress: () => onUpdateZone({ caps: !selectedZone.caps }),
      active: selectedZone.caps,
    },
    {
      label: 'Arc',
      icon: 'ellipse-outline' as const,
      onPress: () => {},
    },
    {
      label: 'Copy',
      icon: 'copy-outline' as const,
      onPress: onDuplicate,
    },
    {
      label: 'Delete',
      icon: 'trash-outline' as const,
      onPress: onDelete,
      destructive: true,
    },
  ];

  return (
    <>
      <View style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row} contentContainerStyle={styles.rowContent}>
          {row1Items.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.toolButton, item.active && styles.toolButtonActive]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              {item.colorDot ? (
                <View style={[styles.colorDotPreview, { backgroundColor: item.colorDot }]} />
              ) : (
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={item.active ? COLORS.white : COLORS.ink}
                />
              )}
              <Text style={[styles.toolLabel, item.active && styles.toolLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.divider} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row} contentContainerStyle={styles.rowContent}>
          {row2Items.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.toolButton,
                item.active && styles.toolButtonActive,
                item.destructive && styles.toolButtonDestructive,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon}
                size={18}
                color={item.destructive ? '#E53935' : item.active ? COLORS.white : COLORS.ink}
              />
              <Text
                style={[
                  styles.toolLabel,
                  item.active && styles.toolLabelActive,
                  item.destructive && styles.toolLabelDestructive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <BottomSheet visible={fontSheetOpen} onClose={() => setFontSheetOpen(false)} height={220}>
        <Text style={styles.sheetTitle}>Choose Font</Text>
        {FONT_OPTIONS.map((font) => (
          <TouchableOpacity
            key={font}
            style={[styles.sheetRow, selectedZone.fontFamily === font && styles.sheetRowActive]}
            onPress={() => { onUpdateZone({ fontFamily: font }); setFontSheetOpen(false); }}
          >
            <Text style={[styles.sheetRowText, { fontFamily: font }]}>
              {FONT_LABELS[font] ?? font}
            </Text>
            {selectedZone.fontFamily === font && (
              <Ionicons name="checkmark" size={18} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        ))}
      </BottomSheet>

      <BottomSheet visible={colorSheetOpen} onClose={() => setColorSheetOpen(false)} height={200}>
        <Text style={styles.sheetTitle}>Choose Color</Text>
        <View style={styles.colorGrid}>
          {COLOR_OPTIONS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorSwatch,
                { backgroundColor: color },
                selectedZone.color === color && styles.colorSwatchActive,
              ]}
              onPress={() => { onUpdateZone({ color }); setColorSheetOpen(false); }}
            />
          ))}
        </View>
      </BottomSheet>

      <BottomSheet visible={sizeSheetOpen} onClose={() => setSizeSheetOpen(false)} height={220}>
        <Text style={styles.sheetTitle}>Choose Size</Text>
        <ScrollView>
          {SIZE_OPTIONS.map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.sheetRow, selectedZone.fontSize === size && styles.sheetRowActive]}
              onPress={() => { onUpdateZone({ fontSize: size }); setSizeSheetOpen(false); }}
            >
              <Text style={styles.sheetRowText}>{size}px</Text>
              {selectedZone.fontSize === size && (
                <Ionicons name="checkmark" size={18} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 8,
  },
  row: {
    flexShrink: 0,
  },
  rowContent: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  toolButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 52,
    gap: 2,
  },
  toolButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toolButtonDestructive: {
    backgroundColor: 'transparent',
  },
  toolLabel: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: COLORS.ink,
  },
  toolLabelActive: {
    color: COLORS.white,
  },
  toolLabelDestructive: {
    color: '#E53935',
  },
  colorDotPreview: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sheetTitle: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.ink,
    marginBottom: 12,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sheetRowActive: {
    backgroundColor: 'rgba(201,100,66,0.06)',
    borderRadius: 8,
  },
  sheetRowText: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.ink,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 8,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  colorSwatchActive: {
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
});
