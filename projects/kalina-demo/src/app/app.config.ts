import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { KN_BOTTOM_SHEET_DEFAULT_CONFIG } from 'kalina';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: KN_BOTTOM_SHEET_DEFAULT_CONFIG,
      useValue: {
        hasBackdrop: true,
        backdropClass: 'kn-bottom-sheet-backdrop--demo',
        panelClass: 'kn-bottom-sheet-panel--demo',
      },
    },
  ],
};
