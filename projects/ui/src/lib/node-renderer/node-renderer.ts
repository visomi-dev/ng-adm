import { Component, computed, inject, input } from '@angular/core';
import { type Node } from '@ng-adm/core';

import { StyleTw } from '../style/style-tw';

@Component({
  selector: 'lib-node-renderer',
  imports: [],
  templateUrl: './node-renderer.html',
  styleUrl: './node-renderer.css',
})
export class NodeRenderer {
  readonly styleTw = inject(StyleTw);

  readonly node = input.required<Node>();

  readonly classComputed = computed(() => {
    return this.styleTw.styleToClass(this.node().style);
  });
}
