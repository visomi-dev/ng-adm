import { TestBed } from '@angular/core/testing';
import type { Style } from '@ng-adm/core';

import { StyleTw } from './style-tw';

describe('StyleTw', () => {
  let service: StyleTw;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StyleTw);
  });

  // Helper function to create a valid Style object
  const createStyle = (props: Partial<Style>): Style => ({
    display: 'flex',
    ...props,
  });

  describe('Service Instantiation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have deps injected', () => {
      expect(service.deps).toBeTruthy();
    });
  });

  describe('Null and Undefined Handling', () => {
    it('should return empty string for null style', () => {
      expect(service.styleToClassList(null)).toBe('');
    });

    it('should return empty string for undefined style', () => {
      expect(service.styleToClassList(undefined)).toBe('');
    });

    it('should return empty string for empty style object', () => {
      expect(service.styleToClassList({} as Style)).toBe('');
    });

    it('should return empty object for styleToInline with null', () => {
      expect(service.styleToInline(null)).toEqual({});
    });

    it('should return empty object for styleToInline with undefined', () => {
      expect(service.styleToInline(undefined)).toEqual({});
    });
  });

  describe('Display Properties', () => {
    it('should handle flex display', () => {
      const style = createStyle({ display: 'flex' });
      expect(service.styleToClassList(style)).toBe('flex');
    });

    it('should handle grid display', () => {
      const style = createStyle({ display: 'grid' });
      expect(service.styleToClassList(style)).toBe('grid');
    });

    it('should handle block display', () => {
      const style = createStyle({ display: 'block' });
      expect(service.styleToClassList(style)).toBe('block');
    });

    it('should default to flex when display is not specified', () => {
      const style = createStyle({ flexDirection: 'row' });
      expect(service.styleToClassList(style)).toBe('flex flex-row');
    });
  });

  describe('Flex Properties', () => {
    it('should handle flex direction row', () => {
      const style = createStyle({ display: 'flex', flexDirection: 'row' });
      expect(service.styleToClassList(style)).toBe('flex flex-row');
    });

    it('should handle flex direction column', () => {
      const style = createStyle({ display: 'flex', flexDirection: 'column' });
      expect(service.styleToClassList(style)).toBe('flex flex-col');
    });

    it('should handle align items start', () => {
      const style = createStyle({ display: 'flex', alignItems: 'start' });
      expect(service.styleToClassList(style)).toBe('flex items-start');
    });

    it('should handle align items center', () => {
      const style = createStyle({ display: 'flex', alignItems: 'center' });
      expect(service.styleToClassList(style)).toBe('flex items-center');
    });

    it('should handle align items end', () => {
      const style = createStyle({ display: 'flex', alignItems: 'end' });
      expect(service.styleToClassList(style)).toBe('flex items-end');
    });

    it('should handle align items stretch', () => {
      const style = createStyle({ display: 'flex', alignItems: 'stretch' });
      expect(service.styleToClassList(style)).toBe('flex items-stretch');
    });

    it('should handle align items baseline', () => {
      const style = createStyle({ display: 'flex', alignItems: 'baseline' });
      expect(service.styleToClassList(style)).toBe('flex items-baseline');
    });

    it('should handle justify content start', () => {
      const style = createStyle({ display: 'flex', justifyContent: 'start' });
      expect(service.styleToClassList(style)).toBe('flex justify-start');
    });

    it('should handle justify content center', () => {
      const style = createStyle({ display: 'flex', justifyContent: 'center' });
      expect(service.styleToClassList(style)).toBe('flex justify-center');
    });

    it('should handle justify content end', () => {
      const style = createStyle({ display: 'flex', justifyContent: 'end' });
      expect(service.styleToClassList(style)).toBe('flex justify-end');
    });

    it('should handle justify content between', () => {
      const style = createStyle({ display: 'flex', justifyContent: 'between' });
      expect(service.styleToClassList(style)).toBe('flex justify-between');
    });

    it('should handle justify content around', () => {
      const style = createStyle({ display: 'flex', justifyContent: 'around' });
      expect(service.styleToClassList(style)).toBe('flex justify-around');
    });

    it('should handle justify content evenly', () => {
      const style = createStyle({ display: 'flex', justifyContent: 'evenly' });
      expect(service.styleToClassList(style)).toBe('flex justify-evenly');
    });

    it('should handle flex wrap true', () => {
      const style = createStyle({ display: 'flex', wrap: true });
      expect(service.styleToClassList(style)).toBe('flex flex-wrap');
    });

    it('should handle flex wrap false', () => {
      const style = createStyle({ display: 'flex', wrap: false });
      expect(service.styleToClassList(style)).toBe('flex flex-nowrap');
    });

    it('should handle complete flex configuration', () => {
      const style = createStyle({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'between',
        wrap: true,
      });
      expect(service.styleToClassList(style)).toBe(
        'flex flex-col items-center justify-between flex-wrap',
      );
    });
  });

  describe('Grid Properties', () => {
    it('should handle grid columns as number', () => {
      const style = createStyle({ display: 'grid', columns: 3 });
      expect(service.styleToClassList(style)).toBe('grid grid-cols-3');
    });

    it('should handle grid template columns', () => {
      const style = createStyle({
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
      });
      expect(service.styleToClassList(style)).toBe(
        'grid grid-cols-[1fr 2fr 1fr]',
      );
    });

    it('should handle both columns and grid template columns', () => {
      const style = createStyle({
        display: 'grid',
        columns: 2,
        gridTemplateColumns: 'repeat(2, 1fr)',
      });
      expect(service.styleToClassList(style)).toBe(
        'grid grid-cols-2 grid-cols-[repeat(2, 1fr)]',
      );
    });

    it('should ignore columns when not grid display', () => {
      const style = createStyle({ display: 'flex', columns: 3 });
      expect(service.styleToClassList(style)).toBe('flex');
    });
  });

  describe('Spacing Properties', () => {
    describe('Gap', () => {
      it('should handle gap as number', () => {
        const style = createStyle({ gap: 16 });
        expect(service.styleToClassList(style)).toBe('gap-[16px]');
      });

      it('should handle gap as string', () => {
        const style = createStyle({ gap: '1rem' });
        expect(service.styleToClassList(style)).toBe('gap-[1rem]');
      });

      it('should handle gap as design token', () => {
        const style = createStyle({ gap: 'token:space.4' });
        expect(service.styleToClassList(style)).toBe('gap-4');
      });

      it('should handle gap zero', () => {
        const style = createStyle({ gap: 0 });
        expect(service.styleToClassList(style)).toBe('gap-0');
      });
    });

    describe('Padding', () => {
      it('should handle symmetric padding', () => {
        const style = createStyle({
          padding: { top: 16, right: 16, bottom: 16, left: 16 },
        });
        expect(service.styleToClassList(style)).toBe('p-[16px]');
      });

      it('should handle symmetric padding with design token', () => {
        const style = createStyle({
          padding: {
            top: 'token:space.4',
            right: 'token:space.4',
            bottom: 'token:space.4',
            left: 'token:space.4',
          },
        });
        expect(service.styleToClassList(style)).toBe('p-4');
      });

      it('should handle horizontal symmetric padding', () => {
        const style = createStyle({
          padding: { top: 8, right: 16, bottom: 8, left: 16 },
        });
        expect(service.styleToClassList(style)).toBe('px-[16px] py-[8px]');
      });

      it('should handle vertical symmetric padding', () => {
        const style = createStyle({
          padding: { top: 16, right: 8, bottom: 16, left: 12 },
        });
        expect(service.styleToClassList(style)).toBe(
          'pt-[16px] pr-[8px] pb-[16px] pl-[12px] py-[16px]',
        );
      });

      it('should handle individual padding values', () => {
        const style = createStyle({
          padding: { top: 8, right: 12, bottom: 16, left: 20 },
        });
        expect(service.styleToClassList(style)).toBe(
          'pt-[8px] pr-[12px] pb-[16px] pl-[20px]',
        );
      });

      it('should handle partial padding values', () => {
        const style = createStyle({
          padding: { top: 16, right: 16 },
        });
        expect(service.styleToClassList(style)).toBe('pt-[16px] pr-[16px]');
      });

      it('should handle padding with zero values', () => {
        const style = createStyle({
          padding: { top: 0, right: 16, bottom: 0, left: 16 },
        });
        expect(service.styleToClassList(style)).toBe(
          'pt-0 pr-[16px] pb-0 pl-[16px] px-[16px]',
        );
      });
    });
  });

  describe('Sizing Properties', () => {
    describe('Size Modes', () => {
      it('should handle width mode hug', () => {
        const style = createStyle({ widthMode: 'hug' });
        expect(service.styleToClassList(style)).toBe('w-fit');
      });

      it('should handle width mode fill', () => {
        const style = createStyle({ widthMode: 'fill' });
        expect(service.styleToClassList(style)).toBe('w-full');
      });

      it('should handle height mode hug', () => {
        const style = createStyle({ heightMode: 'hug' });
        expect(service.styleToClassList(style)).toBe('h-fit');
      });

      it('should handle height mode fill', () => {
        const style = createStyle({ heightMode: 'fill' });
        expect(service.styleToClassList(style)).toBe('h-full');
      });

      it('should handle both width and height modes', () => {
        const style = createStyle({ widthMode: 'fill', heightMode: 'hug' });
        expect(service.styleToClassList(style)).toBe('w-full h-fit');
      });
    });

    describe('Dimensions', () => {
      it('should handle width as number', () => {
        const style = createStyle({ w: 200 });
        expect(service.styleToClassList(style)).toBe('w-[200px]');
      });

      it('should handle width as string', () => {
        const style = createStyle({ w: '50%' });
        expect(service.styleToClassList(style)).toBe('w-[50%]');
      });

      it('should handle height as number', () => {
        const style = createStyle({ h: 100 });
        expect(service.styleToClassList(style)).toBe('h-[100px]');
      });

      it('should handle height as string', () => {
        const style = createStyle({ h: '100vh' });
        expect(service.styleToClassList(style)).toBe('h-[100vh]');
      });

      it('should handle min width', () => {
        const style = createStyle({ minW: 300 });
        expect(service.styleToClassList(style)).toBe('min-w-[300px]');
      });

      it('should handle max width', () => {
        const style = createStyle({ maxW: 800 });
        expect(service.styleToClassList(style)).toBe('max-w-[800px]');
      });

      it('should handle min height', () => {
        const style = createStyle({ minH: 200 });
        expect(service.styleToClassList(style)).toBe('min-h-[200px]');
      });

      it('should handle max height', () => {
        const style = createStyle({ maxH: 600 });
        expect(service.styleToClassList(style)).toBe('max-h-[600px]');
      });

      it('should handle zero dimensions', () => {
        const style = createStyle({ w: 0, h: 0 });
        expect(service.styleToClassList(style)).toBe('w-0 h-0');
      });
    });

    describe('Flex Grow and Shrink', () => {
      it('should handle flex grow positive', () => {
        const style = createStyle({ grow: 1 });
        expect(service.styleToClassList(style)).toBe('grow');
      });

      it('should handle flex grow zero', () => {
        const style = createStyle({ grow: 0 });
        expect(service.styleToClassList(style)).toBe('grow-0');
      });

      it('should handle flex shrink zero', () => {
        const style = createStyle({ shrink: 0 });
        expect(service.styleToClassList(style)).toBe('shrink-0');
      });

      it('should handle flex shrink positive', () => {
        const style = createStyle({ shrink: 1 });
        expect(service.styleToClassList(style)).toBe('shrink');
      });
    });
  });

  describe('Visual Properties', () => {
    describe('Background', () => {
      it('should handle background as design token', () => {
        const style = createStyle({ bg: 'token:color.primary' });
        expect(service.styleToClassList(style)).toBe(
          'bg-[var(--color-primary)]',
        );
      });

      it('should handle background as hex color', () => {
        const style = createStyle({ bg: '#ff0000' });
        expect(service.styleToClassList(style)).toBe('bg-[#ff0000]');
      });

      it('should handle background as rgb color', () => {
        const style = createStyle({ bg: 'rgb(255, 0, 0)' });
        expect(service.styleToClassList(style)).toBe('bg-[rgb(255, 0, 0)]');
      });

      it('should handle background as css variable', () => {
        const style = createStyle({ bg: 'var(--custom-color)' });
        expect(service.styleToClassList(style)).toBe(
          'bg-[var(--custom-color)]',
        );
      });
    });

    describe('Border', () => {
      it('should handle border width as number', () => {
        const style = createStyle({ border: { width: 1 } });
        expect(service.styleToClassList(style)).toBe('border');
      });

      it('should handle border width zero', () => {
        const style = createStyle({ border: { width: 0 } });
        expect(service.styleToClassList(style)).toBe('border-0');
      });

      it('should handle border width as arbitrary value', () => {
        const style = createStyle({ border: { width: 2 } });
        expect(service.styleToClassList(style)).toBe('border-[2px]');
      });

      it('should handle border width as string', () => {
        const style = createStyle({ border: { width: '2px' } });
        expect(service.styleToClassList(style)).toBe('border-2px');
      });

      it('should handle border style solid', () => {
        const style = createStyle({ border: { style: 'solid' } });
        expect(service.styleToClassList(style)).toBe('border border-solid');
      });

      it('should handle border style dashed', () => {
        const style = createStyle({ border: { style: 'dashed' } });
        expect(service.styleToClassList(style)).toBe('border border-dashed');
      });

      it('should handle border style dotted', () => {
        const style = createStyle({ border: { style: 'dotted' } });
        expect(service.styleToClassList(style)).toBe('border border-dotted');
      });

      it('should handle border color as design token', () => {
        const style = createStyle({ border: { color: 'token:color.border' } });
        expect(service.styleToClassList(style)).toBe(
          'border border-[var(--color-border)]',
        );
      });

      it('should handle border color as hex', () => {
        const style = createStyle({ border: { color: '#000000' } });
        expect(service.styleToClassList(style)).toBe('border border-[#000000]');
      });

      it('should handle complete border configuration', () => {
        const style = createStyle({
          border: { width: 2, style: 'dashed', color: '#ff0000' },
        });
        expect(service.styleToClassList(style)).toBe(
          'border-[2px] border-dashed border-[#ff0000]',
        );
      });
    });

    describe('Border Radius', () => {
      it('should handle radius as design token', () => {
        const style = createStyle({ radius: 'token:radius.md' });
        expect(service.styleToClassList(style)).toBe('rounded-md');
      });

      it('should handle radius as number', () => {
        const style = createStyle({ radius: 8 });
        expect(service.styleToClassList(style)).toBe('rounded-[8px]');
      });

      it('should handle radius as string', () => {
        const style = createStyle({ radius: '0.5rem' });
        expect(service.styleToClassList(style)).toBe('rounded-[0.5rem]');
      });

      it('should handle radius zero', () => {
        const style = createStyle({ radius: 0 });
        expect(service.styleToClassList(style)).toBe('rounded-[0px]');
      });
    });

    describe('Shadow', () => {
      it('should handle shadow as design token', () => {
        const style = createStyle({ shadow: 'token:shadow.md' });
        expect(service.styleToClassList(style)).toBe(
          'shadow-[var(--shadow-md)]',
        );
      });

      it('should handle shadow as string', () => {
        const style = createStyle({ shadow: '0 4px 6px rgba(0, 0, 0, 0.1)' });
        expect(service.styleToClassList(style)).toBe(
          'shadow-[0 4px 6px rgba(0, 0, 0, 0.1)]',
        );
      });
    });

    describe('Opacity', () => {
      it('should handle opacity as percentage (divisible by 5)', () => {
        const style = createStyle({ opacity: 0.5 });
        expect(service.styleToClassList(style)).toBe('opacity-50');
      });

      it('should handle opacity as percentage (not divisible by 5)', () => {
        const style = createStyle({ opacity: 0.33 });
        expect(service.styleToClassList(style)).toBe('opacity-[0.33]');
      });

      it('should handle opacity zero', () => {
        const style = createStyle({ opacity: 0 });
        expect(service.styleToClassList(style)).toBe('opacity-0');
      });

      it('should handle opacity one', () => {
        const style = createStyle({ opacity: 1 });
        expect(service.styleToClassList(style)).toBe('opacity-100');
      });
    });
  });

  describe('Typography Properties', () => {
    it('should handle text align left', () => {
      const style = createStyle({ textAlign: 'left' });
      expect(service.styleToClassList(style)).toBe('text-left');
    });

    it('should handle text align center', () => {
      const style = createStyle({ textAlign: 'center' });
      expect(service.styleToClassList(style)).toBe('text-center');
    });

    it('should handle text align right', () => {
      const style = createStyle({ textAlign: 'right' });
      expect(service.styleToClassList(style)).toBe('text-right');
    });

    it('should handle text align justify', () => {
      const style = createStyle({ textAlign: 'justify' });
      expect(service.styleToClassList(style)).toBe('text-justify');
    });

    it('should handle font as design token', () => {
      const style = createStyle({ font: 'token:font.sans' });
      expect(service.styleToClassList(style)).toBe('font-[var(--font-sans)]');
    });

    it('should handle font as string', () => {
      const style = createStyle({ font: 'Inter, sans-serif' });
      expect(service.styleToClassList(style)).toBe('font-[Inter, sans-serif]');
    });

    it('should handle font size as number', () => {
      const style = createStyle({ size: 16 });
      expect(service.styleToClassList(style)).toBe('text-[16px]');
    });

    it('should handle font size as string', () => {
      const style = createStyle({ size: '1.2rem' as unknown as number });
      expect(service.styleToClassList(style)).toBe('text-[1.2rem]');
    });

    it('should handle font weight as number', () => {
      const style = createStyle({ weight: 600 });
      expect(service.styleToClassList(style)).toBe('font-[600]');
    });

    it('should handle font weight as string', () => {
      const style = createStyle({ weight: 'bold' });
      expect(service.styleToClassList(style)).toBe('font-bold');
    });

    it('should handle line height as number', () => {
      const style = createStyle({ lineHeight: 24 });
      expect(service.styleToClassList(style)).toBe('leading-[24px]');
    });

    it('should handle line height as string', () => {
      const style = createStyle({ lineHeight: '1.5' as unknown as number });
      expect(service.styleToClassList(style)).toBe('leading-[1.5]');
    });

    it('should handle letter spacing as number', () => {
      const style = createStyle({ letterSpacing: 2 });
      expect(service.styleToClassList(style)).toBe('tracking-[2px]');
    });

    it('should handle letter spacing as string', () => {
      const style = createStyle({
        letterSpacing: '0.1em' as unknown as number,
      });
      expect(service.styleToClassList(style)).toBe('tracking-[0.1em]');
    });

    it('should handle complete typography configuration', () => {
      const style = createStyle({
        textAlign: 'center',
        font: 'Inter, sans-serif',
        size: 18,
        weight: 'semibold',
        lineHeight: 28,
        letterSpacing: 1,
      });
      expect(service.styleToClassList(style)).toBe(
        'text-center font-[Inter, sans-serif] text-[18px] font-semibold leading-[28px] tracking-[1px]',
      );
    });
  });

  describe('Responsive Overrides', () => {
    it('should handle responsive overrides', () => {
      const style = createStyle({
        display: 'flex',
        gap: 16,
        overrides: {
          sm: { gap: 8 },
          md: { display: 'grid', columns: 2 },
        } as Record<string, Partial<Style>>,
      });
      const result = service.styleToClassList(style);
      expect(result).toContain('flex gap-[16px]');
      expect(result).toContain('sm:gap-[8px]');
      expect(result).toContain('md:grid md:grid-cols-2');
    });

    it('should handle multiple responsive properties', () => {
      const style = createStyle({
        display: 'flex',
        alignItems: 'start',
        overrides: {
          lg: { alignItems: 'center', justifyContent: 'between' },
        } as Record<string, Partial<Style>>,
      });
      const result = service.styleToClassList(style);
      expect(result).toContain('flex items-start');
      expect(result).toContain('lg:items-center lg:justify-between');
    });

    it('should handle responsive overrides with design tokens', () => {
      const style = createStyle({
        gap: 'token:space.4',
        overrides: {
          sm: { gap: 'token:space.2' },
          lg: { gap: 'token:space.8' },
        } as Record<string, Partial<Style>>,
      });
      const result = service.styleToClassList(style);
      expect(result).toContain('gap-4');
      expect(result).toContain('sm:gap-2');
      expect(result).toContain('lg:gap-8');
    });
  });

  describe('Complex Combinations', () => {
    it('should handle complex flex layout', () => {
      const style = createStyle({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'between',
        gap: 'token:space.4',
        padding: { top: 16, right: 16, bottom: 16, left: 16 },
        w: '100%',
        h: '100vh',
        bg: '#ffffff',
        radius: 'token:radius.lg',
        shadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overrides: {
          md: {
            flexDirection: 'row',
            alignItems: 'start',
            gap: 'token:space.8',
          },
        } as Record<string, Partial<Style>>,
      });
      const result = service.styleToClassList(style);
      expect(result).toContain(
        'flex flex-col items-center justify-between gap-4 p-[16px] w-[100%] h-[100vh] bg-[#ffffff] rounded-lg shadow-[0 4px 6px rgba(0, 0, 0, 0.1)]',
      );
      expect(result).toContain('md:flex-row md:items-start md:gap-8');
    });

    it('should handle complex grid layout', () => {
      const style = createStyle({
        display: 'grid',
        columns: 3,
        gap: 'token:space.6',
        padding: { top: 24, right: 24, bottom: 24, left: 24 },
        bg: 'token:color.background',
        radius: 'token:radius.md',
        overrides: {
          sm: { columns: 1, gap: 'token:space.4' },
          lg: { columns: 4, gap: 'token:space.8' },
        } as Record<string, Partial<Style>>,
      });
      const result = service.styleToClassList(style);
      expect(result).toContain(
        'grid grid-cols-3 gap-6 p-[24px] bg-[var(--color-background)] rounded-md',
      );
      expect(result).toContain('sm:grid-cols-1 sm:gap-4');
      expect(result).toContain('lg:grid-cols-4 lg:gap-8');
    });

    it('should handle typography with responsive overrides', () => {
      const style = createStyle({
        textAlign: 'left',
        font: 'Inter, sans-serif',
        size: 16,
        weight: 'normal',
        lineHeight: 24,
        overrides: {
          md: {
            textAlign: 'center',
            size: 18,
            weight: 'semibold',
          },
          lg: {
            size: 20,
            lineHeight: 32,
          },
        } as Record<string, Partial<Style>>,
      });
      const result = service.styleToClassList(style);
      expect(result).toContain(
        'text-left font-[Inter, sans-serif] text-[16px] font-normal leading-[24px]',
      );
      expect(result).toContain(
        'md:text-center md:text-[18px] md:font-semibold',
      );
      expect(result).toContain('lg:text-[20px] lg:leading-[32px]');
    });
  });

  describe('API Methods', () => {
    it('should have styleToClassString as alias for styleToClassList', () => {
      const style = createStyle({ display: 'flex', gap: 16 });
      expect(service.styleToClassString(style)).toBe(
        service.styleToClassList(style),
      );
    });

    it('should return empty object from styleToInline', () => {
      const style = createStyle({ display: 'flex' });
      expect(service.styleToInline(style)).toEqual({});
    });
  });

  describe('Edge Cases', () => {
    it('should handle style with only undefined values', () => {
      const style = createStyle({
        display: undefined as unknown as 'flex',
        gap: undefined,
        padding: undefined,
      });
      expect(service.styleToClassList(style)).toBe('');
    });

    it('should handle style with mixed defined and undefined values', () => {
      const style = createStyle({
        display: 'flex',
        gap: undefined,
        padding: { top: 16, right: undefined, bottom: 16, left: undefined },
      });
      expect(service.styleToClassList(style)).toBe('flex pt-[16px] pb-[16px]');
    });

    it('should handle border with only color', () => {
      const style = createStyle({ border: { color: '#ff0000' } });
      expect(service.styleToClassList(style)).toBe('border border-[#ff0000]');
    });

    it('should handle border with only style', () => {
      const style = createStyle({ border: { style: 'dashed' } });
      expect(service.styleToClassList(style)).toBe('border border-dashed');
    });

    it('should handle padding with only some values', () => {
      const style = createStyle({ padding: { top: 16 } });
      expect(service.styleToClassList(style)).toBe('pt-[16px]');
    });

    it('should handle responsive overrides with empty objects', () => {
      const style = createStyle({
        display: 'flex',
        overrides: {
          sm: {},
          md: { display: 'grid' },
        } as Record<string, Partial<Style>>,
      });
      expect(service.styleToClassList(style)).toBe('flex md:grid');
    });
  });
});
