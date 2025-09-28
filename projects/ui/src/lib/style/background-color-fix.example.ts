/**
 * Example demonstrating the background color CSS variable fix
 *
 * This shows how the styleToStyle method now correctly extracts CSS variables
 * for background colors (strings like '#FDF7F8')
 */

import type { Style } from '@ng-adm/core';
import { StyleTw } from './style-tw';

// Example: Background color that should generate CSS variable
const styleWithBackground: Style = {
  bg: '#FDF7F8', // This is a string and should generate CSS variable
  display: 'flex',
  gap: 4, // This is in catalog, should NOT generate CSS variable
  padding: { top: 16, right: 16, bottom: 16, left: 16 }, // This is in catalog, should NOT generate CSS variable
};

/**
 * Usage example
 */
export class BackgroundColorExample {
  private styleTw = new StyleTw();

  getClasses(): string {
    // Returns: 'flex gap-4 p-4 bg-[var(--background-color)]'
    return this.styleTw.styleToClass(styleWithBackground);
  }

  getCSSVariables(): Record<string, string> {
    // Returns: { '--background-color': '#FDF7F8' }
    return this.styleTw.styleToStyle(styleWithBackground);
  }
}

/**
 * Before vs After comparison
 */
export const backgroundColorComparison = {
  before: {
    description:
      'Bug: styleToStyle did not extract CSS variables for string background colors',
    style: {
      bg: '#FDF7F8',
      gap: 4,
      padding: { top: 16, right: 16, bottom: 16, left: 16 },
    },
    result: {
      classes: 'flex gap-4 p-4 bg-[var(--background-color)]',
      cssVariables: {}, // ❌ WRONG: Should extract background color
    },
  },
  after: {
    description:
      'Fixed: styleToStyle now extracts CSS variables for all background colors',
    style: {
      bg: '#FDF7F8',
      gap: 4,
      padding: { top: 16, right: 16, bottom: 16, left: 16 },
    },
    result: {
      classes: 'flex gap-4 p-4 bg-[var(--background-color)]',
      cssVariables: {
        '--background-color': '#FDF7F8', // ✅ CORRECT: Now extracts background color
      },
    },
  },
};

/**
 * Test cases for different background color formats
 */
export const backgroundColorTestCases = [
  {
    name: 'Hex color',
    style: { bg: '#FDF7F8' },
    expectedCSSVar: '--background-color',
    expectedValue: '#FDF7F8',
  },
  {
    name: 'RGB color',
    style: { bg: 'rgb(253, 247, 248)' },
    expectedCSSVar: '--background-color',
    expectedValue: 'rgb(253, 247, 248)',
  },
  {
    name: 'RGBA color',
    style: { bg: 'rgba(253, 247, 248, 0.8)' },
    expectedCSSVar: '--background-color',
    expectedValue: 'rgba(253, 247, 248, 0.8)',
  },
  {
    name: 'Named color',
    style: { bg: 'white' },
    expectedCSSVar: '--background-color',
    expectedValue: 'white',
  },
  {
    name: 'CSS variable',
    style: { bg: 'var(--custom-color)' },
    expectedCSSVar: '--background-color',
    expectedValue: 'var(--custom-color)',
  },
];

/**
 * Mixed example with background color and other properties
 */
export const mixedStyleExample: Style = {
  bg: '#FDF7F8', // Should generate CSS variable
  display: 'flex',
  flexDirection: 'column',
  gap: 4, // In catalog, should NOT generate CSS variable
  padding: { top: 16, right: 16, bottom: 16, left: 16 }, // In catalog, should NOT generate CSS variable
  size: 16, // In catalog, should NOT generate CSS variable
  weight: 500, // In catalog, should NOT generate CSS variable
  radius: 8, // In catalog, should NOT generate CSS variable
  shadow: 'lg', // Should generate CSS variable (not in catalog)
  opacity: 0.8, // In catalog, should NOT generate CSS variable
};

export const mixedStyleResult = {
  classes:
    'flex flex-col gap-4 p-4 text-base font-medium rounded-lg opacity-80 bg-[var(--background-color)] shadow-[var(--box-shadow)]',
  cssVariables: {
    '--background-color': '#FDF7F8',
    '--box-shadow': 'lg',
  },
};
