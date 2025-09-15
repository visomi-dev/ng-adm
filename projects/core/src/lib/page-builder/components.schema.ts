import { z } from 'zod';

import { nodeSchema } from './nodes.schema';

export const inputSchema = z.object({
  type: z.enum([
    'string',
    'number',
    'boolean',
    'image',
    'color',
    'url',
    'select',
  ]),
  default: z.any().optional(),
  options: z.array(z.any()).optional(),
  exposed: z.boolean().default(true).optional(),
});

export const componentSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.number().int().positive().default(1),
  inputs: z.record(z.string(), inputSchema).default({}),
  variantGroups: z
    .record(z.string(), z.array(z.string()))
    .default({})
    .optional(),
  root: nodeSchema,
});

export type InputSchema = z.infer<typeof inputSchema>;
export type ComponentSchema = z.infer<typeof componentSchema>;
