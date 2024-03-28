import { Actions, createEffect, ofType } from '@ngrx/effects';
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
      this.actions$.pipe(
        ofType(routerNavigatedAction),
        withLatestFrom(
          this.store.select((state) => state.breadcrumb.breadcrumbs),
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

          // if (route && routeConfig && routePath) {
          //   // console.log(route);
          //   if (routePath.includes(':sport_id')) {
          //     routePath = routePath.replace(':sport_id', sportsId);
          //   }
          //   if (routePath.includes(':season_id')) {
          //     routePath = routePath.replace(':season_id', seasonId);
          //   }
          //   if (routePath.includes(':tournament_id')) {
          //     routePath = routePath.replace(':tournament_id', tournamentId);
          //   }
          //   if (routePath.includes(':match_id')) {
          //     routePath = routePath.replace(':match_id', matchId);
          //   }
          //
          //   const level = routePath
          //     .split('/')
          //     .filter((segment: string) => segment.length > 0).length;
          //
          //   console.log('PATH & LEVEL', routePath, level);
          //   console.log('ROUTE & DATA', routeConfig, routeConfig.data);
          //
          //   if (routeConfig.data) {
          //     const breadcrumb = {
          //       caption: routeConfig.data['breadcrumb'].caption,
          //       // routerLink: path,
          //       routerLink: routeConfig.data['breadcrumb'].routerLink,
          //       level: level,
          //     };
          //     console.log(routePath);
          //     // console.log(breadcrumb);
          //     breadcrumbs.push(breadcrumb);
          //   }
          // }
          console.log(breadcrumbs);
          return breadcrumbActions.breadcrumbsUpdated({ breadcrumbs });
        }),
      ),
    { functional: false },
  );

  // updateBreadcrumbs$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(ROUTER_NAVIGATION),
  //       withLatestFrom(
  //         this.store.select((state) => state.breadcrumb.breadcrumbs),
  //       ),
  //       map(([action, currentBreadcrumbs]) => {
  //         let route = (action as RouterNavigationAction).payload.routerState
  //           .root;
  //         console.log('ROUTE', route);
  //         let breadcrumbs: Breadcrumb[] = [];
  //         while (route.firstChild) route = route.firstChild;
  //         const params = route.params;
  //         const sportsId = params['sport_id'];
  //         const seasonId = params['season_id'];
  //         const tournamentId = params['tournament_id'];
  //         const matchId = params['match_id'];
  //         console.log('PARAMS', params);
  //
  //         if (
  //           route &&
  //           route.routeConfig &&
  //           route.routeConfig.path &&
  //           route.params &&
  //           route.data
  //         ) {
  //           // console.log(route);
  //           let path = route.routeConfig.path;
  //           if (path.includes(':sport_id')) {
  //             path = path.replace(':sport_id', sportsId);
  //           }
  //           if (path.includes(':season_id')) {
  //             path = path.replace(':season_id', seasonId);
  //           }
  //           if (path.includes(':tournament_id')) {
  //             path = path.replace(':tournament_id', tournamentId);
  //           }
  //           if (path.includes(':match_id')) {
  //             path = path.replace(':match_id', matchId);
  //           }
  //
  //           const level = path
  //             .split('/')
  //             .filter((segment: string) => segment.length > 0).length;
  //
  //           const breadcrumb = {
  //             caption: route.data['breadcrumb'].caption,
  //             // routerLink: path,
  //             routerLink: route.data['breadcrumb'].routerLink,
  //             level: level,
  //           };
  //           console.log(path);
  //           // console.log(breadcrumb);
  //           breadcrumbs.push(breadcrumb);
  //         }
  //         console.log(breadcrumbs);
  //         return breadcrumbActions.breadcrumbsUpdated({ breadcrumbs });
  //       }),
  //     ),
  //   { functional: false },
  // );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
  ) {
    this.store.dispatch(breadcrumbActions.loadStateFromLocalStorage());
  }
}
