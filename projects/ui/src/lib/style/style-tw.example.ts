/**
 * Example usage of the refactored StyleTw service for Tailwind v4 compatibility
 *
 * This file demonstrates how to use the new catalog-based approach and CSS variables
 * instead of dynamic class generation.
 */

import type { Style } from '@ng-adm/core';

import { StyleTw } from './style-tw';

// Example 1: Using predefined catalog values
const catalogExample: Style = {
  display: 'flex',
  gap: 4, // Uses catalog: gap-4
  padding: { top: 16, right: 16, bottom: 16, left: 16 }, // Uses catalog: p-4
  size: 16, // Uses catalog: text-base
  weight: 500, // Uses catalog: font-medium
  lineHeight: 1.5, // Uses catalog: leading-snug
  radius: 8, // Uses catalog: rounded-lg
  opacity: 0.8, // Uses catalog: opacity-80
};

// Example 2: Using CSS variables for dynamic values
const dynamicExample: Style = {
  display: 'flex',
  gap: 25, // Not in catalog, uses CSS variable: gap-[var(--gap)]
  padding: { top: 13, right: 13, bottom: 13, left: 13 }, // Not in catalog, uses CSS variables
  size: 17, // Not in catalog, uses CSS variable: text-[var(--font-size)]
  weight: 550, // Not in catalog, uses CSS variable: font-[var(--font-weight)]
  lineHeight: 1.3, // Not in catalog, uses CSS variable: leading-[var(--line-height)]
  radius: 7, // Not in catalog, uses CSS variable: rounded-[var(--border-radius)]
  opacity: 0.75, // Not in catalog, uses CSS variable: opacity-[var(--opacity)]
};

// Example 3: Mixed usage (catalog + CSS variables)
const mixedExample: Style = {
  display: 'flex',
  gap: 4, // Catalog: gap-4
  padding: { top: 16, right: 16, bottom: 16, left: 16 }, // Catalog: p-4
  size: 19, // CSS variable: text-[var(--font-size)]
  weight: 600, // Catalog: font-semibold
  lineHeight: 1.4, // CSS variable: leading-[var(--line-height)]
  radius: 8, // Catalog: rounded-lg
  opacity: 0.9, // Catalog: opacity-90
};

/**
 * Usage example in a component
 */
export class ExampleComponent {
  private styleTw = new StyleTw();

  getCatalogClasses(): string {
    // Returns: 'flex gap-4 p-4 text-base font-medium leading-snug rounded-lg opacity-80'
    return this.styleTw.styleToClass(catalogExample);
  }

  getDynamicClasses(): string {
    // Returns: 'flex gap-[var(--gap)] pt-[var(--padding-top)] pr-[var(--padding-right)] pb-[var(--padding-bottom)] pl-[var(--padding-left)] text-[var(--font-size)] font-[var(--font-weight)] leading-[var(--line-height)] rounded-[var(--border-radius)] opacity-[var(--opacity)]'
    return this.styleTw.styleToClass(dynamicExample);
  }

  getMixedClasses(): string {
    // Returns: 'flex gap-4 p-4 text-[var(--font-size)] font-semibold leading-[var(--line-height)] rounded-lg opacity-90'
    return this.styleTw.styleToClass(mixedExample);
  }

  getCSSVariables(): Record<string, string> {
    // Returns CSS custom properties for dynamic values
    return this.styleTw.styleToStyle(dynamicExample);
    // Example output:
    // {
    //   '--gap': '25px',
    //   '--padding-top': '13px',
    //   '--padding-right': '13px',
    //   '--padding-bottom': '13px',
    //   '--padding-left': '13px',
    //   '--font-size': '17px',
    //   '--font-weight': '550',
    //   '--line-height': '1.3px',
    //   '--border-radius': '7px',
    //   '--opacity': '0.75'
    // }
  }

  /**
   * Example of how to use in a template with Angular
   */
  getTemplateUsage() {
    const classes = this.styleTw.styleToClass(mixedExample);
    const cssVars = this.styleTw.styleToStyle(mixedExample);

    return {
      // In template: [class]="classes" [style]="cssVars"
      classes,
      cssVars: this.formatCSSVars(cssVars),
    };
  }

  private formatCSSVars(vars: Record<string, string>): Record<string, string> {
    // Convert CSS variables to Angular style format
    const formatted: Record<string, string> = {};
    for (const [key, value] of Object.entries(vars)) {
      formatted[key] = value;
    }
    return formatted;
  }
}

/**
 * Responsive example with overrides
 */
export const responsiveExample: Style = {
  display: 'flex',
  gap: 4, // Base: gap-4
  padding: { top: 16, right: 16, bottom: 16, left: 16 }, // Base: p-4
  size: 16, // Base: text-base
  overrides: {
    sm: {
      gap: 2, // sm:gap-2
      padding: { top: 8, right: 8, bottom: 8, left: 8 }, // sm:p-2
      size: 14, // sm:text-sm
    },
    lg: {
      gap: 6, // lg:gap-6
      padding: { top: 24, right: 24, bottom: 24, left: 24 }, // lg:p-6
      size: 18, // lg:text-lg
    },
    md: undefined,
    xl: undefined,
  },
};

/**
 * Grid example
 */
export const gridExample: Style = {
  display: 'grid',
  columns: 3, // Uses catalog: grid-cols-3
  gap: 4, // Uses catalog: gap-4
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Uses CSS variable
};

/**
 * Border example
 */
export const borderExample: Style = {
  border: {
    width: 1, // Uses catalog: border
    style: 'solid', // Uses catalog: border-solid
    color: 'gray-300', // Uses catalog: border-gray-300
  },
  radius: 8, // Uses catalog: rounded-lg
};

/**
 * Background color example
 */
export const backgroundExample: Style = {
  bg: 'blue-500', // Uses catalog: bg-blue-500
  opacity: 0.8, // Uses catalog: opacity-80
};
