import { Component, signal } from '@angular/core';
import { type PageSchema, type Node } from '@ng-adm/core';
import { PageRenderer } from '@ng-adm/ui';

@Component({
  selector: 'app-landing',
  imports: [PageRenderer],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  readonly examplePage = signal<PageSchema>(this.createPastryShopPage());

  private createPastryShopPage(): PageSchema {
    return {
      slug: 'pastry-shop',
      locale: 'es',
      status: 'published',
      seo: {
        title: 'El Maná del Día - Dulces Creaciones, Sabor Celestial',
        description:
          'Hechos a mano con amor y horneados frescos todos los días para deleitar tu paladar. Cada bocado es una experiencia única.',
        canonical: 'https://elmanadeldia.com',
        og: {
          image:
            'https://placehold.co/1200x630/F8DDE6/9D3C5F?text=El+Maná+del+Día',
          url: 'https://elmanadeldia.com',
          type: 'website',
        },
      },
      data: {
        user: { name: 'Cliente' },
        products: [
          {
            id: 1,
            name: 'Pastel de Fresa Celestial',
            description:
              'Bizcocho esponjoso con capas de crema de fresa fresca y un glaseado delicado.',
            price: '$350.00',
            image:
              'https://placehold.co/400x400/F8DDE6/9D3C5F?text=Pastel+de+Fresa',
          },
          {
            id: 2,
            name: 'Macarons de Ensueño',
            description:
              'Una docena de macarons surtidos con sabores como pistacho, frambuesa y chocolate.',
            price: '$280.00',
            image: 'https://placehold.co/400x400/F8DDE6/9D3C5F?text=Macarons',
          },
          {
            id: 3,
            name: 'Tarta de Chocolate Intenso',
            description:
              'Ganache de chocolate oscuro sobre una base de galleta crujiente. Para verdaderos amantes del cacao.',
            price: '$420.00',
            image:
              'https://placehold.co/400x400/F8DDE6/9D3C5F?text=Tarta+de+Chocolate',
          },
          {
            id: 4,
            name: 'Cupcakes de Vainilla Rosa',
            description:
              'Tiernos cupcakes de vainilla con un frosting de crema de mantequilla rosa y perlas de azúcar.',
            price: '$250.00',
            image: 'https://placehold.co/400x400/F8DDE6/9D3C5F?text=Cupcakes',
          },
        ],
        testimonials: [
          {
            name: 'Ana Sofía R.',
            quote:
              'Los postres más deliciosos y hermosos que he probado. El pastel de fresa fue la estrella de nuestra celebración. ¡Totalmente recomendado!',
          },
          {
            name: 'Carlos Mendoza',
            quote:
              '¡Calidad increíble! Se nota la pasión y el cuidado en cada detalle. Los macarons son simplemente perfectos, un verdadero lujo.',
          },
          {
            name: 'Lucía Fernández',
            quote:
              'El servicio es excelente y los postres son de otro mundo. La tarta de chocolate es una obra de arte. Mi nueva pastelería favorita.',
          },
        ],
        currentYear: new Date().getFullYear(),
      },
      root: this.createPastryShopRootNode(),
      usedComponents: ['hero-section', 'product-grid', 'testimonials'],
    };
  }

  private createPastryShopRootNode(): Node {
    return {
      id: 'root-1',
      name: 'Root Container',
      type: 'stack',
      visible: true,
      locked: false,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
        minH: '100vh',
        bg: '#FDF7F8',
        font: 'sans',
      },
      children: [
        this.createHeaderNode(),
        this.createHeroNode(),
        this.createProductsNode(),
        this.createAboutNode(),
        this.createTestimonialsNode(),
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
        padding: { top: 16, bottom: 16, left: 24, right: 24 },
        bg: 'rgba(255, 255, 255, 0.8)',
        shadow: 'sm',
      },
      children: [
        {
          id: 'logo-1',
          name: 'Logo',
          type: 'text',
          visible: true,
          locked: false,
          props: {
            text: 'El Maná del Día',
            semantic: 'h1',
          },
          style: {
            weight: 'bold',
            size: 24,
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
            gap: 32,
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
              style: {},
            },
            {
              id: 'nav-item-2',
              name: 'Menu Link',
              type: 'button',
              visible: true,
              locked: false,
              props: {
                label: 'Menú',
                variant: 'ghost',
              },
              style: {},
            },
            {
              id: 'nav-item-3',
              name: 'About Link',
              type: 'button',
              visible: true,
              locked: false,
              props: {
                label: 'Sobre Nosotros',
                variant: 'ghost',
              },
              style: {},
            },
            {
              id: 'nav-item-4',
              name: 'Contact Link',
              type: 'button',
              visible: true,
              locked: false,
              props: {
                label: 'Contacto',
                variant: 'ghost',
              },
              style: {},
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 32,
        padding: { top: 96, bottom: 96, left: 24, right: 24 },
        minH: '80vh',
      },
      children: [
        {
          id: 'hero-content-1',
          name: 'Hero Content',
          type: 'stack',
          visible: true,
          locked: false,
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
          },
          children: [
            {
              id: 'hero-title-1',
              name: 'Hero Title',
              type: 'text',
              visible: true,
              locked: false,
              props: {
                text: 'Dulces Creaciones, Sabor Celestial',
                semantic: 'h1',
              },
              style: {
                size: 48,
                weight: 'bold',
                font: 'serif',
                lineHeight: 1.2,
              },
            },
            {
              id: 'hero-subtitle-1',
              name: 'Hero Subtitle',
              type: 'text',
              visible: true,
              locked: false,
              props: {
                text: 'Hechos a mano con amor y horneados frescos todos los días para deleitar tu paladar. Cada bocado es una experiencia única.',
                semantic: 'p',
              },
              style: {
                size: 18,
                lineHeight: 1.6,
              },
            },
            {
              id: 'hero-button-1',
              name: 'Hero CTA',
              type: 'button',
              visible: true,
              locked: false,
              props: {
                label: 'Explora el Menú',
                variant: 'solid',
              },
              style: {
                padding: { top: 12, bottom: 12, left: 32, right: 32 },
                radius: 9999,
                bg: '#B94A74',
                weight: 'bold',
                shadow: 'lg',
                w: 'fit',
              },
              actions: [
                {
                  event: 'click',
                  type: 'navigate',
                  payload: { url: '#menu' },
                },
              ],
            },
          ],
        },
        {
          id: 'hero-image-1',
          name: 'Hero Image',
          type: 'image',
          visible: true,
          locked: false,
          props: {
            src: 'https://placehold.co/600x600/F8DDE6/9D3C5F?text=Postre+Exquisito',
            alt: 'Un postre exquisito y delicado',
          },
          style: {
            w: 600,
            h: 600,
            radius: 9999,
            shadow: '2xl',
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
        gap: 48,
        padding: { top: 80, bottom: 80, left: 24, right: 24 },
        bg: '#ffffff',
      },
      children: [
        {
          id: 'products-header-1',
          name: 'Products Header',
          type: 'stack',
          visible: true,
          locked: false,
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'center',
            textAlign: 'center',
          },
          children: [
            {
              id: 'products-title-1',
              name: 'Products Title',
              type: 'text',
              visible: true,
              locked: false,
              props: {
                text: 'Nuestros Favoritos',
                semantic: 'h2',
              },
              style: {
                size: 36,
                weight: 'bold',
                font: 'serif',
              },
            },
            {
              id: 'products-subtitle-1',
              name: 'Products Subtitle',
              type: 'text',
              visible: true,
              locked: false,
              props: {
                text: 'Una selección de nuestras creaciones más populares, amadas por todos nuestros clientes.',
                semantic: 'p',
              },
              style: {
                size: 16,
                maxW: 512,
              },
            },
          ],
        },
        {
          id: 'products-grid-1',
          name: 'Products Grid',
          type: 'grid',
          visible: true,
          locked: false,
          style: {
            display: 'grid',
            columns: 4,
            gap: 32,
          },
          children: this.createProductCards(),
        },
      ],
    };
  }

  private createProductCards(): Node[] {
    const products = [
      {
        name: 'Pastel de Fresa Celestial',
        description:
          'Bizcocho esponjoso con capas de crema de fresa fresca y un glaseado delicado.',
        price: '$350.00',
        image:
          'https://placehold.co/400x400/F8DDE6/9D3C5F?text=Pastel+de+Fresa',
      },
      {
        name: 'Macarons de Ensueño',
        description:
          'Una docena de macarons surtidos con sabores como pistacho, frambuesa y chocolate.',
        price: '$280.00',
        image: 'https://placehold.co/400x400/F8DDE6/9D3C5F?text=Macarons',
      },
      {
        name: 'Tarta de Chocolate Intenso',
        description:
          'Ganache de chocolate oscuro sobre una base de galleta crujiente. Para verdaderos amantes del cacao.',
        price: '$420.00',
        image:
          'https://placehold.co/400x400/F8DDE6/9D3C5F?text=Tarta+de+Chocolate',
      },
      {
        name: 'Cupcakes de Vainilla Rosa',
        description:
          'Tiernos cupcakes de vainilla con un frosting de crema de mantequilla rosa y perlas de azúcar.',
        price: '$250.00',
        image: 'https://placehold.co/400x400/F8DDE6/9D3C5F?text=Cupcakes',
      },
    ];

    return products.map((product, index) => ({
      id: `product-${index + 1}`,
      name: `Product: ${product.name}`,
      type: 'stack',
      visible: true,
      locked: false,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        bg: '#ffffff',
        radius: 8,
        shadow: 'lg',
        overflow: 'hidden',
      },
      children: [
        {
          id: `product-image-${index + 1}`,
          name: 'Product Image',
          type: 'image',
          visible: true,
          locked: false,
          props: {
            src: product.image,
            alt: product.name,
          },
          style: {
            w: 'full',
            h: 224,
          },
        },
        {
          id: `product-content-${index + 1}`,
          name: 'Product Content',
          type: 'stack',
          visible: true,
          locked: false,
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            padding: { top: 24, bottom: 24, left: 24, right: 24 },
          },
          children: [
            {
              id: `product-title-${index + 1}`,
              name: 'Product Title',
              type: 'text',
              visible: true,
              locked: false,
              props: {
                text: product.name,
                semantic: 'h3',
              },
              style: {
                size: 20,
                weight: 'semibold',
              },
            },
            {
              id: `product-description-${index + 1}`,
              name: 'Product Description',
              type: 'text',
              visible: true,
              locked: false,
              props: {
                text: product.description,
                semantic: 'p',
              },
              style: {
                size: 14,
                lineHeight: 1.5,
              },
            },
            {
              id: `product-price-${index + 1}`,
              name: 'Product Price',
              type: 'text',
              visible: true,
              locked: false,
              props: {
                text: product.price,
                semantic: 'span',
              },
              style: {
                size: 18,
                weight: 'bold',
              },
            },
          ],
        },
      ],
    }));
  }

  private createAboutNode(): Node {
    return {
      id: 'about-1',
      name: 'About Section',
      type: 'stack',
      visible: true,
      locked: false,
      style: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 48,
        padding: { top: 80, bottom: 80, left: 24, right: 24 },
      },
      children: [
        {
          id: 'about-image-1',
          name: 'About Image',
          type: 'image',
          visible: true,
          locked: false,
          props: {
            src: 'https://placehold.co/600x700/F8DDE6/9D3C5F?text=Nuestra+Pasión',
            alt: 'Ingredientes frescos y de alta calidad para postres',
          },
          style: {
            w: 600,
            h: 700,
            radius: 8,
            shadow: 'xl',
          },
        },
        {
          id: 'about-content-1',
          name: 'About Content',
          type: 'stack',
          visible: true,
          locked: false,
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          },
          children: [
            {
              id: 'about-title-1',
              name: 'About Title',
              type: 'text',
              visible: true,
              locked: false,
              props: {
                text: 'La Pasión en Cada Bocado',
                semantic: 'h2',
              },
              style: {
                size: 36,
                weight: 'bold',
                font: 'serif',
              },
            },
            {
              id: 'about-description-1',
              name: 'About Description',
              type: 'text',
              visible: true,
              locked: false,
              props: {
                text: 'En "El Maná del Día", creemos que los postres son más que un capricho; son una experiencia. Usamos solo los ingredientes más finos y frescos, combinando técnicas tradicionales con un toque de innovación para crear delicias que no solo se ven hermosas, sino que saben a gloria.',
                semantic: 'p',
              },
              style: {
                size: 16,
                lineHeight: 1.6,
              },
            },
            {
              id: 'about-description-2',
              name: 'About Description 2',
              type: 'text',
              visible: true,
              locked: false,
              props: {
                text: 'Nuestra misión es endulzar tus días y celebrar tus momentos especiales con postres inolvidables.',
                semantic: 'p',
              },
              style: {
                size: 16,
                lineHeight: 1.6,
              },
            },
          ],
        },
      ],
    };
  }

  private createTestimonialsNode(): Node {
    return {
      id: 'testimonials-1',
      name: 'Testimonials Section',
      type: 'stack',
      visible: true,
      locked: false,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 48,
        padding: { top: 80, bottom: 80, left: 24, right: 24 },
        bg: '#ffffff',
      },
      children: [
        {
          id: 'testimonials-title-1',
          name: 'Testimonials Title',
          type: 'text',
          visible: true,
          locked: false,
          props: {
            text: 'Lo Que Dicen Nuestros Clientes',
            semantic: 'h2',
          },
          style: {
            size: 36,
            weight: 'bold',
            font: 'serif',
            textAlign: 'center',
          },
        },
        {
          id: 'testimonials-grid-1',
          name: 'Testimonials Grid',
          type: 'grid',
          visible: true,
          locked: false,
          style: {
            display: 'grid',
            columns: 3,
            gap: 32,
          },
          children: this.createTestimonialCards(),
        },
      ],
    };
  }

  private createTestimonialCards(): Node[] {
    const testimonials = [
      {
        name: 'Ana Sofía R.',
        quote:
          'Los postres más deliciosos y hermosos que he probado. El pastel de fresa fue la estrella de nuestra celebración. ¡Totalmente recomendado!',
      },
      {
        name: 'Carlos Mendoza',
        quote:
          '¡Calidad increíble! Se nota la pasión y el cuidado en cada detalle. Los macarons son simplemente perfectos, un verdadero lujo.',
      },
      {
        name: 'Lucía Fernández',
        quote:
          'El servicio es excelente y los postres son de otro mundo. La tarta de chocolate es una obra de arte. Mi nueva pastelería favorita.',
      },
    ];

    return testimonials.map((testimonial, index) => ({
      id: `testimonial-${index + 1}`,
      name: `Testimonial: ${testimonial.name}`,
      type: 'stack',
      visible: true,
      locked: false,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: { top: 32, bottom: 32, left: 32, right: 32 },
        bg: '#FDF7F8',
        radius: 12,
        shadow: 'md',
      },
      children: [
        {
          id: `testimonial-quote-${index + 1}`,
          name: 'Testimonial Quote',
          type: 'text',
          visible: true,
          locked: false,
          props: {
            text: `"${testimonial.quote}"`,
            semantic: 'p',
          },
          style: {
            size: 16,
            lineHeight: 1.6,
          },
        },
        {
          id: `testimonial-author-${index + 1}`,
          name: 'Testimonial Author',
          type: 'text',
          visible: true,
          locked: false,
          props: {
            text: `- ${testimonial.name}`,
            semantic: 'p',
          },
          style: {
            size: 16,
            weight: 'bold',
          },
        },
      ],
    }));
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
        gap: 32,
        padding: { top: 48, bottom: 48, left: 24, right: 24 },
        bg: '#5D2339',
      },
      children: [
        {
          id: 'footer-content-1',
          name: 'Footer Content',
          type: 'grid',
          visible: true,
          locked: false,
          style: {
            display: 'grid',
            columns: 3,
            gap: 32,
          },
          children: [
            {
              id: 'footer-brand-1',
              name: 'Footer Brand',
              type: 'stack',
              visible: true,
              locked: false,
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              },
              children: [
                {
                  id: 'footer-brand-title-1',
                  name: 'Footer Brand Title',
                  type: 'text',
                  visible: true,
                  locked: false,
                  props: {
                    text: 'El Maná del Día',
                    semantic: 'h3',
                  },
                  style: {
                    size: 20,
                    weight: 'bold',
                  },
                },
                {
                  id: 'footer-brand-description-1',
                  name: 'Footer Brand Description',
                  type: 'text',
                  visible: true,
                  locked: false,
                  props: {
                    text: 'Endulzando tus momentos desde 2024.',
                    semantic: 'p',
                  },
                  style: {
                    size: 14,
                  },
                },
              ],
            },
            {
              id: 'footer-contact-1',
              name: 'Footer Contact',
              type: 'stack',
              visible: true,
              locked: false,
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              },
              children: [
                {
                  id: 'footer-contact-title-1',
                  name: 'Footer Contact Title',
                  type: 'text',
                  visible: true,
                  locked: false,
                  props: {
                    text: 'Contacto',
                    semantic: 'h3',
                  },
                  style: {
                    size: 20,
                    weight: 'bold',
                  },
                },
                {
                  id: 'footer-contact-email-1',
                  name: 'Footer Contact Email',
                  type: 'text',
                  visible: true,
                  locked: false,
                  props: {
                    text: 'Email: hola@elmanadeldia.com',
                    semantic: 'p',
                  },
                  style: {
                    size: 14,
                  },
                },
                {
                  id: 'footer-contact-phone-1',
                  name: 'Footer Contact Phone',
                  type: 'text',
                  visible: true,
                  locked: false,
                  props: {
                    text: 'Teléfono: (55) 1234-5678',
                    semantic: 'p',
                  },
                  style: {
                    size: 14,
                  },
                },
              ],
            },
            {
              id: 'footer-social-1',
              name: 'Footer Social',
              type: 'stack',
              visible: true,
              locked: false,
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              },
              children: [
                {
                  id: 'footer-social-title-1',
                  name: 'Footer Social Title',
                  type: 'text',
                  visible: true,
                  locked: false,
                  props: {
                    text: 'Síguenos',
                    semantic: 'h3',
                  },
                  style: {
                    size: 20,
                    weight: 'bold',
                  },
                },
                {
                  id: 'footer-social-links-1',
                  name: 'Footer Social Links',
                  type: 'stack',
                  visible: true,
                  locked: false,
                  style: {
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 16,
                  },
                  children: [
                    {
                      id: 'footer-social-facebook-1',
                      name: 'Facebook Link',
                      type: 'button',
                      visible: true,
                      locked: false,
                      props: {
                        label: 'Facebook',
                        variant: 'ghost',
                      },
                      style: {
                        padding: { top: 8, bottom: 8, left: 8, right: 8 },
                      },
                    },
                    {
                      id: 'footer-social-instagram-1',
                      name: 'Instagram Link',
                      type: 'button',
                      visible: true,
                      locked: false,
                      props: {
                        label: 'Instagram',
                        variant: 'ghost',
                      },
                      style: {
                        padding: { top: 8, bottom: 8, left: 8, right: 8 },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'footer-copyright-1',
          name: 'Footer Copyright',
          type: 'text',
          visible: true,
          locked: false,
          props: {
            text: '© 2024 El Maná del Día. Todos los derechos reservados.',
            semantic: 'p',
          },
          style: {
            size: 14,
            textAlign: 'center',
            padding: { top: 32, bottom: 0, left: 0, right: 0 },
            border: { width: 1, style: 'solid' },
          },
        },
      ],
    };
  }
}
