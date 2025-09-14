import { Component, computed, inject, signal } from '@angular/core';

import { Deps } from '../deps';

const shadowSizeMap = {
  sm: /* tw */ 'shadow-sm',
  md: /* tw */ 'shadow-md',
  lg: /* tw */ 'shadow-lg',
};

const backdropBlurMap = {
  sm: /* tw */ 'backdrop-blur-sm',
  md: /* tw */ 'backdrop-blur-md',
  lg: /* tw */ 'backdrop-blur-lg',
};

@Component({
  selector: 'lib-page-header',
  imports: [],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
  host: {
    class: /* tw */ 'flex flex-row w-full',
  },
})
export class PageHeader {
  readonly deps = inject(Deps);

  readonly fixed = signal(false);
  readonly shadowSize = signal<'sm' | 'md' | 'lg' | null>(null);
  readonly backdropBlur = signal<'sm' | 'md' | 'lg' | null>(null);

  readonly classComputed = computed(() => {
    const cls = this.deps.cls();

    const shadowSize = this.shadowSize();
    const backdropBlur = this.backdropBlur();

    return cls([
      this.fixed()
        ? /* tw */ 'fixed top-0 right-0 left-0'
        : /* tw */ 'relative',
      shadowSize ? shadowSizeMap[shadowSize] : '',
      backdropBlur ? backdropBlurMap[backdropBlur] : '',
    ]);
  });
}
