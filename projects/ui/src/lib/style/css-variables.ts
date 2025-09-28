import type { Style } from '@ng-adm/core';

import {
  GAP_CATALOG,
  PADDING_CATALOG,
  PADDING_TOP_CATALOG,
  PADDING_RIGHT_CATALOG,
  PADDING_BOTTOM_CATALOG,
  PADDING_LEFT_CATALOG,
  FONT_SIZE_CATALOG,
  FONT_WEIGHT_CATALOG,
  LINE_HEIGHT_CATALOG,
  LETTER_SPACING_CATALOG,
  BORDER_WIDTH_CATALOG,
  BORDER_RADIUS_CATALOG,
  OPACITY_CATALOG,
  WIDTH_CATALOG,
  HEIGHT_CATALOG,
  MIN_WIDTH_CATALOG,
  MAX_WIDTH_CATALOG,
  MIN_HEIGHT_CATALOG,
  MAX_HEIGHT_CATALOG,
  FONT_FAMILY_CATALOG,
} from './style-tw.catalogs';

/**
 * CSS variable names for dynamic values
 */
export const CSS_VARIABLES = {
  // Spacing variables
  gap: '--gap',
  paddingTop: '--padding-top',
  paddingRight: '--padding-right',
  paddingBottom: '--padding-bottom',
  paddingLeft: '--padding-left',
  paddingX: '--padding-x',
  paddingY: '--padding-y',
  padding: '--padding',
  marginTop: '--margin-top',
  marginRight: '--margin-right',
  marginBottom: '--margin-bottom',
  marginLeft: '--margin-left',
  marginX: '--margin-x',
  marginY: '--margin-y',
  margin: '--margin',

  // Sizing variables
  width: '--width',
  height: '--height',
  minWidth: '--min-width',
  maxWidth: '--max-width',
  minHeight: '--min-height',
  maxHeight: '--max-height',

  // Typography variables
  fontSize: '--font-size',
  fontWeight: '--font-weight',
  lineHeight: '--line-height',
  letterSpacing: '--letter-spacing',
  fontFamily: '--font-family',

  // Visual variables
  backgroundColor: '--background-color',
  borderWidth: '--border-width',
  borderColor: '--border-color',
  borderRadius: '--border-radius',
  boxShadow: '--box-shadow',
  opacity: '--opacity',

  // Grid variables
  gridTemplateColumns: '--grid-template-columns',
} as const;

/**
 * CSS variable class mappings for Tailwind v4
 */
export const CSS_VARIABLE_CLASSES = {
  // Spacing classes with CSS variables
  gap: 'gap-[var(--gap)]',
  paddingTop: 'pt-[var(--padding-top)]',
  paddingRight: 'pr-[var(--padding-right)]',
  paddingBottom: 'pb-[var(--padding-bottom)]',
  paddingLeft: 'pl-[var(--padding-left)]',
  paddingX: 'px-[var(--padding-x)]',
  paddingY: 'py-[var(--padding-y)]',
  padding: 'p-[var(--padding)]',

  // Sizing classes with CSS variables
  width: 'w-[var(--width)]',
  height: 'h-[var(--height)]',
  minWidth: 'min-w-[var(--min-width)]',
  maxWidth: 'max-w-[var(--max-width)]',
  minHeight: 'min-h-[var(--min-height)]',
  maxHeight: 'max-h-[var(--max-height)]',

  // Typography classes with CSS variables
  fontSize: 'text-[var(--font-size)]',
  fontWeight: 'font-[var(--font-weight)]',
  lineHeight: 'leading-[var(--line-height)]',
  letterSpacing: 'tracking-[var(--letter-spacing)]',
  fontFamily: 'font-[var(--font-family)]',

  // Visual classes with CSS variables
  backgroundColor: 'bg-[var(--background-color)]',
  borderWidth: 'border-[var(--border-width)]',
  borderColor: 'border-[var(--border-color)]',
  borderRadius: 'rounded-[var(--border-radius)]',
  boxShadow: 'shadow-[var(--box-shadow)]',
  opacity: 'opacity-[var(--opacity)]',

  // Grid classes with CSS variables
  gridTemplateColumns: 'grid-cols-[var(--grid-template-columns)]',
} as const;

/**
 * Extracts CSS variables from a Style object for values NOT in catalogs
 */
