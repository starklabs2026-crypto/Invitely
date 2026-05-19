import { BUNDLED_FONTS, FONT_CATEGORIES, CATEGORY_DEFAULTS, type BundledFont } from '../config';

const FONT_SET = new Set<string>(BUNDLED_FONTS);

/**
 * Validates that the font GPT-4o chose is actually in our bundle.
 * If not, falls back to the most similar category default.
 */
export function resolveFont(fontFamily: string): BundledFont {
  if (FONT_SET.has(fontFamily)) return fontFamily as BundledFont;

  // Try to infer category from the name
  const lower = fontFamily.toLowerCase();
  if (lower.includes('cinzel') || lower.includes('bodoni') || lower.includes('prata')) {
    return CATEGORY_DEFAULTS['formal_serif'];
  }
  if (lower.includes('cormorant') || lower.includes('garamond') || lower.includes('lora')) {
    return CATEGORY_DEFAULTS['elegant_serif'];
  }
  if (lower.includes('pinyon') || lower.includes('vibes') || lower.includes('sacramento') || lower.includes('allura')) {
    return CATEGORY_DEFAULTS['formal_script'];
  }
  if (lower.includes('dancing') || lower.includes('caveat') || lower.includes('kaushan')) {
    return CATEGORY_DEFAULTS['casual_script'];
  }
  if (lower.includes('montserrat') || lower.includes('raleway') || lower.includes('josefin') || lower.includes('oswald') || lower.includes('bebas')) {
    return CATEGORY_DEFAULTS['sans_modern'];
  }
  if (lower.includes('rye') || lower.includes('bangers') || lower.includes('amatic') || lower.includes('permanent')) {
    return CATEGORY_DEFAULTS['decorative'];
  }

  // Generic fallback based on whether it sounds serif, script, or sans
  if (lower.includes('script') || lower.includes('vibes') || lower.includes('cursive')) {
    return 'GreatVibes_400Regular';
  }
  if (lower.includes('serif') || lower.includes('roman') || lower.includes('italic')) {
    return 'CormorantGaramond_400Regular';
  }

  console.warn(`    ⚠ Unknown font "${fontFamily}", falling back to Montserrat_400Regular`);
  return 'Montserrat_400Regular';
}

export { FONT_CATEGORIES };
