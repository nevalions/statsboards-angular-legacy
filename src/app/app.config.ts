import { provideAnimations } from '@angular/platform-browser/animations';
import { TuiRootModule } from '@taiga-ui/core';
import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { tuiInputNumberOptionsProvider } from '@taiga-ui/kit';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import {
  sportFeatureKey,
  sportReducer,
} from './components/sport/store/reducers';
import { SportEffects } from './components/sport/store/effects';
import { ROUTER_FEATURE_KEY } from './router/router.selector';
import {
  breadcrumbFeatureKey,
  breadcrumbReducer,
} from './store/breadcrumbs/breadcrumbs.reducers';
import { BreadcrumbEffects } from './store/breadcrumbs/breadcrumbs.effects';
import { uiFeatureKey, uiReducer } from './store/ui/ui.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    tuiInputNumberOptionsProvider({
      decimal: 'never',
      step: 1,
    }),
    provideAnimations(),
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      }),
      withComponentInputBinding(),
    ),
    provideHttpClient(withInterceptors([AuthInterceptor]), withFetch()),
    importProvidersFrom(TuiRootModule),
    provideStore({ router: routerReducer }),
    provideEffects(),
    provideRouterStore(),
    provideState(ROUTER_FEATURE_KEY, routerReducer),
    provideState(uiFeatureKey, uiReducer),
    provideState(breadcrumbFeatureKey, breadcrumbReducer),
    provideState(sportFeatureKey, sportReducer),
    provideEffects(SportEffects, BreadcrumbEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
};
