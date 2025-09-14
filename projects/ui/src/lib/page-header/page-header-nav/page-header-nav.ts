import { Component, computed, inject, input, signal } from '@angular/core';

import { Deps } from '../../deps';

const orientationMap = {
  horizontal: /* tw */ 'flex-row items-center space-x-8',
  vertical: /* tw */ 'flex-col items-center space-y-4',
};

const alignmentMap = {
  left: /* tw */ 'justify-start',
  center: /* tw */ 'justify-center',
  right: /* tw */ 'justify-end',
  between: /* tw */ 'justify-between',
};

@Component({
  selector: 'lib-page-header-nav',
  imports: [],
  templateUrl: './page-header-nav.html',
  styleUrl: './page-header-nav.css',
  host: {
    class: /* tw */ 'flex',
  },
})
export class PageHeaderNav {
  readonly deps = inject(Deps);

  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly alignment = input<'left' | 'center' | 'right' | 'between'>('left');
  readonly mobileMenuOpen = signal(false);
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  readonly classComputed = computed(() => {
    const cls = this.deps.cls();
    const orientation = this.orientation();
    const alignment = this.alignment();

    return cls([orientationMap[orientation], alignmentMap[alignment]]);
  });

  readonly mobileMenuClassComputed = computed(() => {
    const cls = this.deps.cls();
    const isOpen = this.mobileMenuOpen();

    return cls([
      /* tw */ 'bg-[var(--page-header-nav-bg)] md:hidden transition-all duration-300 ease-in-out',
      isOpen
        ? /* tw */ 'sm:max-h-96 sm:opacity-100'
        : /* tw */ 'sm:max-h-0 sm:opacity-0 overflow-hidden',
    ]);
  });

  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
}
