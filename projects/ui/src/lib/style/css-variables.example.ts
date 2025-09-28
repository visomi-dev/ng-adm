/**
 * Example demonstrating the corrected CSS variables extraction
 *
 * This file shows how the styleToStyle method now correctly:
 * 1. Only extracts CSS variables for values NOT in catalogs
 * 2. Uses predefined classes for values that ARE in catalogs
 */

import type { Style } from '@ng-adm/core';

import { StyleTw } from './style-tw';

// Example 1: Values that ARE in catalogs (should NOT generate CSS variables)
const catalogValues: Style = {
  gap: 4, // In GAP_CATALOG → 'gap-4'
  padding: { top: 16, right: 16, bottom: 16, left: 16 }, // In PADDING_CATALOG → 'p-4'
  size: 16, // In FONT_SIZE_CATALOG → 'text-base'
  weight: 500, // In FONT_WEIGHT_CATALOG → 'font-medium'
  lineHeight: 1.5, // In LINE_HEIGHT_CATALOG → 'leading-snug'
  radius: 8, // In BORDER_RADIUS_CATALOG → 'rounded-lg'
  opacity: 0.8, // In OPACITY_CATALOG → 'opacity-80'
  w: 600, // In WIDTH_CATALOG → 'w-600'
  h: 400, // In HEIGHT_CATALOG → 'h-400'
};

// Example 2: Values that are NOT in catalogs (should generate CSS variables)
const dynamicValues: Style = {
  gap: 25, // NOT in GAP_CATALOG → CSS variable
  padding: { top: 13, right: 13, bottom: 13, left: 13 }, // NOT in PADDING_CATALOG → CSS variables
  size: 17, // NOT in FONT_SIZE_CATALOG → CSS variable
  weight: 550, // NOT in FONT_WEIGHT_CATALOG → CSS variable
  lineHeight: 1.3, // NOT in LINE_HEIGHT_CATALOG → CSS variable
  radius: 7, // NOT in BORDER_RADIUS_CATALOG → CSS variable
  opacity: 0.75, // NOT in OPACITY_CATALOG → CSS variable
  w: 650, // NOT in WIDTH_CATALOG → CSS variable
  h: 350, // NOT in HEIGHT_CATALOG → CSS variable
};

// Example 3: Mixed values (some in catalogs, some not)
const mixedValues: Style = {
  gap: 4, // In catalog → 'gap-4'
  // gap: 25, // NOT in catalog → CSS variable
  padding: { top: 16, right: 16, bottom: 16, left: 16 }, // In catalog → 'p-4'
  // padding: { top: 13, right: 13, bottom: 13, left: 13 }, // NOT in catalog → CSS variables
  size: 16, // In catalog → 'text-base'
  // size: 17, // NOT in catalog → CSS variable
  weight: 500, // In catalog → 'font-medium'
  // weight: 550, // NOT in catalog → CSS variable
};

/**
 * Usage example
 */
export class CSSVariablesExample {
  private styleTw = new StyleTw();

  getCatalogClasses(): string {
    // Returns: 'gap-4 p-4 text-base font-medium leading-snug rounded-lg opacity-80 w-600 h-400'
    return this.styleTw.styleToClass(catalogValues);
  }

  getCatalogCSSVariables(): Record<string, string> {
    // Returns: {} (empty object - no CSS variables needed)
    return this.styleTw.styleToStyle(catalogValues);
  }

  getDynamicClasses(): string {
    // Returns: 'gap-[var(--gap)] pt-[var(--padding-top)] pr-[var(--padding-right)] pb-[var(--padding-bottom)] pl-[var(--padding-left)] text-[var(--font-size)] font-[var(--font-weight)] leading-[var(--line-height)] rounded-[var(--border-radius)] opacity-[var(--opacity)] w-[var(--width)] h-[var(--height)]'
    return this.styleTw.styleToClass(dynamicValues);
  }

  getDynamicCSSVariables(): Record<string, string> {
    // Returns: {
    //   '--gap': '25px',
    //   '--padding-top': '13px',
    //   '--padding-right': '13px',
    //   '--padding-bottom': '13px',
    //   '--padding-left': '13px',
    //   '--font-size': '17px',
    //   '--font-weight': '550',
    //   '--line-height': '1.3px',
    //   '--border-radius': '7px',
    //   '--opacity': '0.75',
    //   '--width': '650px',
    //   '--height': '350px'
    // }
    return this.styleTw.styleToStyle(dynamicValues);
  }

  getMixedClasses(): string {
    // Returns: 'gap-4 p-4 text-base font-medium' (for catalog values)
    // + 'gap-[var(--gap)] pt-[var(--padding-top)] pr-[var(--padding-right)] pb-[var(--padding-bottom)] pl-[var(--padding-left)] text-[var(--font-size)] font-[var(--font-weight)]' (for dynamic values)
    return this.styleTw.styleToClass(mixedValues);
  }

  getMixedCSSVariables(): Record<string, string> {
    // Returns only CSS variables for values NOT in catalogs:
    // {
    //   '--gap': '25px',
    //   '--padding-top': '13px',
    //   '--padding-right': '13px',
    //   '--padding-bottom': '13px',
    //   '--padding-left': '13px',
    //   '--font-size': '17px',
    //   '--font-weight': '550'
    // }
    return this.styleTw.styleToStyle(mixedValues);
  }
}

/**
 * Before vs After comparison
 */
export const comparison = {
  before: {
    description: 'Bug: styleToStyle extracted CSS variables for ALL values',
    catalogValues: {
      gap: 4,
      size: 16,
      weight: 500,
    },
    result: {
      classes: 'gap-4 text-base font-medium',
      cssVariables: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '--gap': '4px', // ❌ WRONG: Should not extract (value is in catalog)
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '--font-size': '16px', // ❌ WRONG: Should not extract (value is in catalog)
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '--font-weight': '500', // ❌ WRONG: Should not extract (value is in catalog)
      },
    },
  },
  after: {
    description:
      'Fixed: styleToStyle only extracts CSS variables for values NOT in catalogs',
    catalogValues: {
      gap: 4,
      size: 16,
      weight: 500,
    },
    result: {
      classes: 'gap-4 text-base font-medium',
      cssVariables: {}, // ✅ CORRECT: No CSS variables needed (all values in catalogs)
    },
  },
  dynamicValues: {
    description: 'CSS variables are only extracted for values NOT in catalogs',
    dynamicValues: {
      gap: 25,
      size: 17,
      weight: 550,
    },
    result: {
      classes:
        'gap-[var(--gap)] text-[var(--font-size)] font-[var(--font-weight)]',
      cssVariables: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '--gap': '25px', // ✅ CORRECT: Extract (value NOT in catalog)
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '--font-size': '17px', // ✅ CORRECT: Extract (value NOT in catalog)
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '--font-weight': '550', // ✅ CORRECT: Extract (value NOT in catalog)
      },
    },
  },
};
