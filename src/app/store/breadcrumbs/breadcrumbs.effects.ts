import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { breadcrumbActions } from './breadcrumbs.actions';
import { map, withLatestFrom } from 'rxjs';

import { Store } from '@ngrx/store';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { AppState } from '../appstate';
import { Breadcrumb } from '../../type/base.type';

@Injectable()
export class BreadcrumbEffects {
  updateBreadcrumbs$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        withLatestFrom(
          this.store.select((state) => state.breadcrumb.breadcrumbs),
        ),
        map(([action, currentBreadcrumbs]) => {
          let route = (action as RouterNavigationAction).payload.routerState
            .root;
          console.log(route);
          let breadcrumbs: Breadcrumb[] = [];
          while (route.firstChild) route = route.firstChild;
          const params = route.params;
          const sportsId = params['sport_id'];
          const seasonId = params['season_id'];
          const tournamentId = params['tournament_id'];
          const matchId = params['match_id'];

          if (
            route &&
            route.routeConfig &&
            route.routeConfig.path &&
            route.params &&
            route.data
          ) {
            console.log(route);
            let path = route.routeConfig.path;
            if (path.includes(':sport_id')) {
              path = path.replace(':sport_id', sportsId);
            }
            if (path.includes(':season_id')) {
              path = path.replace(':season_id', seasonId);
            }
            if (path.includes(':tournament_id')) {
              path = path.replace(':tournament_id', tournamentId);
            }
            if (path.includes(':match_id')) {
              path = path.replace(':match_id', matchId);
            }

            const level = path
              .split('/')
              .filter((segment: string) => segment.length > 0).length;

            const breadcrumb = {
              caption: route.data['breadcrumb'].caption,
              routerLink: path,
              level: level,
            };
            console.log(path);
            // console.log(breadcrumb);
            breadcrumbs.push(breadcrumb);
          }
          console.log(breadcrumbs);
          return breadcrumbActions.breadcrumbsUpdated({ breadcrumbs });
        }),
      ),
    { functional: false },
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
  ) {}
}
