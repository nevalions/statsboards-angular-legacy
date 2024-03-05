import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  RoutesRecognized,
  Router,
} from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Breadcrumb } from '../type/base.type'; // Replace with your actual Breadcrumb type
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  constructor(private router: Router) {}

  getBreadcrumbs(): Observable<Breadcrumb> {
    return this.router.events.pipe(
      filter(
        (event): event is RoutesRecognized => event instanceof RoutesRecognized,
      ),
      map((event: RoutesRecognized) => {
        let route = event.state.root.firstChild;
        let breadcrumb: Breadcrumb = route?.data['breadcrumb'];

        while (route?.firstChild) {
          route = route.firstChild;

          if (route?.data['breadcrumb']) {
            breadcrumb = route.data['breadcrumb'];
          }
        }

        return breadcrumb;
      }),
    );
  }
}
