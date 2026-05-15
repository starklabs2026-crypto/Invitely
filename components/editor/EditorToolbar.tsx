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
  onEdit: () => void;
}

const FONT_OPTIONS: { key: string; label: string }[] = [
  { key: 'DMSans_400Regular',              label: 'DM Sans' },
  { key: 'DMSans_700Bold',                 label: 'DM Sans Bold' },
  { key: 'PlayfairDisplay_400Regular',     label: 'Playfair' },
  { key: 'PlayfairDisplay_700Bold',        label: 'Playfair Bold' },
  { key: 'CormorantGaramond_400Regular',   label: 'Cormorant' },
  { key: 'CormorantGaramond_700Bold',      label: 'Cormorant Bold' },
  { key: 'GreatVibes_400Regular',          label: 'Great Vibes' },
  { key: 'DancingScript_400Regular',       label: 'Dancing Script' },
  { key: 'DancingScript_700Bold',          label: 'Dancing Bold' },
  { key: 'Cinzel_400Regular',              label: 'Cinzel' },
  { key: 'Cinzel_700Bold',                 label: 'Cinzel Bold' },
  { key: 'Lora_400Regular',               label: 'Lora' },
  { key: 'Lora_700Bold',                  label: 'Lora Bold' },
  { key: 'Montserrat_400Regular',          label: 'Montserrat' },
  { key: 'Montserrat_700Bold',             label: 'Montserrat Bold' },
  { key: 'Sacramento_400Regular',          label: 'Sacramento' },
  { key: 'Raleway_400Regular',             label: 'Raleway' },
  { key: 'Raleway_700Bold',               label: 'Raleway Bold' },
  { key: 'JosefinSans_400Regular',         label: 'Josefin Sans' },
  { key: 'JosefinSans_700Bold',            label: 'Josefin Bold' },
];

const COLOR_OPTIONS = [
  '#1A1614', '#FFFFFF', '#C96442', '#E8A87C', '#C9A96E',
  '#3D8A8A', '#8B7DB8', '#C96480', '#5A8A5A', '#E53935',
  '#1A2744', '#C9A84C', '#4A7C3F', '#2D0030', '#000000',
];

const SIZE_OPTIONS = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72];

const ALIGN_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  left: 'reorder-four-outline',
  center: 'reorder-three-outline',
  right: 'menu-outline',
};

export function EditorToolbar({
  selectedZone,
  onUpdateZone,
  onDuplicate,
  onDelete,
  onEdit,
}: EditorToolbarProps) {
  const [fontSheetOpen, setFontSheetOpen] = useState(false);
  const [colorSheetOpen, setColorSheetOpen] = useState(false);
  const [sizeSheetOpen, setSizeSheetOpen] = useState(false);

  if (!selectedZone) return null;

  const nextAlign = selectedZone.align === 'left' ? 'center' : selectedZone.align === 'center' ? 'right' : 'left';

  const row1Items = [
    {
      label: 'Edit',
      icon: 'create-outline' as const,
      onPress: onEdit,
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
      customLabel: 'B',
      icon: null as null,
      onPress: () => onUpdateZone({ bold: !selectedZone.bold }),
      active: selectedZone.bold,
    },
    {
      label: 'Italic',
      customLabel: 'I',
      icon: null as null,
      onPress: () => onUpdateZone({ italic: !selectedZone.italic }),
      active: selectedZone.italic,
    },
  ];

  const row2Items = [
    {
      label: selectedZone.align === 'left' ? 'Left' : selectedZone.align === 'center' ? 'Center' : 'Right',
      icon: ALIGN_ICONS[selectedZone.align] as React.ComponentProps<typeof Ionicons>['name'],
      onPress: () => onUpdateZone({ align: nextAlign }),
    },
    {
      label: 'Spacing',
      icon: 'git-commit-outline' as const,
      onPress: () =>
        onUpdateZone({ letterSpacing: selectedZone.letterSpacing === 0 ? 2 : 0 }),
      active: selectedZone.letterSpacing > 0,
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.row}
          contentContainerStyle={styles.rowContent}
        >
          {row1Items.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.toolButton, item.active && styles.toolButtonActive]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              {item.colorDot ? (
                <View style={[styles.colorDotPreview, { backgroundColor: item.colorDot }]} />
              ) : item.customLabel ? (
                <Text style={[styles.customIconLabel, item.active && styles.customIconLabelActive]}>
                  {item.customLabel}
                </Text>
              ) : (
                <Ionicons
                  name={item.icon!}
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.row}
          contentContainerStyle={styles.rowContent}
        >
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

      {/* Font picker */}
      <BottomSheet visible={fontSheetOpen} onClose={() => setFontSheetOpen(false)} height={380}>
        <Text style={styles.sheetTitle}>Choose Font</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {FONT_OPTIONS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.sheetRow, selectedZone.fontFamily === f.key && styles.sheetRowActive]}
              onPress={() => { onUpdateZone({ fontFamily: f.key }); setFontSheetOpen(false); }}
            >
              <Text style={[styles.sheetRowText, { fontFamily: f.key }]}>{f.label}</Text>
              {selectedZone.fontFamily === f.key && (
                <Ionicons name="checkmark" size={18} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </BottomSheet>

      {/* Color picker */}
      <BottomSheet visible={colorSheetOpen} onClose={() => setColorSheetOpen(false)} height={220}>
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

      {/* Size picker */}
      <BottomSheet visible={sizeSheetOpen} onClose={() => setSizeSheetOpen(false)} height={280}>
        <Text style={styles.sheetTitle}>Choose Size</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
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
  row: { flexShrink: 0 },
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
  toolLabelActive: { color: COLORS.white },
  toolLabelDestructive: { color: '#E53935' },
  customIconLabel: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.ink,
    lineHeight: 20,
  },
  customIconLabelActive: { color: COLORS.white },
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
