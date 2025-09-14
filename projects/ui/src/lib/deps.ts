import { inject, Injectable, LOCALE_ID } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { from, shareReplay } from 'rxjs';

type ClassValue =
  | string
  | number
  | bigint
  | boolean
  | Record<string, unknown>
  | null
  | undefined;
type ClsInput = ClassValue | ClassValue[];

const defaultCls = (...inputs: ClsInput[]) => inputs.flat().join(' ');

@Injectable({
  providedIn: 'root',
})
export class Deps {
  private readonly locale = inject(LOCALE_ID);

  readonly uuid = toSignal(
    from(
      import('uuid').catch((error) => {
        console.error('Failed to load uuid module:');
        console.error(error);

        return null;
      }),
    ).pipe(shareReplay({ refCount: true, bufferSize: 1 })),
    { initialValue: null },
  );

  readonly luxon = toSignal(
    from(
      import('luxon')
        .then((module) => {
          module.Settings.defaultLocale = this.locale;

          return module;
        })
        .catch((error) => {
          console.error('Failed to load luxon module:');
          console.error(error);

          return null;
        }),
    ).pipe(shareReplay({ refCount: true, bufferSize: 1 })),
    { initialValue: null },
  );

  readonly dexie = toSignal(
    from(
      import('dexie').catch((error) => {
        console.error('Failed to load dexie module:');
        console.error(error);

        return null;
      }),
    ).pipe(shareReplay({ refCount: true, bufferSize: 1 })),
    { initialValue: null },
  );

  readonly cls = toSignal(
    from(
      Promise.all([
        import('clsx').catch((error) => {
          console.error('Failed to load clsx module:');
          console.error(error);

          return null;
        }),
        import('tailwind-merge').catch((error) => {
          console.error('Failed to load tailwind-merge module:');
          console.error(error);

          return null;
        }),
      ]).then(([clsxModule, twMergeModule]) => {
        if (!clsxModule || !twMergeModule) {
          return defaultCls;
        }

        return (...inputs: ClsInput[]) =>
          twMergeModule.twMerge(clsxModule.clsx(...inputs));
      }),
    ).pipe(shareReplay({ refCount: true, bufferSize: 1 })),
    {
      initialValue: defaultCls,
    },
  );

  readonly luxonObservable = toObservable(this.luxon);
  readonly dexieObservable = toObservable(this.dexie);
}
