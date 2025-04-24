import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import en from '../public/assets/i18n/en.json';


export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function syncEnFactory(translate: TranslateService) {
  return () => {
    // load the JSON into ngx-translate’s store
    translate.setTranslation('en', en, true);
    translate.setDefaultLang('en');
    // note: we don’t call translate.use('en') here because our JSON is already in memory
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: syncEnFactory,
      deps: [TranslateService],
      multi: true
    }
  ]
};
