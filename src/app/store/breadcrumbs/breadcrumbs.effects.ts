import { concatLatestFrom } from '@ngrx/operators';import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { breadcrumbActions } from './breadcrumbs.actions';
import { map, of, switchMap, withLatestFrom } from 'rxjs';

import { Store } from '@ngrx/store';
import {
  ROUTER_NAVIGATION,
  routerNavigatedAction,
  RouterNavigationAction,
} from '@ngrx/router-store';
import { AppState } from '../appstate';
import { Breadcrumb } from '../../type/base.type';
import { getAllRouteParameters } from '../../router/router.selector';

@Injectable()
export class BreadcrumbEffects {
  updateBreadcrumbs$ = createEffect(
    () =>
      { return this.actions$.pipe(
        ofType(routerNavigatedAction),
        concatLatestFrom(
          () => this.store.select((state) => state.breadcrumb.breadcrumbs),
        ),
        map(([action, currentBreadcrumbs]) => {
          let route = action.payload;
          let routeConfig = route.routerState.root.routeConfig;
          let params = getAllRouteParameters(route.routerState);
          let url = route.event.url;
          // console.log('ROUTE', route);
          let breadcrumbs: Breadcrumb[] = [];

          let sportsId = params.get('sportsId');
          let seasonId = params.get('seasonId');
          let tournamentId = params.get('tournament_id');
          let matchId = params.get('matchId');
          // console.log('PARAMS', params);
          // console.log('CONFIG', routeConfig);
          // console.log('PATH', routePath);

          // console.log('URL', route.event.url);
          if (url) {
            const level = url
              .split('/')
              .filter((segment) => segment.length > 0).length;

            let urlWithoutNumbers = url.replace(/\/\d+$/, '');

            const segments = urlWithoutNumbers
              .split('/')
              .filter((segment) => segment.length > 0);
            const lastSegment = segments[segments.length - 1];
            // console.log('lastSegment', lastSegment);

            if (lastSegment) {
              const caption = lastSegment.match(/[a-zA-Z]+/);
              // console.log('CAPTION', caption);
              if (caption) {
                const breadcrumb = {
                  caption: caption.toString().toUpperCase(),
                  routerLink: url,
                  level: level,
                };
                breadcrumbs.push(breadcrumb);
              }
            } else {
              // console.log(lastSegment, urlWithoutNumbers);
              const breadcrumb = {
                caption: 'HOME',
                routerLink: url,
                level: level,
              };
              breadcrumbs.push(breadcrumb);
            }
          }

          // console.log(breadcrumbs);
          return breadcrumbActions.breadcrumbsUpdated({ breadcrumbs });
        }),
      ) },
    { functional: false },
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
  ) {
    this.store.dispatch(breadcrumbActions.loadStateFromLocalStorage());
  }
}
