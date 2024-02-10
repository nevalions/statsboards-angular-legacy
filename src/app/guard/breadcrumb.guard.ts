import { inject, Injectable } from '@angular/core';
import {
  UrlTree,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { BreadcrumbService, Breadcrumb } from '../services/breadcrub.service';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbGuard {
  breadcrumbService = inject(BreadcrumbService);
  router = inject(Router);

  public canActivate() {
    return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      const breadcrumbs: Breadcrumb[] = route.data['breadcrumbs'];

      if (!breadcrumbs || breadcrumbs.length === 0) {
        this.breadcrumbService.setBreadcrumbs([]);
        return true;
      }

      const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];

      if (!lastBreadcrumb.routerLink && lastBreadcrumb.caption !== 'Home') {
        lastBreadcrumb.routerLink = state.url; // Change this line
      }

      this.breadcrumbService.setBreadcrumbs(breadcrumbs);

      return true;
    };
  }
}
