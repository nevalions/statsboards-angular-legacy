import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  RouterReducerState,
  MinimalRouterStateSnapshot,
  getRouterSelectors,
  SerializedRouterStateSnapshot,
} from '@ngrx/router-store';

export const ROUTER_FEATURE_KEY = 'router';

export const routerFeatureState =
  createFeatureSelector<RouterReducerState<MinimalRouterStateSnapshot>>(
    ROUTER_FEATURE_KEY,
  );

export const selectRouterState = createSelector(
  routerFeatureState,
  (routerReducerState) => routerReducerState && routerReducerState.state,
);

export function getAllRouteParameters(snapshot: SerializedRouterStateSnapshot) {
  let route = snapshot.root;
  let params = new Map(
    Object.keys(route.params).map((key) => [key, route.params[key]]),
  );
  while (route.firstChild) {
    route = route.firstChild;
    Object.keys(route.params).forEach((key) =>
      params.set(key, route.params[key]),
    );
  }
  return params;
}

export const {
  selectCurrentRoute, // select the current route
  selectFragment, // select the current route fragment
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectRouteDataParam, // factory function to select a route data param
  selectUrl, // select the current url
  selectTitle, // select the title if available
} = getRouterSelectors(routerFeatureState);
