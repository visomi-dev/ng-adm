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
import { resolveToken, twValueOrArbitrary } from './tokens-resolver';

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
      if (style.flexDirection) out.push(FLEX_DIR_MAP[style.flexDirection]);
      if (style.alignItems) out.push(ALIGN_ITEMS_MAP[style.alignItems]);
      if (style.justifyContent) out.push(JUSTIFY_MAP[style.justifyContent]);
      if (typeof style.wrap === 'boolean')
        out.push(WRAP_MAP[String(style.wrap) as 'true' | 'false']);
    }

    if (style.display === 'grid') {
      if (typeof style.columns === 'number' && style.columns > 0) {
        out.push(`grid-cols-${style.columns}`);
      }
      if (style.gridTemplateColumns) {
        out.push(`grid-cols-[${style.gridTemplateColumns}]`);
      }
    }

    return out;
  }

  /**
   * Maps spacing properties (gap, padding) to Tailwind CSS classes
   *
   * Optimizes padding by collapsing symmetric values into shorthand classes
   * (e.g., p-4 instead of pt-4 pr-4 pb-4 pl-4)
   *
   * @param style - Style object containing spacing properties
   * @returns Array of Tailwind CSS classes for spacing
   */
  private mapSpacing(style: Style): string[] {
    const out: string[] = [];

    if (style.gap != null) {
      const gap = twValueOrArbitrary('gap', style.gap, { allowZero: true });
      if (gap) out.push(gap);
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
        const c = twValueOrArbitrary('p', top, { allowZero: true });
        if (c) out.push(c);
      } else {
        const xSym = right != null && left === right;
        const ySym = top != null && bottom === top;

        if (xSym) {
          const c = twValueOrArbitrary('px', right, { allowZero: true });
          if (c) out.push(c);
        } else {
          if (top != null)
            out.push(twValueOrArbitrary('pt', top, { allowZero: true })!);
          if (right != null)
            out.push(twValueOrArbitrary('pr', right, { allowZero: true })!);
          if (bottom != null)
            out.push(twValueOrArbitrary('pb', bottom, { allowZero: true })!);
          if (left != null)
            out.push(twValueOrArbitrary('pl', left, { allowZero: true })!);
        }

        if (ySym) {
          const c = twValueOrArbitrary('py', top, { allowZero: true });
          if (c) out.push(c);
        }
      }
    }

    return out.filter(Boolean);
  }

  /**
   * Maps sizing properties to Tailwind CSS classes
   *
   * Handles width/height modes, dimensions, min/max constraints, and flex grow/shrink
   *
   * @param style - Style object containing sizing properties
   * @returns Array of Tailwind CSS classes for sizing
   */
  private mapSizing(style: Style): string[] {
    const out: string[] = [];

    if (style.widthMode) {
      const m = SIZE_MODE_MAP[style.widthMode];
      if (m?.w) out.push(m.w);
    }
    if (style.heightMode) {
      const m = SIZE_MODE_MAP[style.heightMode];
      if (m?.h) out.push(m.h);
    }

    const WH = [
      ['w', style.w],
      ['h', style.h],
      ['min-w', style.minW],
      ['max-w', style.maxW],
      ['min-h', style.minH],
      ['max-h', style.maxH],
    ] as const;

    for (const [base, val] of WH) {
      if (val != null) {
        const cls = twValueOrArbitrary(base, val, { allowZero: true });
        if (cls) out.push(cls);
      }
    }

    if (typeof style.grow === 'number')
      out.push(style.grow > 0 ? 'grow' : 'grow-0');
    if (typeof style.shrink === 'number')
      out.push(style.shrink === 0 ? 'shrink-0' : 'shrink');

    return out;
  }

  /**
   * Maps visual properties to Tailwind CSS classes
   *
   * Handles background colors, borders, border radius, shadows, and opacity.
   * Supports design tokens and arbitrary values.
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
        out.push(`bg-${token ? `[${token.value}]` : `[${style.bg}]`}`);
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
        out.push(
          width === 0
            ? 'border-0'
            : width === 1
              ? 'border'
              : `border-[${width}px]`,
        );
      } else if (typeof width === 'string') {
        out.push(`border-${width}`);
      } else {
        if (color || bs) out.push('border');
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
          out.push(`border-${c ? `[${c.value}]` : `[${color}]`}`);
        }
      }
    }

    if (style.radius != null) {
      const r = resolveToken(style.radius);
      if (r?.kind === 'tw') out.push(`rounded-${r.value}`);
      else if (typeof style.radius === 'number')
        out.push(`rounded-[${style.radius}px]`);
      else out.push(`rounded-[${r ? r.value : style.radius}]`);
    }

    if (style.shadow) {
      const s = resolveToken(style.shadow);
      if (s?.kind === 'tw') out.push(`shadow-${s.value}`);
      else out.push(`shadow-${s ? `[${s.value}]` : `[${style.shadow}]`}`);
    }

    if (typeof style.opacity === 'number') {
      const pct = Math.round(style.opacity * 100);
      out.push(pct % 5 === 0 ? `opacity-${pct}` : `opacity-[${style.opacity}]`);
    }

    return out;
  }

  /**
   * Maps typography properties to Tailwind CSS classes
   *
   * Handles text alignment, font families, font sizes, font weights,
   * line height, and letter spacing.
   *
   * @param style - Style object containing typography properties
   * @returns Array of Tailwind CSS classes for typography
   */
  private mapTypography(style: Style): string[] {
    const out: string[] = [];

    if (style.textAlign) out.push(TEXT_ALIGN_MAP[style.textAlign]);

    if (style.font) {
      const r = resolveToken(style.font);
      if (r?.kind === 'tw') out.push(`font-${r.value}`);
      else out.push(`font-${r ? `[${r.value}]` : `[${style.font}]`}`);
    }

    if (typeof style.size !== 'undefined') {
      const v =
        typeof style.size === 'number'
          ? `text-[${style.size}px]`
          : `text-[${style.size}]`;
      out.push(v);
    }

    if (typeof style.weight !== 'undefined') {
      const w =
        typeof style.weight === 'number'
          ? `font-[${style.weight}]`
          : `font-${style.weight}`;
      out.push(w);
    }

    if (typeof style.lineHeight !== 'undefined') {
      out.push(
        typeof style.lineHeight === 'number'
          ? `leading-[${style.lineHeight}px]`
          : `leading-[${style.lineHeight}]`,
      );
    }

    if (typeof style.letterSpacing !== 'undefined') {
      out.push(
        typeof style.letterSpacing === 'number'
          ? `tracking-[${style.letterSpacing}px]`
          : `tracking-[${style.letterSpacing}]`,
      );
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
  styleToClassList(style?: Style | null): string {
    if (!style) return '';

    return this.classesWithResponsive(style);
  }

  /**
   * Alias for styleToClassList for backward compatibility
   *
   * @param style - Style object to convert, or null/undefined for empty string
   * @returns Tailwind CSS class string
   */
  styleToClassString(style?: Style | null): string {
    return this.styleToClassList(style);
  }

  /**
   * Converts Style properties to inline CSS styles
   *
   * Currently returns an empty object as this implementation
   * prefers Tailwind utilities and arbitrary values over inline styles.
   *
   * @param _style - Style object (currently unused)
   * @returns Empty object (inline styles not implemented)
   */
  styleToInline(_style?: Style | null): Record<string, unknown> {
    return {};
  }
}
