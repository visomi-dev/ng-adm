import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { Deps } from '../deps';

@Component({
  selector: 'lib-page-hero',
  imports: [RouterLink, ButtonModule],
  templateUrl: './page-hero.html',
  styleUrl: './page-hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: /* tw */ 'block',
  },
})
export class PageHero {
  readonly deps = inject(Deps);

  readonly backgroundImage = input<string>();
  readonly backgroundColor = input<string>();
  readonly title = input<string>();
  readonly description = input<string>();
  readonly callToActionText = input<string>();
  readonly callToActionTo = input<string>();
  readonly size = input<'cover' | 'contain'>('cover');
  readonly leftImage = input<string>();
  readonly leftImageAlt = input<string>();
  readonly rightImage = input<string>();
  readonly rightImageAlt = input<string>();

  readonly styleComputed = computed(() => {
    const backgroundImage = this.backgroundImage();
    const backgroundColor = this.backgroundColor();

    if (backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: this.size(),
        backgroundColor: backgroundColor,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      };
    }

    return {
      backgroundColor: backgroundColor,
    };
  });

  readonly classComputed = computed(() => {
    const cls = this.deps.cls();

    const size = this.size();

    return cls([
      size === 'cover'
        ? /* tw */ 'h-svh w-full md:py-24 md:px-6 px-4 py-12'
        : /* tw */ 'h-auto p-8',
    ]);
  });
}
