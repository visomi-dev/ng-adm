import { z } from 'zod';

import { nodeSchema } from './nodes.schema';

export const pageStatus = z.enum(['draft', 'published', 'archived']);

export const seoSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  canonical: z.url().optional(),
  og: z
    .object({
      image: z.url().optional(),
      url: z.url().optional(),
      type: z.string().optional(),
    })
    .optional(),
});

export const pageSchema = z.object({
  slug: z.string().min(1),
  locale: z.union([z.string().min(2), z.array(z.string().min(2))]),
  status: pageStatus.default('draft'),
  seo: seoSchema,
  data: z.record(z.string(), z.any()).default({}).optional(),
  root: z.union([nodeSchema, z.array(nodeSchema)]),
  usedComponents: z.array(z.string()).default([]),
});

export type PageSchema = z.infer<typeof pageSchema>;
