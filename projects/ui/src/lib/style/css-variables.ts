import type { Style } from '@ng-adm/core';

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
 * Extracts CSS variables from a Style object
 */
export function extractCSSVariables(style: Style): Record<string, string> {
  const variables: Record<string, string> = {};

  // Gap
  if (style.gap != null && typeof style.gap !== 'string') {
    variables[CSS_VARIABLES.gap] =
      typeof style.gap === 'number' ? `${style.gap}px` : String(style.gap);
  }

  // Padding
  if (style.padding) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = style.padding as any;
    if (typeof p === 'object') {
      if (p.top != null) variables[CSS_VARIABLES.paddingTop] = `${p.top}px`;
      if (p.right != null)
        variables[CSS_VARIABLES.paddingRight] = `${p.right}px`;
      if (p.bottom != null)
        variables[CSS_VARIABLES.paddingBottom] = `${p.bottom}px`;
      if (p.left != null) variables[CSS_VARIABLES.paddingLeft] = `${p.left}px`;
    } else if (typeof p === 'number') {
      variables[CSS_VARIABLES.padding] = `${p}px`;
    }
  }

  // Width/Height
  if (style.w != null && typeof style.w !== 'string') {
    variables[CSS_VARIABLES.width] =
      typeof style.w === 'number' ? `${style.w}px` : String(style.w);
  }
  if (style.h != null && typeof style.h !== 'string') {
    variables[CSS_VARIABLES.height] =
      typeof style.h === 'number' ? `${style.h}px` : String(style.h);
  }
  if (style.minW != null && typeof style.minW !== 'string') {
    variables[CSS_VARIABLES.minWidth] =
      typeof style.minW === 'number' ? `${style.minW}px` : String(style.minW);
  }
  if (style.maxW != null && typeof style.maxW !== 'string') {
    variables[CSS_VARIABLES.maxWidth] =
      typeof style.maxW === 'number' ? `${style.maxW}px` : String(style.maxW);
  }
  if (style.minH != null && typeof style.minH !== 'string') {
    variables[CSS_VARIABLES.minHeight] =
      typeof style.minH === 'number' ? `${style.minH}px` : String(style.minH);
  }
  if (style.maxH != null && typeof style.maxH !== 'string') {
    variables[CSS_VARIABLES.maxHeight] =
      typeof style.maxH === 'number' ? `${style.maxH}px` : String(style.maxH);
  }

  // Typography
  if (style.size != null && typeof style.size !== 'string') {
    variables[CSS_VARIABLES.fontSize] =
      typeof style.size === 'number' ? `${style.size}px` : String(style.size);
  }
  if (style.weight != null && typeof style.weight !== 'string') {
    variables[CSS_VARIABLES.fontWeight] =
      typeof style.weight === 'number'
        ? String(style.weight)
        : String(style.weight);
  }
  if (style.lineHeight != null && typeof style.lineHeight !== 'string') {
    variables[CSS_VARIABLES.lineHeight] =
      typeof style.lineHeight === 'number'
        ? `${style.lineHeight}px`
        : String(style.lineHeight);
  }
  if (style.letterSpacing != null && typeof style.letterSpacing !== 'string') {
    variables[CSS_VARIABLES.letterSpacing] =
      typeof style.letterSpacing === 'number'
        ? `${style.letterSpacing}px`
        : String(style.letterSpacing);
  }
  if (style.font != null && typeof style.font !== 'string') {
    variables[CSS_VARIABLES.fontFamily] = String(style.font);
  }

  // Visual
  if (style.bg != null && typeof style.bg !== 'string') {
    variables[CSS_VARIABLES.backgroundColor] = String(style.bg);
  }
  if (style.border && typeof style.border === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const border = style.border as any;
    if (border.width != null) {
      variables[CSS_VARIABLES.borderWidth] =
        typeof border.width === 'number'
          ? `${border.width}px`
          : String(border.width);
    }
    if (border.color != null) {
      variables[CSS_VARIABLES.borderColor] = String(border.color);
    }
  }
  if (style.radius != null && typeof style.radius !== 'string') {
    variables[CSS_VARIABLES.borderRadius] =
      typeof style.radius === 'number'
        ? `${style.radius}px`
        : String(style.radius);
  }
  if (style.shadow != null && typeof style.shadow !== 'string') {
    variables[CSS_VARIABLES.boxShadow] = String(style.shadow);
  }
  if (style.opacity != null && typeof style.opacity === 'number') {
    variables[CSS_VARIABLES.opacity] = String(style.opacity);
  }

  // Grid
  if (style.gridTemplateColumns != null) {
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
