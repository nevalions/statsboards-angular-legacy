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
  getSportIdFromRouteEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(sportActions.getId),
        mergeMap(() =>
          this.store
            .select(getRouterSelectors().selectRouteParam('sport_id'))
            .pipe(
              filter((id: string | undefined): id is string => !!id),
              switchMap((id: string) => [
                sportActions.get({ id: Number(id) }),
                sportActions.getSportIdSuccessfully({ sportId: Number(id) }),
              ]),
              catchError(() => of(sportActions.getSportIdFailure())),
            ),
        ),
      );
    },
    { functional: true },
  );

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

  getSportByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(sportActions.get),
        switchMap(({ id }) =>
          this.sportService.findById(id).pipe(
            map((sport: ISport) => sportActions.getItemSuccess({ sport })),
            catchError(() => of(sportActions.getItemFailure())),
          ),
        ),
      );
    },
    { functional: true },
  );

  // getSportByIdEffect = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(sportActions.get),
  //     switchMap(() => {
  //       return this.store.select(
  //         getRouterSelectors().selectRouteParam('sport_id'),
  //       );
  //     }),
  //     map((id) => id ?? ''),
  //     filter((id: string) => id !== ''),
  //     map((id: string) => {
  //       return Number(id);
  //     }),
  //     switchMap((_id: number) => {
  //       return this.sportService.findById(_id).pipe(
  //         map((sport: ISport) => {
  //           return sportActions.getItemSuccess({ sport });
  //         }),
  //         catchError(() => {
  //           return of(sportActions.getItemFailure());
  //         }),
  //       );
  //     }),
  //   );
  // });

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
