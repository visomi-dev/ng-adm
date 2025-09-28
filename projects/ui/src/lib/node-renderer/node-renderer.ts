import { Component, computed, inject, input, forwardRef } from '@angular/core';
import {
  ButtonNode,
  IconNode,
  ImageNode,
  TextNode,
  type Node,
} from '@ng-adm/core';

import { StyleTw } from '../style/style-tw';

@Component({
  selector: 'lib-node-renderer',
  imports: [forwardRef(() => NodeRenderer)],
  templateUrl: './node-renderer.html',
  styleUrl: './node-renderer.css',
  host: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[style]': 'styleComputed()',
  },
})
export class NodeRenderer {
  readonly styleTw = inject(StyleTw);

  readonly node = input.required<Node>();

  readonly children = computed(() => {
    const node = this.node();

    if (node.type !== 'stack' && node.type !== 'grid' && node.type !== 'box') {
      return [];
    }

    return node.children;
  });

  readonly classComputed = computed(() => {
    return this.styleTw.styleToClass(this.node().style);
  });

  readonly imageStyles = computed(() => {
    const node = this.node();

    if (node.type !== 'image') {
      return '';
    }

    const styles: string[] = [];

    if (node.props.objectFit) {
      styles.push(`object-fit: ${node.props.objectFit}`);
    }

    return styles.join('; ');
  });

  readonly styleComputed = computed(() => {
    return this.styleTw.styleToStyle(this.node().style);
  });

  readonly buttonClasses = computed(() => {
    const node = this.node();

    if (node.type !== 'button') {
      return this.classComputed();
    }

    const baseClasses = this.classComputed();
    const variant = node.props.variant || 'solid';

    const variantClasses = {
      solid: 'bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded',
      outline:
        'border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded',
      ghost: 'text-blue-600 hover:bg-blue-50 px-4 py-2 rounded',
    };

    return `${baseClasses} ${variantClasses[variant]}`.trim();
  });

  readonly iconClasses = computed(() => {
    const node = this.node();
    if (node.type !== 'icon') {
      return this.classComputed();
    }

    const baseClasses = this.classComputed();
    // Assuming you're using a icon library like Heroicons, FontAwesome, etc.
    // You might want to make this configurable
    const iconClass = `icon-${node.props.name}`;

    return `${baseClasses} ${iconClass}`.trim();
  });

  readonly spacerStyles = computed(() => {
    const node = this.node();
    if (node.type !== 'spacer') {
      return '';
    }

    const size = node.props?.size ?? 16;

    return `height: ${size}px; width: 100%;`;
  });

  readonly dividerStyles = computed(() => {
    const node = this.node();
    if (node.type !== 'divider') {
      return '';
    }

    const orientation = node.props?.orientation ?? 'horizontal';

    return orientation === 'vertical'
      ? 'width: 1px; height: 100%; border-left: 1px solid #e5e7eb;'
      : 'width: 100%; height: 1px; border-top: 1px solid #e5e7eb;';
  });

  // readonly slotEntries = computed(() => {
  //   const node = this.node();

  //   if (node.type !== 'component' || !node.slots) {
  //     return [];
  //   }

  //   return Object.entries(node.slots).map(([key, value]) => ({ key, value }));
  // });

  readonly textProps = computed(() => {
    const node = this.node();

    if (node.type !== 'text') {
      return {} as TextNode['props'];
    }

    return node.props as TextNode['props'];
  });

  readonly imageProps = computed(() => {
    const node = this.node();

    if (node.type !== 'image') {
      return {} as ImageNode['props'];
    }

    return node.props as ImageNode['props'];
  });

  readonly buttonProps = computed(() => {
    const node = this.node();

    if (node.type !== 'button') {
      return {} as ButtonNode['props'];
    }

    return node.props as ButtonNode['props'];
  });

  readonly iconProps = computed(() => {
    const node = this.node();

    if (node.type !== 'icon') {
      return {} as IconNode['props'];
    }

    return node.props as IconNode['props'];
  });

  handleAction(_event: Event, actionType: string): void {
    const node = this.node();
    if (!node.actions) return;

    const actions = node.actions.filter(
      (action) => action.event === actionType,
    );

    for (const action of actions) {
      // Here you would implement the actual action handling
      // For now, we'll just log it
      console.log('Action triggered:', action);

      // You might want to emit events or call services based on action.type
      switch (action.type) {
        case 'navigate':
          // Handle navigation
          break;
        case 'modal':
          // Handle modal opening
          break;
        case 'api':
          // Handle API calls
          break;
        default:
          console.warn('Unknown action type:', action.type);
      }
    }
  }
}
