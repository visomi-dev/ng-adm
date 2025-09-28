import { inject, Injectable } from '@angular/core';
import type { Style } from '@ng-adm/core';

import { Deps } from '../deps';

import {
  BP_PREFIX,
  DISPLAY_MAP,
  FLEX_DIR_MAP,
  ALIGN_ITEMS_MAP,
  JUSTIFY_MAP,
  WRAP_MAP,
  SIZE_MODE_MAP,
  BORDER_STYLE_MAP,
  TEXT_ALIGN_MAP,
} from './style-tw.maps';
import { resolveToken } from './tokens-resolver';
import {
  GAP_CATALOG,
  PADDING_CATALOG,
  PADDING_X_CATALOG,
  PADDING_Y_CATALOG,
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
  GRID_COLS_CATALOG,
  FONT_FAMILY_CATALOG,
} from './style-tw.catalogs';
import {
  getCSSVariableClass,
  styleToCSSVariables,
  formatCSSVariables,
} from './css-variables';

/**
 * Order of CSS class buckets for consistent output ordering
 */
const ORDER = [
  'display',
  'flex-grid',
  'gap-padding',
  'sizing',
  'visual',
  'typography',
  'grid',
  'misc',
] as const;

/**
 * CSS class bucket categories for organizing Tailwind utilities
 */
export type Bucket =
  | 'display'
  | 'flex-grid'
  | 'gap-padding'
  | 'sizing'
  | 'visual'
  | 'typography'
  | 'grid'
  | 'misc';

/**
 * Available Tailwind CSS breakpoints
 */
type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Extended Style type that supports responsive overrides
 */
type StyleWithOverrides = Style & {
  overrides?: Partial<Record<Exclude<Breakpoint, 'base'>, Partial<Style>>>;
};

