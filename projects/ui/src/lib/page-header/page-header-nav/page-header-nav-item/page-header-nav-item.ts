import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Deps } from '../../../deps';

const variantMap = {
  default:
    /* tw */ 'text-[var(--page-header-nav-item-text)] block py-2 transition-colors duration-300 hover:text-[var(--page-header-nav-item-active-text)] md:py-0',
  active:
    /* tw */ 'text-[var(--page-header-nav-item-active-text)] font-semibold',
};

const sizeMap = {
  sm: /* tw */ 'text-sm',
  md: /* tw */ 'text-base',
  lg: /* tw */ 'text-lg',
};

export type NavItem = {
  label: string;
  href: string;
  active?: boolean;
};

@Component({
  selector: 'lib-page-header-nav-item',
  imports: [RouterLink],
  templateUrl: './page-header-nav-item.html',
  styleUrl: './page-header-nav-item.css',
  host: {
    class: /* tw */ 'inline-block',
  },
})
export class PageHeaderNavItem {
  readonly deps = inject(Deps);

  readonly label = input.required<string>();
  readonly href = input.required<string>();
  readonly variant = input<'default' | 'active'>('default');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly active = input(false);
  readonly external = input(false);
  readonly target = input<'_blank' | '_self' | '_parent' | '_top' | null>(null);

  readonly classComputed = computed(() => {
    const cls = this.deps.cls();
    const variant = this.variant();
    const size = this.size();
    const isActive = this.active();

    return cls([
      variantMap[variant],
      sizeMap[size],
      isActive ? variantMap.active : '',
    ]);
  });
}
