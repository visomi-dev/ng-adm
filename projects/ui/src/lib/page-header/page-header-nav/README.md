# Page Header Navigation Components

This module provides reusable navigation components for page headers, abstracted from the landing component for use in a page builder.

## Components

### PageHeaderNavItem

A single navigation item component with configurable properties.

#### Properties

- `label` (required): The text to display for the navigation item
- `href` (required): The URL or route for the navigation item
- `variant`: The visual variant ('default' | 'active' | 'mobile')
- `size`: The text size ('sm' | 'md' | 'lg')
- `active`: Whether the item is currently active
- `external`: Whether the link should open in a new tab

#### Usage

```html
<lib-page-header-nav-item label="Home" href="/" [active]="true" size="md" variant="default" />
```

### PageHeaderNav

A navigation container component that manages multiple navigation items with mobile menu support.

#### Properties

- `items` (required): Array of NavItem objects
- `orientation`: Layout orientation ('horizontal' | 'vertical')
- `alignment`: Content alignment ('left' | 'center' | 'right' | 'between')
- `showMobileMenu`: Whether to show mobile menu toggle
- `size`: Text size for all items ('sm' | 'md' | 'lg')

#### Usage

```typescript
import { NavItem } from './page-header-nav-item/page-header-nav-item';

export class MyComponent {
  navigationItems: NavItem[] = [
    { label: 'Home', href: '/', active: true },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
}
```

```html
<lib-page-header-nav [items]="navigationItems" orientation="horizontal" alignment="right" [showMobileMenu]="true" size="md" />
```

## Complete Example

```html
<lib-page-header [fixed]="true" [shadowSize]="'md'" [backdropBlur]="'md'">
  <div class="container mx-auto flex items-center justify-between px-6 py-4">
    <h1 class="text-2xl font-bold tracking-wider text-[#9D3C5F]">My App</h1>

    <lib-page-header-nav [items]="navigationItems" orientation="horizontal" alignment="right" [showMobileMenu]="true" size="md" />
  </div>
</lib-page-header>
```

## Features

- **Responsive Design**: Automatically switches between desktop and mobile layouts
- **Mobile Menu**: Collapsible mobile navigation with smooth animations
- **Configurable Styling**: Multiple variants and sizes for different use cases
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Type Safety**: Full TypeScript support with interfaces
- **Reusable**: Abstracted from specific landing page for general use
