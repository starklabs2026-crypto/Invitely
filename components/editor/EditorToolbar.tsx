import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
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

const FONT_OPTIONS: { key: string; label: string; category: string }[] = [
  // Sans-serif
  { key: 'DMSans_400Regular',              label: 'DM Sans',           category: 'Sans-serif' },
  { key: 'DMSans_700Bold',                 label: 'DM Sans Bold',      category: 'Sans-serif' },
  { key: 'Montserrat_400Regular',          label: 'Montserrat',        category: 'Sans-serif' },
  { key: 'Montserrat_700Bold',             label: 'Montserrat Bold',   category: 'Sans-serif' },
  { key: 'Raleway_400Regular',             label: 'Raleway',           category: 'Sans-serif' },
  { key: 'Raleway_700Bold',               label: 'Raleway Bold',      category: 'Sans-serif' },
  { key: 'JosefinSans_400Regular',         label: 'Josefin Sans',      category: 'Sans-serif' },
  { key: 'JosefinSans_700Bold',            label: 'Josefin Bold',      category: 'Sans-serif' },
  { key: 'Oswald_400Regular',              label: 'Oswald',            category: 'Sans-serif' },
  { key: 'Oswald_700Bold',                 label: 'Oswald Bold',       category: 'Sans-serif' },
  { key: 'BebasNeue_400Regular',           label: 'Bebas Neue',        category: 'Sans-serif' },
  { key: 'AmaticSC_400Regular',            label: 'Amatic SC',         category: 'Sans-serif' },
  { key: 'AmaticSC_700Bold',              label: 'Amatic SC Bold',    category: 'Sans-serif' },
  { key: 'PatrickHand_400Regular',         label: 'Patrick Hand',      category: 'Sans-serif' },
  { key: 'Bangers_400Regular',             label: 'Bangers',           category: 'Sans-serif' },
  // Serif
  { key: 'PlayfairDisplay_400Regular',     label: 'Playfair',          category: 'Serif' },
  { key: 'PlayfairDisplay_700Bold',        label: 'Playfair Bold',     category: 'Serif' },
  { key: 'CormorantGaramond_400Regular',   label: 'Cormorant',         category: 'Serif' },
  { key: 'CormorantGaramond_700Bold',      label: 'Cormorant Bold',    category: 'Serif' },
  { key: 'CormorantSC_400Regular',         label: 'Cormorant SC',      category: 'Serif' },
  { key: 'CormorantSC_700Bold',            label: 'Cormorant SC Bold', category: 'Serif' },
  { key: 'Cinzel_400Regular',              label: 'Cinzel',            category: 'Serif' },
  { key: 'Cinzel_700Bold',                 label: 'Cinzel Bold',       category: 'Serif' },
  { key: 'Lora_400Regular',               label: 'Lora',              category: 'Serif' },
  { key: 'Lora_700Bold',                  label: 'Lora Bold',         category: 'Serif' },
  { key: 'BodoniModa_400Regular',          label: 'Bodoni Moda',       category: 'Serif' },
  { key: 'BodoniModa_700Bold',             label: 'Bodoni Moda Bold',  category: 'Serif' },
  { key: 'Prata_400Regular',               label: 'Prata',             category: 'Serif' },
  { key: 'EBGaramond_400Regular',          label: 'EB Garamond',       category: 'Serif' },
  { key: 'Ultra_400Regular',               label: 'Ultra',             category: 'Serif' },
  { key: 'Rye_400Regular',                 label: 'Rye',               category: 'Serif' },
  // Script
  { key: 'GreatVibes_400Regular',          label: 'Great Vibes',       category: 'Script' },
  { key: 'DancingScript_400Regular',       label: 'Dancing Script',    category: 'Script' },
  { key: 'DancingScript_700Bold',          label: 'Dancing Bold',      category: 'Script' },
  { key: 'Sacramento_400Regular',          label: 'Sacramento',        category: 'Script' },
  { key: 'Allura_400Regular',              label: 'Allura',            category: 'Script' },
  { key: 'KaushanScript_400Regular',       label: 'Kaushan Script',    category: 'Script' },
  { key: 'AlexBrush_400Regular',           label: 'Alex Brush',        category: 'Script' },
  { key: 'PinyonScript_400Regular',        label: 'Pinyon Script',     category: 'Script' },
  { key: 'Caveat_400Regular',              label: 'Caveat',            category: 'Script' },
  { key: 'Caveat_700Bold',                 label: 'Caveat Bold',       category: 'Script' },
  // Display
  { key: 'PermanentMarker_400Regular',     label: 'Permanent Marker',  category: 'Display' },
  { key: 'BungeeInline_400Regular',        label: 'Bungee Inline',     category: 'Display' },
  { key: 'Spirax_400Regular',              label: 'Spirax',            category: 'Display' },
];

