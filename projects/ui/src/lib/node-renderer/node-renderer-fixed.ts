import { Component, computed, inject, input, forwardRef } from '@angular/core';
import { type Node } from '@ng-adm/core';

import { StyleTw } from '../style/style-tw';

@Component({
  selector: 'lib-node-renderer',
  imports: [forwardRef(() => NodeRenderer)],
  templateUrl: './node-renderer.html',
  styleUrl: './node-renderer.css',
})
export class NodeRenderer {
  readonly styleTw = inject(StyleTw);

  readonly node = input.required<Node>();

  readonly classComputed = computed(() => {
    return this.styleTw.styleToClass(this.node().style);
  });

  getImageStyles(): string {
    const node = this.node();
    if (node.type !== 'image') return '';

    const styles: string[] = [];
    if (node.props.objectFit) {
      styles.push(`object-fit: ${node.props.objectFit}`);
    }
    return styles.join('; ');
  }

  getButtonClasses(): string {
    const node = this.node();
    if (node.type !== 'button') return this.classComputed();

    const baseClasses = this.classComputed();
    const variant = node.props.variant || 'solid';

    const variantClasses = {
      solid: 'bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded',
      outline:
        'border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded',
      ghost: 'text-blue-600 hover:bg-blue-50 px-4 py-2 rounded',
    };

    return `${baseClasses} ${variantClasses[variant]}`.trim();
  }

  getIconClasses(): string {
    const node = this.node();
    if (node.type !== 'icon') return this.classComputed();

    const baseClasses = this.classComputed();
    // Assuming you're using a icon library like Heroicons, FontAwesome, etc.
    // You might want to make this configurable
    const iconClass = `icon-${node.props.name}`;

    return `${baseClasses} ${iconClass}`.trim();
  }

  getSpacerStyles(): string {
    const node = this.node();
    if (node.type !== 'spacer') return '';

    const size = node.props?.size || 16;
    return `height: ${size}px; width: 100%;`;
  }

  getDividerStyles(): string {
    const node = this.node();
    if (node.type !== 'divider') return '';

    const orientation = node.props?.orientation || 'horizontal';
    return orientation === 'vertical'
      ? 'width: 1px; height: 100%; border-left: 1px solid #e5e7eb;'
      : 'width: 100%; height: 1px; border-top: 1px solid #e5e7eb;';
  }

  getSlotEntries(): { key: string; value: Node[] }[] {
    const node = this.node();
    if (node.type !== 'component' || !node.slots) return [];

    return Object.entries(node.slots).map(([key, value]) => ({ key, value }));
  }

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
