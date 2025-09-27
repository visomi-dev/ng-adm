import { Component, computed, inject, input } from '@angular/core';
import { type PageSchema, type Node } from '@ng-adm/core';

import { NodeRenderer } from '../node-renderer/node-renderer';

@Component({
  selector: 'lib-page-renderer',
  imports: [NodeRenderer],
  templateUrl: './page-renderer.html',
  styleUrl: './page-renderer.css',
})
export class PageRenderer {
  readonly page = input.required<PageSchema>();

  readonly rootNodes = computed(() => {
    const page = this.page();
    return Array.isArray(page.root) ? page.root : [page.root];
  });

  readonly pageTitle = computed(() => {
    return this.page().seo.title;
  });

  readonly pageDescription = computed(() => {
    return this.page().seo.description;
  });

  readonly canonicalUrl = computed(() => {
    return this.page().seo.canonical;
  });

  readonly ogImage = computed(() => {
    return this.page().seo.og?.image;
  });

  readonly ogUrl = computed(() => {
    return this.page().seo.og?.url;
  });

  readonly ogType = computed(() => {
    return this.page().seo.og?.type;
  });
}