const COLOR_OPTIONS = [
  '#000000', '#FFFFFF', '#1A1614', '#4A4A4A', '#9E9E9E',
  '#E53935', '#FF7043', '#FFA726', '#FFEE58', '#9CCC65',
  '#26A69A', '#42A5F5', '#5C6BC0', '#AB47BC', '#EC407A',
  '#C96442', '#E8A87C', '#C9A96E', '#1A2744', '#2D0030',
];

// Auto-generated from FONT_OPTIONS: regular ↔ bold variant pairs
const REGULAR_TO_BOLD: Record<string, string> = {};
const BOLD_TO_REGULAR: Record<string, string> = {};
FONT_OPTIONS.forEach(({ key }) => {
  if (key.endsWith('_400Regular')) {
    const boldKey = key.replace('_400Regular', '_700Bold');
    if (FONT_OPTIONS.some((f) => f.key === boldKey)) {
      REGULAR_TO_BOLD[key] = boldKey;
      BOLD_TO_REGULAR[boldKey] = key;
    }
  }
});

function resolveBoldFont(fontFamily: string, bold: boolean): string {
  if (bold) return REGULAR_TO_BOLD[fontFamily] ?? fontFamily;
  return BOLD_TO_REGULAR[fontFamily] ?? fontFamily;
}

function isValidHex(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value) || /^#[0-9A-Fa-f]{3}$/.test(value);
}

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
  const [customColor, setCustomColor] = useState('');

  if (!selectedZone) return null;

  const nextAlign = selectedZone.align === 'left' ? 'center' : selectedZone.align === 'center' ? 'right' : 'left';

  const items = [
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
      label: 'Color',
      icon: 'color-palette-outline' as const,
      onPress: () => setColorSheetOpen(true),
      colorDot: selectedZone.color,
    },
    {
      label: 'Bold',
      customLabel: 'B',
      icon: null as null,
      onPress: () => {
        const newBold = !selectedZone.bold;
        onUpdateZone({ bold: newBold, fontFamily: resolveBoldFont(selectedZone.fontFamily, newBold) });
      },
      active: selectedZone.bold,
    },
    {
      label: 'Italic',
      customLabel: 'I',
      icon: null as null,
      onPress: () => onUpdateZone({ italic: !selectedZone.italic }),
      active: selectedZone.italic,
    },
    {
      label: selectedZone.align === 'left' ? 'Left' : selectedZone.align === 'center' ? 'Center' : 'Right',
      icon: ALIGN_ICONS[selectedZone.align] as React.ComponentProps<typeof Ionicons>['name'],
      onPress: () => onUpdateZone({ align: nextAlign }),
    },
    {
      label: 'Spacing',
      icon: 'git-commit-outline' as const,
      onPress: () => onUpdateZone({ letterSpacing: selectedZone.letterSpacing === 0 ? 2 : 0 }),
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
          contentContainerStyle={styles.rowContent}
        >
          {items.map((item) => (
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
                  color={item.destructive ? '#E53935' : item.active ? COLORS.white : COLORS.ink}
                />
              )}
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
      <BottomSheet visible={fontSheetOpen} onClose={() => setFontSheetOpen(false)} height={480}>
        <Text style={styles.sheetTitle}>Choose Font</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {(['Sans-serif', 'Serif', 'Script', 'Display'] as const).map((category) => (
            <React.Fragment key={category}>
              <Text style={styles.fontCategory}>{category}</Text>
              {FONT_OPTIONS.filter((f) => f.category === category).map((f) => (
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
            </React.Fragment>
          ))}
        </ScrollView>
      </BottomSheet>

      {/* Color picker */}
      <BottomSheet visible={colorSheetOpen} onClose={() => setColorSheetOpen(false)} height={300}>
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

        {/* Custom hex input */}
        <View style={styles.hexRow}>
          <View style={[styles.hexPreview, { backgroundColor: isValidHex(customColor) ? customColor : 'transparent' }]} />
          <TextInput
            style={styles.hexInput}
            value={customColor}
            onChangeText={(t) => setCustomColor(t.startsWith('#') ? t : `#${t}`)}
            placeholder="#RRGGBB"
            placeholderTextColor={COLORS.muted}
            maxLength={7}
            autoCorrect={false}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={[styles.hexApply, !isValidHex(customColor) && styles.hexApplyDisabled]}
            disabled={!isValidHex(customColor)}
            onPress={() => { onUpdateZone({ color: customColor }); setColorSheetOpen(false); setCustomColor(''); }}
          >
            <Text style={styles.hexApplyText}>Apply</Text>
          </TouchableOpacity>
        </View>
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
  rowContent: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
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
  fontCategory: {
    fontFamily: FONTS.semibold,
    fontSize: 11,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 4,
    paddingHorizontal: 4,
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
  hexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  hexPreview: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hexInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.ink,
  },
  hexApply: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  hexApplyDisabled: {
    backgroundColor: COLORS.border,
  },
  hexApplyText: {
    fontFamily: FONTS.semibold,
    fontSize: 13,
    color: COLORS.white,
  },
});
