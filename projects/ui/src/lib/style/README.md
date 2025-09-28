# StyleTw Refactoring for Tailwind v4 Compatibility

This document describes the refactoring of the `StyleTw` service to be compatible with Tailwind CSS v4, which no longer supports JIT (Just-In-Time) compilation and dynamic class generation.

## Overview

The refactoring replaces dynamic class generation (e.g., `leading-[${style.lineHeight}]`) with:

1. **Predefined class catalogs** for common values
2. **CSS variables** for dynamic values that don't match catalog entries

## Key Changes

### 1. New Files Created

- **`style-tw.catalogs.ts`**: Contains predefined mappings for common Tailwind values
- **`css-variables.ts`**: Handles CSS variable generation and management
- **`style-tw.example.ts`**: Usage examples and documentation

### 2. Modified Files

- **`style-tw.ts`**: Refactored to use catalogs and CSS variables instead of dynamic generation

## How It Works

### Catalog-Based Approach

For common values, the service now uses predefined catalogs:

```typescript
// Before (Tailwind v3 JIT)
const classes = `leading-[${style.lineHeight}px]`;

// After (Tailwind v4)
const lineHeightClass = getLineHeightClass(style.lineHeight);
if (lineHeightClass) {
  // Use predefined class: leading-snug, leading-normal, etc.
  classes.push(lineHeightClass);
} else {
  // Use CSS variable for dynamic values
  classes.push('leading-[var(--line-height)]');
}
```

### CSS Variables for Dynamic Values

When a value doesn't match any catalog entry, the service generates CSS variables:

```typescript
// For dynamic values like lineHeight: 1.3
const cssVars = {
  '--line-height': '1.3px',
};

// The class becomes: leading-[var(--line-height)]
```

## Available Catalogs

### Spacing Catalog

- Values: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96
- Used for: gap, padding, margin

### Font Size Catalog

- Values: 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96, 128
- Maps to: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl, 8xl, 9xl

### Font Weight Catalog

- Values: 100, 200, 300, 400, 500, 600, 700, 800, 900
- Maps to: thin, extralight, light, normal, medium, semibold, bold, extrabold, black

### Line Height Catalog

- Values: 1, 1.25, 1.5, 1.625, 1.75, 2, 3, 4, 5, 6, 7, 8, 9, 10
- Maps to: none, tight, snug, normal, relaxed, loose, 3, 4, 5, 6, 7, 8, 9, 10

### Border Radius Catalog

- Values: 0, 2, 4, 6, 8, 12, 16, 24, 9999
- Maps to: none, sm, (default), md, lg, xl, 2xl, 3xl, full

### Opacity Catalog

- Values: 0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100
- Maps to: opacity-0, opacity-5, opacity-10, etc.

## New API Methods

### `styleToStyle(style?: Style | null): Record<string, string>`

Returns CSS custom properties for dynamic values:

```typescript
const style = { gap: 25, size: 17, lineHeight: 1.3 };
const cssVars = styleTw.styleToStyle(style);
// Returns: {
//   '--gap': '25px',
//   '--font-size': '17px',
//   '--line-height': '1.3px'
// }
```

## Usage Examples

### Basic Usage

```typescript
const styleTw = inject(StyleTw);

const style: Style = {
  display: 'flex',
  gap: 4, // Uses catalog: gap-4
  padding: { top: 16, right: 16, bottom: 16, left: 16 }, // Uses catalog: p-4
  size: 16, // Uses catalog: text-base
  weight: 500, // Uses catalog: font-medium
  lineHeight: 1.5, // Uses catalog: leading-snug
  radius: 8, // Uses catalog: rounded-lg
  opacity: 0.8, // Uses catalog: opacity-80
};

const classes = styleTw.styleToClass(style);
// Returns: 'flex gap-4 p-4 text-base font-medium leading-snug rounded-lg opacity-80'
```

### Dynamic Values

```typescript
const dynamicStyle: Style = {
  gap: 25, // Not in catalog, uses CSS variable
  size: 17, // Not in catalog, uses CSS variable
  lineHeight: 1.3, // Not in catalog, uses CSS variable
};

const classes = styleTw.styleToClass(dynamicStyle);
// Returns: 'gap-[var(--gap)] text-[var(--font-size)] leading-[var(--line-height)]'

const cssVars = styleTw.styleToStyle(dynamicStyle);
// Returns: {
//   '--gap': '25px',
//   '--font-size': '17px',
//   '--line-height': '1.3px'
// }
```

### Angular Template Usage

```html
<div [class]="classes" [style]="cssVars">Content</div>
```

```typescript
export class MyComponent {
  private styleTw = inject(StyleTw);

  get classes() {
    return this.styleTw.styleToClass(this.style);
  }

  get cssVars() {
    return this.styleTw.styleToStyle(this.style);
  }
}
```

## Migration Guide

### From Tailwind v3 to v4

1. **No changes needed** in your Style objects
2. **Update template usage** to include CSS variables when using dynamic values
3. **Test thoroughly** to ensure all styles render correctly

### Before (Tailwind v3)

```typescript
const classes = styleTw.styleToClass(style);
// Template: <div [class]="classes">
```

### After (Tailwind v4)

```typescript
const classes = styleTw.styleToClass(style);
const cssVars = styleTw.styleToStyle(style);
// Template: <div [class]="classes" [style]="cssVars">
```

## Benefits

1. **Tailwind v4 Compatibility**: Works with the new version that doesn't support JIT
2. **Performance**: Predefined classes are more performant than dynamic generation
3. **Consistency**: Ensures consistent class names across the application
4. **Maintainability**: Easier to maintain and extend with new catalog entries
5. **Type Safety**: Better TypeScript support with predefined value types

## Extending Catalogs

To add new values to catalogs, simply update the corresponding catalog object:

```typescript
// In style-tw.catalogs.ts
export const SPACING_CATALOG = {
  // ... existing values
  128: '128', // Add new spacing value
} as const;
```

## Troubleshooting

### Missing Classes

If a class is not being generated, check:

1. Is the value in the appropriate catalog?
2. Are you using the `styleToStyle()` method for CSS variables?
3. Is the template binding both `[class]` and `[style]`?

### CSS Variables Not Working

Ensure:

1. The CSS variables are being applied to the element via `[style]` binding
2. The variable names match between the class and the CSS variable
3. The values are properly formatted (e.g., pixels for spacing)

## Future Enhancements

1. **More Catalogs**: Add catalogs for colors, shadows, and other properties
2. **Custom Catalogs**: Allow users to define their own catalogs
3. **Performance Optimization**: Cache frequently used class combinations
4. **Theme Integration**: Integrate with design system tokens
