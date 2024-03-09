import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { seasonActions } from './actions';
import { catchError, filter, map, mergeMap, of, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SeasonService } from '../season.service';
import { ISeason } from '../../../type/season.type';
import { sportActions } from '../../sport/store/actions';
import { getRouterSelectors, routerNavigatedAction } from '@ngrx/router-store';
import { ISport } from '../../../type/sport.type';
import { Store } from '@ngrx/store';
import { getAllRouteParameters } from '../../../router/router.selector';

@Injectable()
export class SeasonEffects {
  getSeasonIdFromRouteEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(({ payload }) => {
          let params = getAllRouteParameters(payload.routerState);
          let seasonId = params.get('season_id');
          return of(seasonId).pipe(
            filter((id: string | undefined): id is string => !!id),
            switchMap((id: string) => [
              seasonActions.getSeasonIdSuccessfully({ seasonId: Number(id) }),
            ]),
            catchError(() => of(seasonActions.getSeasonIdFailure())),
          );
        }),
      );
    },
    { functional: false },
  );

  createSeasonEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(seasonActions.create),
        switchMap(({ request }) => {
          return this.seasonService.addItem(request).pipe(
            map((currentSeason: ISeason) => {
              return seasonActions.createdSuccessfully({
                currentSeason,
              });
            }),
            catchError(() => {
              return of(seasonActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getAllSeasons = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(seasonActions.getAll),
        switchMap(() => {
          return this.seasonService.findAll().pipe(
            map((seasons: ISeason[]) => {
              return seasonActions.getAllItemsSuccess({
                seasons,
              });
            }),
            catchError(() => {
              return of(seasonActions.getAllItemsFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getSeasonByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(seasonActions.get),
        switchMap(({ id }) =>
          this.seasonService.findById(id).pipe(
            map((season: ISeason) => seasonActions.getItemSuccess({ season })),
            catchError(() => of(seasonActions.getItemFailure())),
          ),
        ),
      );
    },
    { functional: true },
  );

  getSeasonByIdSuccessEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(seasonActions.getSeasonIdSuccessfully),
        switchMap(({ seasonId }) =>
          this.seasonService.findById(seasonId).pipe(
            map((season: ISeason) => seasonActions.getItemSuccess({ season })),
            catchError(() => of(seasonActions.getItemFailure())),
          ),
        ),
      );
    },
    { functional: true },
  );

  getSeasonByYearEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(seasonActions.getSeasonByYear), // You will have to define this action
        switchMap(({ year }) => {
          return this.seasonService.getSeasonByYearReturn(year).pipe(
            // Assuming you have a getTournaments method in your service
            map((season: ISeason) => {
              return seasonActions.getSeasonByYearSuccess({
                season,
              });
            }),
            catchError(() => {
              return of(seasonActions.getSeasonByYearFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getSeasonsWithSportIdEffect = createEffect(() => {
    return this.actions$.pipe(
      ofType(seasonActions.getSeasonsWithSportId),
      switchMap(({ sportId }) => {
        return this.seasonService.getSeasonsWithSportId(sportId).pipe(
          map((seasons: ISeason[]) => {
            return seasonActions.getAllSeasonsWithSportIDSuccess({
              seasons,
            });
          }),
          catchError(() => {
            return of(seasonActions.getAllSeasonsWithSportIDFailure());
          }),
        );
      }),
    );
  });

  // getTournamentsBySportAndSeasonEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(seasonActions.getTournamentsBySportAndSeason), // You will have to define this action
  //       switchMap(({ id, year }) => {
  //         return this.seasonService
  //           .fetchTournamentsBySportAndSeason({ id, year })
  //           .pipe(
  //             // Assuming you have a getTournaments method in your service
  //             map((tournaments: ITournament[]) => {
  //               return tournamentActions.getTournamentsBySportAndSeasonSuccess({
  //                 tournaments,
  //               });
  //             }),
  //             catchError(() => {
  //               return of(
  //                 tournamentActions.getTournamentsBySportAndSeasonFailure(),
  //               );
  //             }),
  //           );
  //       }),
  //     );
  //   },
  //   { functional: true },
  // );

  deleteSeasonEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(seasonActions.delete),
        switchMap(({ id }) => {
          // const _id = typeof id === 'string' ? Number(id) : id;
          return this.seasonService.deleteItem(id).pipe(
            map(() => {
              return seasonActions.deletedSuccessfully({ id: id });
            }),
            catchError(() => {
              return of(seasonActions.deleteFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  navigateOnSeasonDeletion$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(seasonActions.deletedSuccessfully),
        tap(() => this.router.navigateByUrl('/')),
      );
    },
    { dispatch: false },
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private seasonService: SeasonService,
    private store: Store,
  ) {}
}
