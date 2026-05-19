// All fonts bundled in the Invitely app (from useEditorFonts.ts)
// Grouped by visual category so the analyzer prompt can guide GPT-4o

export const BUNDLED_FONTS = [
  // Formal serif display
  'Cinzel_400Regular', 'Cinzel_700Bold',
  'BodoniModa_400Regular', 'BodoniModa_700Bold',
  'Prata_400Regular',

  // Elegant serif text
  'CormorantGaramond_400Regular', 'CormorantGaramond_700Bold',
  'CormorantSC_400Regular', 'CormorantSC_700Bold',
  'Lora_400Regular', 'Lora_700Bold',
  'EBGaramond_400Regular',

  // Formal script / calligraphy
  'PinyonScript_400Regular', 'GreatVibes_400Regular',
  'Sacramento_400Regular', 'Allura_400Regular', 'AlexBrush_400Regular',

  // Casual script / handwritten
  'DancingScript_400Regular', 'DancingScript_700Bold',
  'Caveat_400Regular', 'Caveat_700Bold',
  'KaushanScript_400Regular',

  // Clean sans-serif modern
  'Montserrat_400Regular', 'Montserrat_700Bold',
  'Raleway_400Regular', 'Raleway_700Bold',
  'JosefinSans_400Regular', 'JosefinSans_700Bold',
  'Oswald_400Regular', 'Oswald_700Bold',
  'BebasNeue_400Regular',

  // Decorative / display / fun
  'Rye_400Regular', 'Bangers_400Regular',
  'Ultra_400Regular', 'BungeeInline_400Regular',
  'AmaticSC_400Regular', 'AmaticSC_700Bold',
  'PermanentMarker_400Regular', 'PatrickHand_400Regular',

  // Specialty
  'Spirax_400Regular',
] as const;

export type BundledFont = typeof BUNDLED_FONTS[number];

export const FONT_CATEGORIES: Record<string, BundledFont[]> = {
  formal_serif:     ['Cinzel_400Regular', 'Cinzel_700Bold', 'BodoniModa_400Regular', 'BodoniModa_700Bold', 'Prata_400Regular'],
  elegant_serif:    ['CormorantGaramond_400Regular', 'CormorantGaramond_700Bold', 'CormorantSC_400Regular', 'CormorantSC_700Bold', 'Lora_400Regular', 'Lora_700Bold', 'EBGaramond_400Regular'],
  formal_script:    ['PinyonScript_400Regular', 'GreatVibes_400Regular', 'Sacramento_400Regular', 'Allura_400Regular', 'AlexBrush_400Regular'],
  casual_script:    ['DancingScript_400Regular', 'DancingScript_700Bold', 'Caveat_400Regular', 'Caveat_700Bold', 'KaushanScript_400Regular'],
  sans_modern:      ['Montserrat_400Regular', 'Montserrat_700Bold', 'Raleway_400Regular', 'Raleway_700Bold', 'JosefinSans_400Regular', 'JosefinSans_700Bold', 'Oswald_400Regular', 'Oswald_700Bold', 'BebasNeue_400Regular'],
  decorative:       ['Rye_400Regular', 'Bangers_400Regular', 'Ultra_400Regular', 'BungeeInline_400Regular', 'AmaticSC_400Regular', 'AmaticSC_700Bold', 'PermanentMarker_400Regular', 'PatrickHand_400Regular'],
  specialty:        ['Spirax_400Regular'],
};

// Category fallbacks — if GPT picks a font not in our list, use this default
export const CATEGORY_DEFAULTS: Record<string, BundledFont> = {
  formal_serif:  'Cinzel_700Bold',
  elegant_serif: 'CormorantGaramond_400Regular',
  formal_script: 'GreatVibes_400Regular',
  casual_script: 'DancingScript_400Regular',
  sans_modern:   'Montserrat_400Regular',
  decorative:    'Rye_400Regular',
  specialty:     'Spirax_400Regular',
};
