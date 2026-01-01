import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { SportEffects } from './components/sport/store/effects';
import {
  sportFeatureKey,
  sportReducer,
} from './components/sport/store/reducers';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ROUTER_FEATURE_KEY } from './router/router.selector';
import { BreadcrumbEffects } from './store/breadcrumbs/breadcrumbs.effects';
import {
  breadcrumbFeatureKey,
  breadcrumbReducer,
} from './store/breadcrumbs/breadcrumbs.reducers';
import { uiFeatureKey, uiReducer } from './store/ui/ui.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      }),
      withComponentInputBinding(),
    ),
    provideHttpClient(withInterceptors([AuthInterceptor]), withFetch()),
    importProvidersFrom(),
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
    NG_EVENT_PLUGINS,
  ],
};
