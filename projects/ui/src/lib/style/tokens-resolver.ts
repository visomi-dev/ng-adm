export type TokenResolution =
  | { kind: 'tw'; value: string }
  | { kind: 'css-var'; value: string }
  | { kind: 'raw'; value: string };

/* eslint-disable @typescript-eslint/naming-convention */
const TOKEN_TO_TW: Record<string, string> = {
  'space.0': '0',
  'space.0.5': '0.5',
  'space.1': '1',
  'space.1.5': '1.5',
  'space.2': '2',
  'space.2.5': '2.5',
  'space.3': '3',
  'space.3.5': '3.5',
  'space.4': '4',
  'space.5': '5',
  'space.6': '6',
  'space.7': '7',
  'space.8': '8',
  'space.9': '9',
  'space.10': '10',
  'space.11': '11',
  'space.12': '12',
  'space.14': '14',
  'space.16': '16',
  'space.20': '20',
  'space.24': '24',
  'space.28': '28',
  'space.32': '32',
  'space.36': '36',
  'space.40': '40',
  'space.44': '44',
  'space.48': '48',
  'space.52': '52',
  'space.56': '56',
  'space.60': '60',
  'space.64': '64',
  'space.72': '72',
  'space.80': '80',
  'space.96': '96',
  'radius.none': 'none',
  'radius.sm': 'sm',
  'radius.md': 'md',
  'radius.lg': 'lg',
  'radius.xl': 'xl',
  'radius.2xl': '2xl',
  'radius.3xl': '3xl',
  'radius.full': 'full',
};
/* eslint-enable @typescript-eslint/naming-convention */

export function resolveToken(input: unknown): TokenResolution | null {
  if (typeof input !== 'string') return null;
  if (!input.startsWith('token:')) return { kind: 'raw', value: input };

  const key = input.slice('token:'.length);
  const cssVar = `var(--${key.replace(/\./g, '-')})`;
  const tw = TOKEN_TO_TW[key];

  return tw ? { kind: 'tw', value: tw } : { kind: 'css-var', value: cssVar };
}

export function toArbitrary(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === 'number') return `[${value}px]`;
  if (typeof value === 'string') {
    const token = resolveToken(value);
    if (!token) return null;
    if (token.kind === 'tw') return null;
    return `[${token.value}]`;
  }
  return null;
}

export function twValueOrArbitrary(
  baseClass: string,
  value: unknown,
  options?: { allowZero?: boolean },
): string | null {
  if (value == null) return null;

  const r = resolveToken(value);
  if (r?.kind === 'tw') return `${baseClass}-${r.value}`;

  if (typeof value === 'number') {
    if (value === 0 && options?.allowZero !== false) return `${baseClass}-0`;
    return `${baseClass}-${toArbitrary(value)}`;
  }

  const arb = toArbitrary(value);
  if (arb) return `${baseClass}-${arb}`;

  return `${baseClass}-${value}`;
}
