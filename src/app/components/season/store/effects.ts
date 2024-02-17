import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { seasonActions } from './actions';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SeasonService } from '../../../services/season.service';
import { ISeason } from '../../../type/season.type';

@Injectable()
export class SeasonEffects {
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
        ofType(seasonActions.get), // You will have to define this action
        switchMap(({ id }) => {
          return this.seasonService.findById(id).pipe(
            // Assuming you have a getTournaments method in your service
            map((season: ISeason) => {
              return seasonActions.getItemSuccess({
                season,
              });
            }),
            catchError(() => {
              return of(seasonActions.getItemFailure());
            }),
          );
        }),
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
  ) {}
}
