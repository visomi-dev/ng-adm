import { z } from 'zod';

import type { CssColor } from '../tokens';

export const sizeMode = z.enum(['hug', 'fill', 'fixed']);

export const spacingSchema = z.object({
  top: z.union([z.number(), z.string()]).optional(),
  right: z.union([z.number(), z.string()]).optional(),
  bottom: z.union([z.number(), z.string()]).optional(),
  left: z.union([z.number(), z.string()]).optional(),
});

export const styleSchema = z.object({
  display: z.enum(['flex', 'grid', 'block']).default('flex'),
  flexDirection: z.enum(['row', 'column']).optional(),
  alignItems: z
    .enum(['start', 'center', 'end', 'stretch', 'baseline'])
    .optional(),
  justifyContent: z
    .enum(['start', 'center', 'end', 'between', 'around', 'evenly'])
    .optional(),
  wrap: z.boolean().optional(),

  gap: z.union([z.number(), z.string()]).optional(),
  padding: spacingSchema.optional(),

  widthMode: sizeMode.optional(),
  heightMode: sizeMode.optional(),
  w: z.union([z.number(), z.string()]).optional(),
  h: z.union([z.number(), z.string()]).optional(),
  minW: z.union([z.number(), z.string()]).optional(),
  maxW: z.union([z.number(), z.string()]).optional(),
  minH: z.union([z.number(), z.string()]).optional(),
  maxH: z.union([z.number(), z.string()]).optional(),
  grow: z.number().optional(),
  shrink: z.number().optional(),

  bg: z.custom<CssColor>().optional(),
  border: z
    .object({
      color: z.custom<CssColor>().optional(),
      width: z.union([z.number(), z.string()]).optional(),
      style: z.enum(['solid', 'dashed', 'dotted']).optional(),
    })
    .optional(),
  radius: z.union([z.number(), z.string()]).optional(),
  shadow: z.string().optional(),
  opacity: z.number().min(0).max(1).optional(),

  // Grid
  columns: z.number().int().positive().optional(),
  gridTemplateColumns: z.string().optional(),

  // Typography (solo aplicable a text)
  font: z.string().optional(),
  size: z.number().optional(),
  weight: z
    .union([
      z.number(),
      z.enum([
        'thin',
        'light',
        'normal',
        'medium',
        'semibold',
        'bold',
        'black',
      ]),
    ])
    .optional(),
  lineHeight: z.number().optional(),
  letterSpacing: z.number().optional(),
  textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),

  overrides: z.record(z.enum(['sm', 'md', 'lg', 'xl']), z.any()).optional(),
});

export type Style = z.infer<typeof styleSchema>;
