/**
 * Example demonstrating the fix for string values in CSS variables
 *
 * This shows how the styleToStyle method now correctly extracts CSS variables
 * for string values like '100vh', '100%', 'auto', etc. that are NOT in catalogs
 */

import type { Style } from '@ng-adm/core';
import { StyleTw } from './style-tw';

// Example: String values that should generate CSS variables
const styleWithStringValues: Style = {
  bg: '#FDF7F8', // String color - should generate CSS variable
  minH: '100vh', // String height - should generate CSS variable
  w: '100%', // String width - should generate CSS variable
  h: 'auto', // String height - should generate CSS variable
  gap: 4, // Number in catalog - should NOT generate CSS variable
  padding: { top: 16, right: 16, bottom: 16, left: 16 }, // In catalog - should NOT generate CSS variable
  size: 16, // Number in catalog - should NOT generate CSS variable
  weight: 500, // Number in catalog - should NOT generate CSS variable
  radius: 8, // Number in catalog - should NOT generate CSS variable
  opacity: 0.8, // Number in catalog - should NOT generate CSS variable
};

/**
 * Usage example
 */
export class StringValuesExample {
  private styleTw = new StyleTw();

  getClasses(): string {
    // Returns: 'gap-4 p-4 text-base font-medium rounded-lg opacity-80 bg-[var(--background-color)] min-h-[var(--min-height)] w-[var(--width)] h-[var(--height)]'
    return this.styleTw.styleToClass(styleWithStringValues);
  }

  getCSSVariables(): Record<string, string> {
    // Returns: {
    //   '--background-color': '#FDF7F8',
    //   '--min-height': '100vh',
    //   '--width': '100%',
    //   '--height': 'auto'
    // }
    return this.styleTw.styleToStyle(styleWithStringValues);
  }
}

/**
 * Test cases for different string value types
 */
export const stringValueTestCases = [
  {
    name: 'Viewport height',
    style: { minH: '100vh' },
    expectedCSSVar: '--min-height',
    expectedValue: '100vh',
  },
  {
    name: 'Percentage width',
    style: { w: '100%' },
    expectedCSSVar: '--width',
    expectedValue: '100%',
  },
  {
    name: 'Auto height',
    style: { h: 'auto' },
    expectedCSSVar: '--height',
    expectedValue: 'auto',
  },
  {
    name: 'Custom gap',
    style: { gap: '2rem' },
    expectedCSSVar: '--gap',
    expectedValue: '2rem',
  },
  {
    name: 'Custom font size',
    style: { size: '1.2rem' },
    expectedCSSVar: '--font-size',
    expectedValue: '1.2rem',
  },
  {
    name: 'Custom line height',
    style: { lineHeight: '1.8' },
    expectedCSSVar: '--line-height',
    expectedValue: '1.8',
  },
  {
    name: 'Custom border radius',
    style: { radius: '12px' },
    expectedCSSVar: '--border-radius',
    expectedValue: '12px',
  },
  {
    name: 'Custom font weight',
    style: { weight: '450' },
    expectedCSSVar: '--font-weight',
    expectedValue: '450',
  },
];

/**
 * Before vs After comparison
 */
export const stringValuesComparison = {
  before: {
    description:
      'Bug: styleToStyle did not extract CSS variables for string values',
    style: {
      minH: '100vh',
      w: '100%',
      h: 'auto',
      gap: 4,
      size: 16,
    },
    result: {
      classes:
        'gap-4 text-base min-h-[var(--min-height)] w-[var(--width)] h-[var(--height)]',
      cssVariables: {}, // ❌ WRONG: Should extract string values
    },
  },
  after: {
    description:
      'Fixed: styleToStyle now extracts CSS variables for string values not in catalogs',
    style: {
      minH: '100vh',
      w: '100%',
      h: 'auto',
      gap: 4,
      size: 16,
    },
    result: {
      classes:
        'gap-4 text-base min-h-[var(--min-height)] w-[var(--width)] h-[var(--height)]',
      cssVariables: {
        '--min-height': '100vh', // ✅ CORRECT: Now extracts string values
        '--width': '100%', // ✅ CORRECT: Now extracts string values
        '--height': 'auto', // ✅ CORRECT: Now extracts string values
      },
    },
  },
};

/**
 * Mixed example with both catalog and non-catalog values
 */
export const mixedStringExample: Style = {
  // String values (should generate CSS variables)
  bg: '#FDF7F8',
  minH: '100vh',
  w: '100%',
  h: 'auto',
  gap: '2rem',
  size: '1.2rem',
  weight: '450',
  lineHeight: '1.8',
  radius: '12px',

  // Catalog values (should NOT generate CSS variables)
  padding: { top: 16, right: 16, bottom: 16, left: 16 },
  opacity: 0.8,
};

export const mixedStringResult = {
  classes:
    'p-4 opacity-80 bg-[var(--background-color)] min-h-[var(--min-height)] w-[var(--width)] h-[var(--height)] gap-[var(--gap)] text-[var(--font-size)] font-[var(--font-weight)] leading-[var(--line-height)] rounded-[var(--border-radius)]',
  cssVariables: {
    '--background-color': '#FDF7F8',
    '--min-height': '100vh',
    '--width': '100%',
    '--height': 'auto',
    '--gap': '2rem',
    '--font-size': '1.2rem',
    '--font-weight': '450',
    '--line-height': '1.8',
    '--border-radius': '12px',
  },
};