export function extractCSSVariables(style: Style): Record<string, string> {
  const variables: Record<string, string> = {};

  // Gap - only extract if NOT in catalog
  if (style.gap != null) {
    const gapInCatalog = GAP_CATALOG[style.gap as keyof typeof GAP_CATALOG];
    if (!gapInCatalog) {
      variables[CSS_VARIABLES.gap] =
        typeof style.gap === 'number' ? `${style.gap}px` : String(style.gap);
    }
  }

  // Padding - only extract if NOT in catalog
  if (style.padding) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = style.padding as any;
    if (typeof p === 'object') {
      if (p.top != null) {
        const paddingTopInCatalog =
          PADDING_TOP_CATALOG[p.top as keyof typeof PADDING_TOP_CATALOG];
        if (!paddingTopInCatalog) {
          variables[CSS_VARIABLES.paddingTop] = `${p.top}px`;
        }
      }
      if (p.right != null) {
        const paddingRightInCatalog =
          PADDING_RIGHT_CATALOG[p.right as keyof typeof PADDING_RIGHT_CATALOG];
        if (!paddingRightInCatalog) {
          variables[CSS_VARIABLES.paddingRight] = `${p.right}px`;
        }
      }
      if (p.bottom != null) {
        const paddingBottomInCatalog =
          PADDING_BOTTOM_CATALOG[
            p.bottom as keyof typeof PADDING_BOTTOM_CATALOG
          ];
        if (!paddingBottomInCatalog) {
          variables[CSS_VARIABLES.paddingBottom] = `${p.bottom}px`;
        }
      }
      if (p.left != null) {
        const paddingLeftInCatalog =
          PADDING_LEFT_CATALOG[p.left as keyof typeof PADDING_LEFT_CATALOG];
        if (!paddingLeftInCatalog) {
          variables[CSS_VARIABLES.paddingLeft] = `${p.left}px`;
        }
      }
    } else if (typeof p === 'number') {
      const paddingInCatalog =
        PADDING_CATALOG[p as keyof typeof PADDING_CATALOG];
      if (!paddingInCatalog) {
        variables[CSS_VARIABLES.padding] = `${p}px`;
      }
    }
  }

  // Width/Height - only extract if NOT in catalog
  if (style.w != null) {
    const widthInCatalog = WIDTH_CATALOG[style.w as keyof typeof WIDTH_CATALOG];
    if (!widthInCatalog) {
      variables[CSS_VARIABLES.width] =
        typeof style.w === 'number' ? `${style.w}px` : String(style.w);
    }
  }
  if (style.h != null) {
    const heightInCatalog =
      HEIGHT_CATALOG[style.h as keyof typeof HEIGHT_CATALOG];
    if (!heightInCatalog) {
      variables[CSS_VARIABLES.height] =
        typeof style.h === 'number' ? `${style.h}px` : String(style.h);
    }
  }
  if (style.minW != null) {
    const minWidthInCatalog =
      MIN_WIDTH_CATALOG[style.minW as keyof typeof MIN_WIDTH_CATALOG];
    if (!minWidthInCatalog) {
      variables[CSS_VARIABLES.minWidth] =
        typeof style.minW === 'number' ? `${style.minW}px` : String(style.minW);
    }
  }
  if (style.maxW != null) {
    const maxWidthInCatalog =
      MAX_WIDTH_CATALOG[style.maxW as keyof typeof MAX_WIDTH_CATALOG];
    if (!maxWidthInCatalog) {
      variables[CSS_VARIABLES.maxWidth] =
        typeof style.maxW === 'number' ? `${style.maxW}px` : String(style.maxW);
    }
  }
  if (style.minH != null) {
    const minHeightInCatalog =
      MIN_HEIGHT_CATALOG[style.minH as keyof typeof MIN_HEIGHT_CATALOG];
    if (!minHeightInCatalog) {
      variables[CSS_VARIABLES.minHeight] =
        typeof style.minH === 'number' ? `${style.minH}px` : String(style.minH);
    }
  }
  if (style.maxH != null) {
    const maxHeightInCatalog =
      MAX_HEIGHT_CATALOG[style.maxH as keyof typeof MAX_HEIGHT_CATALOG];
    if (!maxHeightInCatalog) {
      variables[CSS_VARIABLES.maxHeight] =
        typeof style.maxH === 'number' ? `${style.maxH}px` : String(style.maxH);
    }
  }

  // Typography - only extract if NOT in catalog
  if (style.size != null) {
    const fontSizeInCatalog =
      FONT_SIZE_CATALOG[style.size as keyof typeof FONT_SIZE_CATALOG];
    if (!fontSizeInCatalog) {
      variables[CSS_VARIABLES.fontSize] =
        typeof style.size === 'number' ? `${style.size}px` : String(style.size);
    }
  }
  if (style.weight != null) {
    const fontWeightInCatalog =
      FONT_WEIGHT_CATALOG[style.weight as keyof typeof FONT_WEIGHT_CATALOG];
    if (!fontWeightInCatalog) {
      variables[CSS_VARIABLES.fontWeight] =
        typeof style.weight === 'number'
          ? String(style.weight)
          : String(style.weight);
    }
  }
  if (style.lineHeight != null) {
    const lineHeightInCatalog =
      LINE_HEIGHT_CATALOG[style.lineHeight as keyof typeof LINE_HEIGHT_CATALOG];
    if (!lineHeightInCatalog) {
      variables[CSS_VARIABLES.lineHeight] =
        typeof style.lineHeight === 'number'
          ? `${style.lineHeight}px`
          : String(style.lineHeight);
    }
  }
  if (style.letterSpacing != null) {
    const letterSpacingInCatalog =
      LETTER_SPACING_CATALOG[
        style.letterSpacing as unknown as keyof typeof LETTER_SPACING_CATALOG
      ];
    if (!letterSpacingInCatalog) {
      variables[CSS_VARIABLES.letterSpacing] =
        typeof style.letterSpacing === 'number'
          ? `${style.letterSpacing}px`
          : String(style.letterSpacing);
    }
  }
  if (style.font != null) {
    const fontFamilyInCatalog =
      FONT_FAMILY_CATALOG[
        String(style.font) as keyof typeof FONT_FAMILY_CATALOG
      ];
    if (!fontFamilyInCatalog) {
      variables[CSS_VARIABLES.fontFamily] = String(style.font);
    }
  }

  // Visual - only extract if NOT in catalog
  if (style.bg != null) {
    // Background colors are usually not in catalogs, so extract them
    variables[CSS_VARIABLES.backgroundColor] = String(style.bg);
  }
  if (style.border && typeof style.border === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const border = style.border as any;
    if (border.width != null) {
      const borderWidthInCatalog =
        BORDER_WIDTH_CATALOG[border.width as keyof typeof BORDER_WIDTH_CATALOG];
      if (!borderWidthInCatalog) {
        variables[CSS_VARIABLES.borderWidth] =
          typeof border.width === 'number'
            ? `${border.width}px`
            : String(border.width);
      }
    }
    if (border.color != null) {
      // Border colors are usually not in catalogs, so extract them
      variables[CSS_VARIABLES.borderColor] = String(border.color);
    }
  }
  if (style.radius != null) {
    const borderRadiusInCatalog =
      BORDER_RADIUS_CATALOG[style.radius as keyof typeof BORDER_RADIUS_CATALOG];
    if (!borderRadiusInCatalog) {
      variables[CSS_VARIABLES.borderRadius] =
        typeof style.radius === 'number'
          ? `${style.radius}px`
          : String(style.radius);
    }
  }
  if (style.shadow != null) {
    // Shadows are usually not in catalogs, so extract them
    variables[CSS_VARIABLES.boxShadow] = String(style.shadow);
  }
  if (style.opacity != null && typeof style.opacity === 'number') {
    const pct = Math.round(style.opacity * 100);
    const opacityInCatalog =
      OPACITY_CATALOG[pct as keyof typeof OPACITY_CATALOG];
    if (!opacityInCatalog) {
      variables[CSS_VARIABLES.opacity] = String(style.opacity);
    }
  }

  // Grid - only extract if NOT in catalog
  if (style.gridTemplateColumns != null) {
    // Grid template columns are usually not in catalogs, so extract them
    variables[CSS_VARIABLES.gridTemplateColumns] = String(
      style.gridTemplateColumns,
    );
  }

  return variables;
}

/**
 * Gets CSS variable class for a given property
 */
export function getCSSVariableClass(
  property: keyof typeof CSS_VARIABLE_CLASSES,
): string {
  return CSS_VARIABLE_CLASSES[property];
}

/**
 * Converts a Style object to inline CSS styles with CSS variables
 */
export function styleToCSSVariables(style: Style): Record<string, string> {
  return extractCSSVariables(style);
}

/**
 * Converts CSS variables to CSS custom properties format
 */
export function formatCSSVariables(
  variables: Record<string, string>,
): Record<string, string> {
  const formatted: Record<string, string> = {};
  for (const [key, value] of Object.entries(variables)) {
    formatted[key] = value;
  }
  return formatted;
}
