import { Component, signal } from '@angular/core';
import { type PageSchema, type Node } from '@ng-adm/core';

import { PageRenderer } from '../page-renderer/page-renderer';

@Component({
  selector: 'lib-page-example',
  imports: [PageRenderer],
  templateUrl: './page-example.html',
  styleUrl: './page-example.css',
})
export class PageExample {
  readonly examplePage = signal<PageSchema>(this.createExamplePage());

  private createExamplePage(): PageSchema {
    return {
      slug: 'example-page',
      locale: 'es',
      status: 'published',
      seo: {
        title: 'Página de Ejemplo - Mi Page Builder',
        description:
          'Esta es una página de ejemplo creada con nuestro page builder estilo Wix/Figma',
        canonical: 'https://example.com/example-page',
        og: {
          image: 'https://example.com/og-image.jpg',
          url: 'https://example.com/example-page',
          type: 'website',
        },
      },
      data: {
        user: { name: 'Usuario Ejemplo' },
        products: [
          { id: 1, name: 'Producto 1', price: 29.99 },
          { id: 2, name: 'Producto 2', price: 39.99 },
        ],
      },
      root: this.createExampleRootNode(),
      usedComponents: ['hero-section', 'product-grid'],
    };
  }

  private createExampleRootNode(): Node {
    return {
      id: 'root-1',
      name: 'Root Container',
      type: 'stack',
      visible: true,
      locked: false,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        padding: { top: 16, bottom: 16, left: 16, right: 16 },
        minH: '100vh',
      },
      children: [
        this.createHeaderNode(),
        this.createHeroNode(),
        this.createFeaturesNode(),
        this.createProductsNode(),
        this.createFooterNode(),
      ],
    };
  }

  private createHeaderNode(): Node {
    return {
      id: 'header-1',
      name: 'Header',
      type: 'stack',
      visible: true,
      locked: false,
      style: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'between',
        alignItems: 'center',
        padding: { top: 16, bottom: 16 },
        bg: '#ffffff',
        border: { color: '#e5e7eb', width: 1, style: 'solid' },
        radius: 8,
      },
      children: [
        {
          id: 'logo-1',
          name: 'Logo',
          type: 'text',
          visible: true,
          locked: false,
          props: {
            text: 'Mi Empresa',
            semantic: 'h2',
          },
          style: {
            weight: 'bold',
            size: 24,
            color: '#1f2937',
          },
        },
        {
          id: 'nav-1',
          name: 'Navigation',
          type: 'stack',
          visible: true,
          locked: false,
          style: {
            display: 'flex',
            flexDirection: 'row',
            gap: 24,
          },
          children: [
            {
              id: 'nav-item-1',
              name: 'Home Link',
              type: 'button',
              visible: true,
              locked: false,
              props: {
                label: 'Inicio',
                variant: 'ghost',
              },
              style: {
                color: '#6b7280',
              },
            },
            {
              id: 'nav-item-2',
              name: 'About Link',
              type: 'button',
              visible: true,
              locked: false,
              props: {
                label: 'Acerca de',
                variant: 'ghost',
              },
              style: {
                color: '#6b7280',
              },
            },
            {
              id: 'nav-item-3',
              name: 'Contact Link',
              type: 'button',
              visible: true,
              locked: false,
              props: {
                label: 'Contacto',
                variant: 'solid',
              },
            },
          ],
        },
      ],
    };
  }

  private createHeroNode(): Node {
    return {
      id: 'hero-1',
      name: 'Hero Section',
      type: 'stack',
      visible: true,
      locked: false,
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        padding: { top: 64, bottom: 64 },
        bg: '#f8fafc',
        radius: 12,
      },
      children: [
        {
          id: 'hero-title-1',
          name: 'Hero Title',
          type: 'text',
          visible: true,
          locked: false,
          props: {
            text: 'Bienvenido a Nuestro Page Builder',
            semantic: 'h1',
          },
          style: {
            size: 48,
            weight: 'bold',
            textAlign: 'center',
            color: '#1f2937',
          },
        },
        {
          id: 'hero-subtitle-1',
          name: 'Hero Subtitle',
          type: 'text',
          visible: true,
          locked: false,
          props: {
            text: 'Crea páginas increíbles con nuestro editor visual estilo Wix y Figma',
            semantic: 'p',
          },
          style: {
            size: 20,
            textAlign: 'center',
            color: '#6b7280',
          },
        },
        {
          id: 'hero-button-1',
          name: 'Hero CTA',
          type: 'button',
          visible: true,
          locked: false,
          props: {
            label: 'Comenzar Ahora',
            variant: 'solid',
          },
          style: {
            padding: { top: 12, bottom: 12, left: 24, right: 24 },
            radius: 8,
          },
          actions: [
            {
              event: 'click',
              type: 'navigate',
              payload: { url: '/signup' },
            },
          ],
        },
      ],
    };
  }

  private createFeaturesNode(): Node {
    return {
      id: 'features-1',
      name: 'Features Section',
      type: 'grid',
      visible: true,
      locked: false,
      style: {
        display: 'grid',
        columns: 3,
        gap: 24,
        padding: { top: 48, bottom: 48 },
      },
      children: [
        this.createFeatureCard(
          'Diseño Visual',
          'Crea diseños increíbles con nuestro editor visual intuitivo',
        ),
        this.createFeatureCard(
          'Responsive',
          'Todas las páginas se adaptan automáticamente a cualquier dispositivo',
        ),
        this.createFeatureCard(
          'Rápido',
          'Construye páginas profesionales en minutos, no horas',
        ),
      ],
    };
  }

  private createFeatureCard(title: string, description: string): Node {
    return {
      id: `feature-${Math.random().toString(36).substr(2, 9)}`,
      name: `Feature: ${title}`,
      type: 'stack',
      visible: true,
      locked: false,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: { top: 24, bottom: 24, left: 24, right: 24 },
        bg: '#ffffff',
        border: { color: '#e5e7eb', width: 1, style: 'solid' },
        radius: 8,
      },
      children: [
        {
          id: `feature-icon-${Math.random().toString(36).substr(2, 9)}`,
          name: 'Feature Icon',
          type: 'icon',
          visible: true,
          locked: false,
          props: {
            name: 'star',
          },
          style: {
            size: 32,
            color: '#3b82f6',
          },
        },
        {
          id: `feature-title-${Math.random().toString(36).substr(2, 9)}`,
          name: 'Feature Title',
          type: 'text',
          visible: true,
          locked: false,
          props: {
            text: title,
            semantic: 'h3',
          },
          style: {
            size: 20,
            weight: 'semibold',
            color: '#1f2937',
          },
        },
        {
          id: `feature-desc-${Math.random().toString(36).substr(2, 9)}`,
          name: 'Feature Description',
          type: 'text',
          visible: true,
          locked: false,
          props: {
            text: description,
            semantic: 'p',
          },
          style: {
            size: 16,
            color: '#6b7280',
          },
        },
      ],
    };
  }

  private createProductsNode(): Node {
    return {
      id: 'products-1',
      name: 'Products Section',
      type: 'stack',
      visible: true,
      locked: false,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        padding: { top: 48, bottom: 48 },
      },
      children: [
        {
          id: 'products-title-1',
          name: 'Products Title',
          type: 'text',
          visible: true,
          locked: false,
          props: {
            text: 'Nuestros Productos',
            semantic: 'h2',
          },
          style: {
            size: 32,
            weight: 'bold',
            textAlign: 'center',
            color: '#1f2937',
          },
        },
        {
          id: 'products-grid-1',
          name: 'Products Grid',
          type: 'grid',
          visible: true,
          locked: false,
          style: {
            display: 'grid',
            columns: 2,
            gap: 24,
          },
          children: [
            this.createProductCard(
              'Producto Premium',
              99.99,
              'https://via.placeholder.com/300x200',
            ),
            this.createProductCard(
              'Producto Estándar',
              49.99,
              'https://via.placeholder.com/300x200',
            ),
          ],
        },
      ],
    };
  }

  private createProductCard(
    name: string,
    price: number,
    imageUrl: string,
  ): Node {
    return {
      id: `product-${Math.random().toString(36).substr(2, 9)}`,
      name: `Product: ${name}`,
      type: 'stack',
      visible: true,
      locked: false,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        bg: '#ffffff',
        border: { color: '#e5e7eb', width: 1, style: 'solid' },
        radius: 8,
        overflow: 'hidden',
      },
      children: [
        {
          id: `product-image-${Math.random().toString(36).substr(2, 9)}`,
          name: 'Product Image',
          type: 'image',
          visible: true,
          locked: false,
          props: {
            src: imageUrl,
            alt: name,
            objectFit: 'cover',
          },
          style: {
            w: '100%',
            h: 200,
          },
        },
        {
          id: `product-info-${Math.random().toString(36).substr(2, 9)}`,
          name: 'Product Info',
          type: 'stack',
          visible: true,
          locked: false,
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: { top: 16, bottom: 16, left: 16, right: 16 },
          },
          children: [
            {
              id: `product-name-${Math.random().toString(36).substr(2, 9)}`,
              name: 'Product Name',
              type: 'text',
              visible: true,
              locked: false,
              props: {
                text: name,
                semantic: 'h3',
              },
              style: {
                size: 18,
                weight: 'semibold',
                color: '#1f2937',
              },
            },
            {
              id: `product-price-${Math.random().toString(36).substr(2, 9)}`,
              name: 'Product Price',
              type: 'text',
              visible: true,
              locked: false,
              props: {
                text: `$${price}`,
                semantic: 'span',
              },
              style: {
                size: 20,
                weight: 'bold',
                color: '#059669',
              },
            },
            {
              id: `product-button-${Math.random().toString(36).substr(2, 9)}`,
              name: 'Product Button',
              type: 'button',
              visible: true,
              locked: false,
              props: {
                label: 'Comprar',
                variant: 'solid',
              },
              style: {
                margin: { top: 8 },
              },
            },
          ],
        },
      ],
    };
  }

  private createFooterNode(): Node {
    return {
      id: 'footer-1',
      name: 'Footer',
      type: 'stack',
      visible: true,
      locked: false,
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        padding: { top: 32, bottom: 32 },
        bg: '#1f2937',
        color: '#ffffff',
      },
      children: [
        {
          id: 'footer-text-1',
          name: 'Footer Text',
          type: 'text',
          visible: true,
          locked: false,
          props: {
            text: '© 2024 Mi Empresa. Todos los derechos reservados.',
            semantic: 'p',
          },
          style: {
            size: 14,
            textAlign: 'center',
            color: '#9ca3af',
          },
        },
      ],
    };
  }
}
