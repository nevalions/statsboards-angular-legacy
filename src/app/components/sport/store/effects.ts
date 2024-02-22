import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  filter,
  map,
  mergeMap,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SportService } from '../sport.service';
import { ISport } from '../../../type/sport.type';
import { sportActions } from './actions';
import { Store } from '@ngrx/store';
import { getRouterSelectors } from '@ngrx/router-store';

@Injectable()
export class SportEffects {
  createSportEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(sportActions.create),
        switchMap(({ request }) => {
          return this.sportService.addItem(request).pipe(
            map((currentSport: ISport) => {
              return sportActions.createdSuccessfully({
                currentSport,
              });
            }),
            catchError(() => {
              return of(sportActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getAllSports = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(sportActions.getAll),
        switchMap(() => {
          return this.sportService.findAll().pipe(
            map((sports: ISport[]) => {
              return sportActions.getAllItemsSuccess({
                sports,
              });
            }),
            catchError(() => {
              return of(sportActions.getAllItemsFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getSportByIdEffect = createEffect(() => {
    return this.actions$.pipe(
      ofType(sportActions.get),
      switchMap(() => {
        return this.store.select(
          getRouterSelectors().selectRouteParam('sport_id'),
        );
      }),
      map((id) => id ?? ''),
      filter((id: string) => id !== ''),
      map((id: string) => {
        return Number(id);
      }),
      switchMap((_id: number) => {
        return this.sportService.findById(_id).pipe(
          map((sport: ISport) => {
            return sportActions.getItemSuccess({ sport });
          }),
          catchError(() => {
            return of(sportActions.getItemFailure());
          }),
        );
      }),
    );
  });

  // getSportByIdEffect = createEffect(
  //   () => {
  //   return this.actions$.pipe(
  //     ofType(sportActions.get),
  //     withLatestFrom(
  //       this.store.select(getRouterSelectors().selectRouteParam('sport_id')).pipe(
  //         filter((id) => typeof id === 'string' && !isNaN(Number(id))),
  //         map((id) => ({ id: Number(id) } as { id: number }),),
  //     ),
  //     switchMap((id) => {
  //       return this.sportService.findById(id).pipe(
  //           map((sport: ISport) => {
  //             return sportActions.getItemSuccess({
  //               sport,
  //             });
  //           }),
  //           catchError(() => {
  //             return of(sportActions.getItemFailure());
  //           }),
  //         );
  //
  //     }),
  //   );
  // });

  // getSeasonByYearEffect = createEffect(
  //   () => {
  //     return this.actions$.pipe(
  //       ofType(seasonActions.getSeasonByYear), // You will have to define this action
  //       switchMap(({ year }) => {
  //         return this.seasonService.getSeasonByYearReturn(year).pipe(
  //           // Assuming you have a getTournaments method in your service
  //           map((season: ISeason) => {
  //             return seasonActions.getSeasonByYearSuccess({
  //               season,
  //             });
  //           }),
  //           catchError(() => {
  //             return of(seasonActions.getSeasonByYearFailure());
  //           }),
  //         );
  //       }),
  //     );
  //   },
  //   { functional: true },
  // );

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

  deleteSportEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(sportActions.delete),
        switchMap(({ id }) => {
          // const _id = typeof id === 'string' ? Number(id) : id;
          return this.sportService.deleteItem(id).pipe(
            map(() => {
              return sportActions.deletedSuccessfully({ id: id });
            }),
            catchError(() => {
              return of(sportActions.deleteFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  navigateOnSportDeletion$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(sportActions.deletedSuccessfully),
        tap(() => this.router.navigateByUrl('/')),
      );
    },
    { dispatch: false },
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private sportService: SportService,
    private store: Store,
  ) {}
}
