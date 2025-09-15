export const BP_PREFIX: Record<string, string> = {
  base: '',
  sm: 'sm:',
  md: 'md:',
  lg: 'lg:',
  xl: 'xl:',
} as const;

export const DISPLAY_MAP = {
  flex: 'flex',
  grid: 'grid',
  block: 'block',
} as const;

export const FLEX_DIR_MAP = {
  row: 'flex-row',
  column: 'flex-col',
} as const;

export const ALIGN_ITEMS_MAP = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
} as const;

export const JUSTIFY_MAP = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
} as const;

export const WRAP_MAP = {
  true: 'flex-wrap',
  false: 'flex-nowrap',
} as const;

export const TEXT_ALIGN_MAP = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
} as const;

export const BORDER_STYLE_MAP = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
} as const;

export const SIZE_MODE_MAP = {
  hug: { w: 'w-fit', h: 'h-fit' },
  fill: { w: 'w-full', h: 'h-full' },
  fixed: { w: null, h: null },
} as const;
