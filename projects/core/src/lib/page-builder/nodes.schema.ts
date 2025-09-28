import { z } from 'zod';

import { styleSchema } from './style.schema';

const baseNodeSchema = z.object({
  id: z.uuid(),
  name: z.string().optional(),
  visible: z.boolean().default(true),
  locked: z.boolean().default(false),
  style: styleSchema.optional(),
  bindings: z.record(z.string(), z.unknown()).optional(),
  actions: z
    .array(
      z.object({
        event: z.string(),
        type: z.string(),
        payload: z.unknown().optional(),
      }),
    )
    .optional(),
});

type BaseNodeSchema = z.infer<typeof baseNodeSchema>;

export type StackNode = BaseNodeSchema & { type: 'stack'; children: $Node[] };
export type GridNode = BaseNodeSchema & { type: 'grid'; children: $Node[] };
export type BoxNode = BaseNodeSchema & { type: 'box'; children: $Node[] };

export type TextNode = BaseNodeSchema & {
  type: 'text';
  props: { text: string; semantic?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' };
};

export type ImageNode = BaseNodeSchema & {
  type: 'image';
  props: {
    src: string;
    alt?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  };
};

export type ButtonNode = BaseNodeSchema & {
  type: 'button';
  props: {
    label: string;
    href?: string;
    variant?: 'solid' | 'outline' | 'ghost';
  };
};

export type IconNode = BaseNodeSchema & {
  type: 'icon';
  props: { name: string };
};

export type SpacerNode = BaseNodeSchema & {
  type: 'spacer';
  props?: { size?: number };
};

export type DividerNode = BaseNodeSchema & {
  type: 'divider';
  props?: { orientation?: 'horizontal' | 'vertical' };
};

export type RepeaterNode = BaseNodeSchema & {
  type: 'repeater';
  bindings: { collection: string };
  template: $Node;
};

export type WidgetNode = BaseNodeSchema & {
  type: 'widget';
  widget: {
    library: 'primeng' | 'custom';
    component: string;
    inputs?: Record<string, unknown>;
    outputs?: string[];
  };
  children: $Node[];
};

export type ComponentInstanceNode = BaseNodeSchema & {
  type: 'component';
  ref: string;
  overrides?: Record<string, unknown>;
  slots?: Record<string, $Node[]>;
};

export type $Node =
  | StackNode
  | GridNode
  | BoxNode
  | TextNode
  | ImageNode
  | ButtonNode
  | IconNode
  | SpacerNode
  | DividerNode
  | RepeaterNode
  | WidgetNode
  | ComponentInstanceNode;

const makeStackNode = (node: z.ZodType<$Node>) =>
  baseNodeSchema.extend({
    type: z.literal('stack'),
    children: z.array(z.lazy(() => node)).default([]),
  });

const makeGridNode = (node: z.ZodType<$Node>) =>
  baseNodeSchema.extend({
    type: z.literal('grid'),
    children: z.array(z.lazy(() => node)).default([]),
  });

const makeBoxNode = (node: z.ZodType<$Node>) =>
  baseNodeSchema.extend({
    type: z.literal('box'),
    children: z.array(z.lazy(() => node)).default([]),
  });

const textNode = baseNodeSchema.extend({
  type: z.literal('text'),
  props: z.object({
    text: z.string(),
    semantic: z
      .enum(['p', 'span', 'h1', 'h2', 'h3', 'h4'])
      .optional()
      .default('p'),
  }),
});

const imageNode = baseNodeSchema.extend({
  type: z.literal('image'),
  props: z.object({
    src: z.url(),
    alt: z.string().optional(),
    objectFit: z
      .enum(['cover', 'contain', 'fill', 'none', 'scale-down'])
      .optional(),
  }),
});

const buttonNode = baseNodeSchema.extend({
  type: z.literal('button'),
  props: z.object({
    label: z.string(),
    href: z.string().optional(),
    variant: z.enum(['solid', 'outline', 'ghost']).optional().default('solid'),
  }),
});

const iconNode = baseNodeSchema.extend({
  type: z.literal('icon'),
  props: z.object({ name: z.string() }),
});

const spacerNode = baseNodeSchema.extend({
  type: z.literal('spacer'),
  props: z
    .object({ size: z.number().positive().optional().default(16) })
    .optional(),
});

const dividerNode = baseNodeSchema.extend({
  type: z.literal('divider'),
  props: z
    .object({
      orientation: z
        .enum(['horizontal', 'vertical'])
        .optional()
        .default('horizontal'),
    })
    .optional(),
});

const makeRepeaterNode = (node: z.ZodType<$Node>) =>
  baseNodeSchema.extend({
    type: z.literal('repeater'),
    bindings: z.object({ collection: z.string() }),
    template: z.lazy(() => node),
  });

const makeWidgetNode = (node: z.ZodType<$Node>) =>
  baseNodeSchema.extend({
    type: z.literal('widget'),
    widget: z.object({
      library: z.enum(['primeng', 'custom']),
      component: z.string(),
      inputs: z.record(z.string(), z.unknown()).optional(),
      outputs: z.array(z.string()).optional(),
    }),
    children: z.array(z.lazy(() => node)).default([]),
  });

const makeComponentInstanceNode = (node: z.ZodType<$Node>) =>
  baseNodeSchema.extend({
    type: z.literal('component'),
    ref: z.string(),
    overrides: z.record(z.string(), z.unknown()).optional(),
    slots: z.record(z.string(), z.array(z.lazy(() => node))).optional(),
  });

export const nodeSchema: z.ZodType<$Node> = z.lazy(() =>
  z.discriminatedUnion('type', [
    makeStackNode(nodeSchema),
    makeGridNode(nodeSchema),
    makeBoxNode(nodeSchema),
    textNode,
    imageNode,
    buttonNode,
    iconNode,
    spacerNode,
    dividerNode,
    makeRepeaterNode(nodeSchema),
    makeWidgetNode(nodeSchema),
    makeComponentInstanceNode(nodeSchema),
  ]),
);

export type Node = $Node;