/**
 * Angular service that converts Style objects to Tailwind CSS class strings.
 *
 * This service provides a bridge between design system Style objects and Tailwind CSS utilities,
 * handling responsive breakpoints, design tokens, and arbitrary values.
 *
 * @example
 * ```typescript
 * const styleTw = inject(StyleTw);
 *
 * const style = {
 *   display: 'flex',
 *   gap: 'token:space.4',
 *   padding: { top: 16, right: 16, bottom: 16, left: 16 }
 * };
 *
 * const classes = this.styleTw.styleToClassList(style);
 * // Returns: 'flex gap-4 p-4'
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class StyleTw {
  /**
   * Injected dependencies for utility functions
   */
  readonly deps = inject(Deps);

  /**
   * Joins CSS class arrays in the predefined order
   *
   * @param buckets - Object containing arrays of CSS classes organized by bucket
   * @returns Ordered array of CSS classes
   */
  private orderedJoin(buckets: Partial<Record<Bucket, string[]>>): string[] {
    const out: string[] = [];
    for (const key of ORDER) {
      const arr = buckets[key];
      if (arr?.length) out.push(...arr);
    }
    return out;
  }

  /**
   * Maps layout-related style properties to Tailwind CSS classes
   *
   * @param style - Style object containing layout properties
   * @returns Array of Tailwind CSS classes for layout
   */
  private mapLayout(style: Style): string[] {
    const out: string[] = [];
    if (style.display) out.push(DISPLAY_MAP[style.display] ?? 'flex');

    if (style.display === 'flex') {
      if (style.flexDirection) {
        out.push(FLEX_DIR_MAP[style.flexDirection]);
      }

      if (style.alignItems) {
        out.push(ALIGN_ITEMS_MAP[style.alignItems]);
      }

      if (style.justifyContent) {
        out.push(JUSTIFY_MAP[style.justifyContent]);
      }

      if (style.wrap) {
        out.push(WRAP_MAP[String(style.wrap) as 'true' | 'false']);
      }
    }

    if (style.display === 'grid') {
      if (typeof style.wrap === 'boolean') {
        out.push(WRAP_MAP[String(style.wrap) as 'true' | 'false']);
      }
    }

    if (style.display === 'grid') {
      if (typeof style.columns === 'number' && style.columns > 0) {
        const gridColsClass =
          GRID_COLS_CATALOG[style.columns as keyof typeof GRID_COLS_CATALOG] ??
          null;
        if (gridColsClass) {
          out.push(gridColsClass);
        } else {
          out.push(`grid-cols-[${style.columns}]`);
        }
      }

      if (style.gridTemplateColumns) {
        out.push(getCSSVariableClass('gridTemplateColumns'));
      }
    }

    return out;
  }

  /**
   * Maps spacing properties (gap, padding) to Tailwind CSS classes
   *
   * Uses predefined catalogs for common values and CSS variables for dynamic values.
   * Optimizes padding by collapsing symmetric values into shorthand classes.
   *
   * @param style - Style object containing spacing properties
   * @returns Array of Tailwind CSS classes for spacing
   */
  private mapSpacing(style: Style): string[] {
    const out: string[] = [];

    if (style.gap != null) {
      // Try catalog first, then CSS variable
      const gapClass =
        GAP_CATALOG[style.gap as keyof typeof GAP_CATALOG] ?? null;
      if (gapClass) {
        out.push(gapClass);
      } else {
        // Use CSS variable for dynamic values
        out.push(getCSSVariableClass('gap'));
      }
    }

    const p = style.padding;

    if (p) {
      const { top, right, bottom, left } = p as unknown as {
        top: number;
        right: number;
        bottom: number;
        left: number;
      };

      const allEq =
        top === right && right === bottom && bottom === left && top != null;

      if (allEq) {
        // All padding values are equal
        const pClass =
          PADDING_CATALOG[top as keyof typeof PADDING_CATALOG] ?? null;
        if (pClass) {
          out.push(pClass);
        } else {
          out.push(getCSSVariableClass('padding'));
        }
      } else {
        const xSym = right != null && left === right;
        const ySym = top != null && bottom === top;

        if (xSym) {
          // Horizontal padding is symmetric
          const pxClass =
            PADDING_X_CATALOG[right as keyof typeof PADDING_X_CATALOG] ?? null;
          if (pxClass) {
            out.push(pxClass);
          } else {
            out.push(getCSSVariableClass('paddingX'));
          }
        } else {
          // Individual padding values
          if (top != null) {
            const ptClass =
              PADDING_TOP_CATALOG[top as keyof typeof PADDING_TOP_CATALOG] ??
              null;
            if (ptClass) {
              out.push(ptClass);
            } else {
              out.push(getCSSVariableClass('paddingTop'));
            }
          }
          if (right != null) {
            const prClass =
              PADDING_RIGHT_CATALOG[
                right as keyof typeof PADDING_RIGHT_CATALOG
              ] ?? null;
            if (prClass) {
              out.push(prClass);
            } else {
              out.push(getCSSVariableClass('paddingRight'));
            }
          }
          if (bottom != null) {
            const pbClass =
              PADDING_BOTTOM_CATALOG[
                bottom as keyof typeof PADDING_BOTTOM_CATALOG
              ] ?? null;
            if (pbClass) {
              out.push(pbClass);
            } else {
              out.push(getCSSVariableClass('paddingBottom'));
            }
          }
          if (left != null) {
            const plClass =
              PADDING_LEFT_CATALOG[left as keyof typeof PADDING_LEFT_CATALOG] ??
              null;
            if (plClass) {
              out.push(plClass);
            } else {
              out.push(getCSSVariableClass('paddingLeft'));
            }
          }
        }

        if (ySym) {
          // Vertical padding is symmetric
          const pyClass =
            PADDING_Y_CATALOG[top as keyof typeof PADDING_Y_CATALOG] ?? null;
          if (pyClass) {
            out.push(pyClass);
          } else {
            out.push(getCSSVariableClass('paddingY'));
          }
        }
      }
    }

    return out.filter(Boolean);
  }

  /**
   * Maps sizing properties to Tailwind CSS classes
   *
   * Uses predefined catalogs for common values and CSS variables for dynamic values.
   * Handles width/height modes, dimensions, min/max constraints, and flex grow/shrink.
   *
   * @param style - Style object containing sizing properties
   * @returns Array of Tailwind CSS classes for sizing
   */
  private mapSizing(style: Style): string[] {
    const out: string[] = [];

    if (style.widthMode) {
      const m = SIZE_MODE_MAP[style.widthMode];

      if (m?.w) {
        out.push(m.w);
      }
    }

    if (style.heightMode) {
      const m = SIZE_MODE_MAP[style.heightMode];

      if (m?.h) {
        out.push(m.h);
      }
    }

    // Handle width/height with catalogs and CSS variables
    if (style.w != null) {
      const wClass =
        WIDTH_CATALOG[style.w as keyof typeof WIDTH_CATALOG] ?? null;
      if (wClass) {
        out.push(wClass);
      } else {
        out.push(getCSSVariableClass('width'));
      }
    }

    if (style.h != null) {
      const hClass =
        HEIGHT_CATALOG[style.h as keyof typeof HEIGHT_CATALOG] ?? null;
      if (hClass) {
        out.push(hClass);
      } else {
        out.push(getCSSVariableClass('height'));
      }
    }

    if (style.minW != null) {
      const minWClass =
        MIN_WIDTH_CATALOG[style.minW as keyof typeof MIN_WIDTH_CATALOG] ?? null;
      if (minWClass) {
        out.push(minWClass);
      } else {
        out.push(getCSSVariableClass('minWidth'));
      }
    }

    if (style.maxW != null) {
      const maxWClass =
        MAX_WIDTH_CATALOG[style.maxW as keyof typeof MAX_WIDTH_CATALOG] ?? null;
      if (maxWClass) {
        out.push(maxWClass);
      } else {
        out.push(getCSSVariableClass('maxWidth'));
      }
    }

    if (style.minH != null) {
      const minHClass =
        MIN_HEIGHT_CATALOG[style.minH as keyof typeof MIN_HEIGHT_CATALOG] ??
        null;
      if (minHClass) {
        out.push(minHClass);
      } else {
        out.push(getCSSVariableClass('minHeight'));
      }
    }

    if (style.maxH != null) {
      const maxHClass =
        MAX_HEIGHT_CATALOG[style.maxH as keyof typeof MAX_HEIGHT_CATALOG] ??
        null;
      if (maxHClass) {
        out.push(maxHClass);
      } else {
        out.push(getCSSVariableClass('maxHeight'));
      }
    }

    if (typeof style.grow === 'number') {
      out.push(style.grow > 0 ? 'grow' : 'grow-0');
    }

    if (typeof style.shrink === 'number') {
      out.push(style.shrink === 0 ? 'shrink-0' : 'shrink');
    }

    return out;
  }

  /**
   * Maps visual properties to Tailwind CSS classes
   *
   * Uses predefined catalogs for common values and CSS variables for dynamic values.
   * Handles background colors, borders, border radius, shadows, and opacity.
   *
   * @param style - Style object containing visual properties
   * @returns Array of Tailwind CSS classes for visual styling
   */
  private mapVisual(style: Style): string[] {
    const out: string[] = [];

    if (style.bg != null) {
      const token = resolveToken(style.bg);

      if (token?.kind === 'tw') {
        out.push(`bg-${token.value}`);
      } else {
        // Use CSS variable for dynamic background colors
        out.push(getCSSVariableClass('backgroundColor'));
      }
    }

    if (style.border) {
      const {
        width,
        style: bs,
        color,
      } = style.border as unknown as {
        width: number;
        style: string;
        color: string;
      };

      if (typeof width === 'number') {
        const borderWidthClass =
          BORDER_WIDTH_CATALOG[width as keyof typeof BORDER_WIDTH_CATALOG] ??
          null;
        if (borderWidthClass) {
          out.push(borderWidthClass);
        } else {
          out.push(getCSSVariableClass('borderWidth'));
        }
      } else if (typeof width === 'string') {
        out.push(`border-${width}`);
      } else {
        if (color || bs) {
          out.push('border');
        }
      }

      if (bs)
        out.push(
          BORDER_STYLE_MAP[bs as keyof typeof BORDER_STYLE_MAP] ??
            'border-solid',
        );

      if (color != null) {
        const c = resolveToken(color);

        if (c?.kind === 'tw') {
          out.push(`border-${c.value}`);
        } else {
          // Use CSS variable for dynamic border colors
          out.push(getCSSVariableClass('borderColor'));
        }
      }
    }

    if (style.radius != null) {
      const r = resolveToken(style.radius);
      if (r?.kind === 'tw') {
        out.push(`rounded-${r.value}`);
      } else if (typeof style.radius === 'number') {
        const radiusClass =
          BORDER_RADIUS_CATALOG[
            style.radius as keyof typeof BORDER_RADIUS_CATALOG
          ] ?? null;
        if (radiusClass) {
          out.push(radiusClass);
        } else {
          out.push(getCSSVariableClass('borderRadius'));
        }
      } else {
        out.push(`rounded-[${r ? r.value : style.radius}]`);
      }
    }

    if (style.shadow) {
      const s = resolveToken(style.shadow);
      if (s?.kind === 'tw') {
        out.push(`shadow-${s.value}`);
      } else {
        // Use CSS variable for dynamic shadows
        out.push(getCSSVariableClass('boxShadow'));
      }
    }

    if (typeof style.opacity === 'number') {
      const pct = Math.round(style.opacity * 100);
      const opacityClass =
        OPACITY_CATALOG[pct as keyof typeof OPACITY_CATALOG] ?? null;
      if (opacityClass) {
        out.push(opacityClass);
      } else {
        out.push(getCSSVariableClass('opacity'));
      }
    }

    return out;
  }

  /**
   * Maps typography properties to Tailwind CSS classes
   *
   * Uses predefined catalogs for common values and CSS variables for dynamic values.
   * Handles text alignment, font families, font sizes, font weights,
   * line height, and letter spacing.
   *
   * @param style - Style object containing typography properties
   * @returns Array of Tailwind CSS classes for typography
   */
  private mapTypography(style: Style): string[] {
    const out: string[] = [];

    if (style.textAlign) {
      out.push(TEXT_ALIGN_MAP[style.textAlign]);
    }

    if (style.font) {
      const r = resolveToken(style.font);
      if (r?.kind === 'tw') {
        out.push(`font-${r.value}`);
      } else {
        const fontFamilyClass =
          FONT_FAMILY_CATALOG[
            String(style.font) as keyof typeof FONT_FAMILY_CATALOG
          ] ?? null;
        if (fontFamilyClass) {
          out.push(fontFamilyClass);
        } else {
          out.push(getCSSVariableClass('fontFamily'));
        }
      }
    }

    if (typeof style.size !== 'undefined') {
      if (typeof style.size === 'number') {
        const fontSizeClass =
          FONT_SIZE_CATALOG[style.size as keyof typeof FONT_SIZE_CATALOG] ??
          null;
        if (fontSizeClass) {
          out.push(fontSizeClass);
        } else {
          out.push(getCSSVariableClass('fontSize'));
        }
      } else {
        out.push(`text-[${style.size}]`);
      }
    }

    if (typeof style.weight !== 'undefined') {
      if (typeof style.weight === 'number') {
        const fontWeightClass =
          FONT_WEIGHT_CATALOG[
            style.weight as keyof typeof FONT_WEIGHT_CATALOG
          ] ?? null;
        if (fontWeightClass) {
          out.push(fontWeightClass);
        } else {
          out.push(getCSSVariableClass('fontWeight'));
        }
      } else {
        out.push(`font-${style.weight}`);
      }
    }

    if (typeof style.lineHeight !== 'undefined') {
      if (typeof style.lineHeight === 'number') {
        const lineHeightClass =
          LINE_HEIGHT_CATALOG[
            style.lineHeight as keyof typeof LINE_HEIGHT_CATALOG
          ] ?? null;
        if (lineHeightClass) {
          out.push(lineHeightClass);
        } else {
          out.push(getCSSVariableClass('lineHeight'));
        }
      } else {
        out.push(`leading-[${style.lineHeight}]`);
      }
    }

    if (typeof style.letterSpacing !== 'undefined') {
      if (typeof style.letterSpacing === 'string') {
        const letterSpacingClass =
          LETTER_SPACING_CATALOG[
            style.letterSpacing as keyof typeof LETTER_SPACING_CATALOG
          ] ?? null;
        if (letterSpacingClass) {
          out.push(letterSpacingClass);
        } else {
          out.push(getCSSVariableClass('letterSpacing'));
        }
      } else {
        out.push(`tracking-[${style.letterSpacing}px]`);
      }
    }

    return out;
  }

  /**
   * Maps grid-specific properties to Tailwind CSS classes
   *
   * Grid properties are handled in mapLayout when display is 'grid'.
   * This method is kept for future grid-specific properties.
   *
   * @param _style - Style object (currently unused)
   * @returns Empty array (grid properties handled elsewhere)
   */
  private mapGrid(_style: Style): string[] {
    return [];
  }

  /**
   * Generates base CSS classes for a Style object grouped by buckets
   *
   * @param style - Style object to convert
   * @returns Object containing arrays of CSS classes organized by bucket
   */
  private classesFor(style: Style) {
    return {
      display: this.mapLayout(style),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'gap-padding': this.mapSpacing(style),
      sizing: this.mapSizing(style),
      visual: this.mapVisual(style),
      typography: this.mapTypography(style),
      grid: this.mapGrid(style),
    } as const;
  }

  /**
   * Generates CSS classes with responsive breakpoint support
   *
   * Processes base styles and responsive overrides, applying appropriate
   * breakpoint prefixes to create a complete class string.
   *
   * @param style - Style object with optional responsive overrides
   * @returns Complete CSS class string with responsive prefixes
   */
  private classesWithResponsive(style: Style): string {
    const cls = this.deps.cls();

    const base = this.classesFor(style);
    const resultBase = this.orderedJoin(base);

    const out: string[] = [...resultBase];

    const overrides = (style as unknown as StyleWithOverrides).overrides as
      | Partial<Record<Breakpoint, Partial<Style>>>
      | undefined;

    if (!overrides) return cls(out);

    for (const bp of ['sm', 'md', 'lg', 'xl'] as const) {
      const ov = overrides[bp];

      if (!ov) continue;

      const pref = BP_PREFIX[bp];

      const cls = this.classesFor(ov as Style);
      const joined = this.orderedJoin(cls).map((c) => `${pref}${c}`);

      out.push(...joined);
    }

    return cls(out);
  }

  /**
   * Converts a Style object to a Tailwind CSS class string
   *
   * This is the main public API method for converting design system
   * Style objects to Tailwind CSS classes with responsive support.
   *
   * @param style - Style object to convert, or null/undefined for empty string
   * @returns Tailwind CSS class string
   *
   * @example
   * ```typescript
   * const style = {
   *   display: 'flex',
   *   gap: 'token:space.4',
   *   padding: { top: 16, right: 16, bottom: 16, left: 16 },
   *   overrides: {
   *     sm: { gap: 'token:space.2' }
   *   }
   * };
   *
   * const classes = styleTw.styleToClassList(style);
   * // Returns: 'flex gap-4 p-4 sm:gap-2'
   * ```
   */
  styleToClass(style?: Style | null): string {
    if (!style) {
      return '';
    }

    return this.classesWithResponsive(style);
  }

  /**
   * Converts Style properties to inline CSS styles with CSS variables
   *
   * This method extracts dynamic values from the Style object and converts them
   * to CSS custom properties that can be used with Tailwind v4's CSS variable classes.
   *
   * @param style - Style object to convert
   * @returns Object containing CSS custom properties
   *
   * @example
   * ```typescript
   * const style = {
   *   gap: 24,
   *   padding: { top: 16, right: 16, bottom: 16, left: 16 },
   *   size: 18,
   *   lineHeight: 1.5
   * };
   *
   * const cssVars = styleTw.styleToStyle(style);
   * // Returns: {
   * //   '--gap': '24px',
   * //   '--padding-top': '16px',
   * //   '--padding-right': '16px',
   * //   '--padding-bottom': '16px',
   * //   '--padding-left': '16px',
   * //   '--font-size': '18px',
   * //   '--line-height': '1.5px'
   * // }
   * ```
   */
  styleToStyle(style?: Style | null): Record<string, string> {
    if (!style) {
      return {};
    }

    return formatCSSVariables(styleToCSSVariables(style));
  }

  /**
   * Converts Style properties to inline CSS styles
   *
   * @deprecated Use styleToStyle() instead for CSS variables support
   * @param _style - Style object (currently unused)
   * @returns Empty object (inline styles not implemented)
   */
  styleToInline(_style?: Style | null): Record<string, unknown> {
    return {};
  }
}
