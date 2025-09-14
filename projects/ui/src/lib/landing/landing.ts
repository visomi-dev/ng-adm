import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-landing',
  imports: [ButtonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
  host: {
    class: /* tw */ 'w-full h-full',
  },
})
export class Landing {
  isMenuOpen = signal(false);

  products = [
    {
      name: 'Pastel de Fresa Celestial',
      description:
        'Bizcocho esponjoso con capas de crema de fresa fresca y un glaseado delicado.',
      price: '$350.00',
      image: 'https://placehold.co/400x400/F8DDE6/9D3C5F?text=Pastel+de+Fresa',
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

  testimonials = [
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

  currentYear = new Date().getFullYear();

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }
}
