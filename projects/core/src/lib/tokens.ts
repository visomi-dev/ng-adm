export const BREAKPOINTS = ['sm', 'md', 'lg', 'xl'] as const;

export type Breakpoint = (typeof BREAKPOINTS)[number];

export type StyleToken = `token:${string}`; // p.ej.token:space.4

export type Dim = number | string | StyleToken; // 12 | '2rem' | 'token:space.4';

export type CssColor = string | StyleToken;

export type Percent = number; // 0..100

export type UUID = string;

export function isToken(v: unknown): v is StyleToken {
  return typeof v === 'string' && v.startsWith('token:');
}
