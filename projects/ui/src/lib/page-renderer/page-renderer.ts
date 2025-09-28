import { Component, computed, effect, inject, input } from '@angular/core';
import { type PageSchema } from '@ng-adm/core';

import { NodeRenderer } from '../node-renderer/node-renderer';
import { SEO } from '../seo';

@Component({
  selector: 'lib-page-renderer',
  imports: [NodeRenderer],
  templateUrl: './page-renderer.html',
  styleUrl: './page-renderer.css',
})
export class PageRenderer {
  readonly seo = inject(SEO);

  readonly page = input.required<PageSchema>();

  readonly rootNodes = computed(() => {
    const page = this.page();

    return Array.isArray(page.root) ? page.root : [page.root];
  });

  readonly pageEffect = effect(() => {
    const page = this.page();

    if (!page.seo) {
      return;
    }

    this.seo.configure({
      title: page.seo.title,
      description: page.seo.description ?? '',
      url: page.seo.canonical ?? '',
      preview: page.seo.og?.image ?? '',
    });
  });
}
