import { provideAnimations } from "@angular/platform-browser/animations";
import { TuiRootModule } from "@taiga-ui/core";
import {ApplicationConfig, importProvidersFrom, inject} from '@angular/core';
import {
  NavigationError,
  provideRouter,
  withComponentInputBinding,
  withNavigationErrorHandler,
  withRouterConfig
} from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {AuthInterceptor} from "./interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'}
      ),
      withComponentInputBinding()),
      provideHttpClient(
        withInterceptors(
          [AuthInterceptor]
        ),
        withFetch()
    ),
    importProvidersFrom(TuiRootModule),
  ]
};
