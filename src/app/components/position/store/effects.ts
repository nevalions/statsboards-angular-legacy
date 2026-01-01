import { concatLatestFrom } from '@ngrx/operators';import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { routerNavigatedAction } from '@ngrx/router-store';
import { getAllRouteParameters } from '../../../router/router.selector';
import { positionActions } from './actions';
import { IPosition } from '../../../type/position.type';
import { selectCurrentPosition } from './reducers';
import { selectCurrentSportId } from '../../sport/store/reducers';
import { SportService } from '../../sport/sport.service';
import { PositionService } from '../position.service';
import { sportActions } from '../../sport/store/actions';

@Injectable()
export class PositionEffects {
  getPositionIdFromRouteEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(({ payload }) => {
          let params = getAllRouteParameters(payload.routerState);
          let positionId = params.get('position_id');
          return of(positionId).pipe(
            filter((id: string | undefined): id is string => !!id),
            switchMap((id: string) => [
              positionActions.getPositionIdSuccessfully({
                positionId: Number(id),
              }),
            ]),
            catchError(() => of(positionActions.getPositionIdFailure())),
          );
        }),
      );
    },
    { functional: false },
  );

  createPositionEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(positionActions.create),
        switchMap(({ request }) => {
          return this.positionService.addItem(request).pipe(
            map((currentPosition: IPosition) => {
              return positionActions.createdSuccessfully({
                currentPosition,
              });
            }),
            catchError(() => {
              return of(positionActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  updatePositionEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(positionActions.update),
        switchMap(({ id, newPositionData }) => {
          return this.positionService.editItem(id, newPositionData).pipe(
            map((updatedPosition: IPosition) => {
              return positionActions.updatedSuccessfully({ updatedPosition });
            }),
          );
        }),
        catchError(() => {
          return of(positionActions.updateFailure);
        }),
      );
    },
    { functional: true },
  );

  getAllPositions = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(positionActions.getAll),
        switchMap(() => {
          return this.positionService.findAll().pipe(
            map((positions: IPosition[]) => {
              return positionActions.getAllItemsSuccess({
                positions,
              });
            }),
            catchError(() => {
              return of(positionActions.getAllItemsFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getPositionByIdSuccessEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(positionActions.getPositionIdSuccessfully),
        switchMap(({ positionId }) =>
          this.positionService.findById(positionId).pipe(
            map((position: IPosition) =>
              positionActions.getItemSuccess({ position }),
            ),
            catchError(() => of(positionActions.getItemFailure())),
          ),
        ),
      );
    },
    { functional: true },
  );

  getPositionByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(positionActions.get),
        switchMap(({ id }) =>
          this.positionService.findById(id).pipe(
            map((position: IPosition) =>
              positionActions.getItemSuccess({ position }),
            ),
            catchError(() => of(positionActions.getItemFailure())),
          ),
        ),
      );
    },
    { functional: true },
  );

  getPositionsBySportIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(positionActions.getAllPositionsBySportId),
        switchMap(() => this.store.select(selectCurrentSportId)),
        filter(
          (sportId): sportId is number =>
            sportId !== null && sportId !== undefined,
        ),
        switchMap((sportId) => {
          return this.positionService.findPositionsBySportId(sportId).pipe(
            map((positions: IPosition[]) => {
              return positionActions.getAllPositionsBySportIdSuccess({
                positions,
              });
            }),
            catchError(() => {
              return of(positionActions.getAllPositionsBySportIdFailure);
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  deletePositionEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(positionActions.delete),
        concatLatestFrom(() => this.store.select(selectCurrentPosition)),
        switchMap(([action, currentPosition]) => {
          if (!currentPosition || !currentPosition.id) {
            return of(positionActions.deleteFailure());
          }

          return this.positionService.deleteItem(currentPosition.id).pipe(
            map(() =>
              positionActions.deletedSuccessfully({
                positionId: currentPosition.id!,
                sportId: currentPosition.sport_id!,
              }),
            ),
            catchError(() => {
              return of(positionActions.deleteFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  deletePositionByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(positionActions.deleteById),
        switchMap(({ id }) => {
          return this.positionService.deleteItem(id).pipe(
            map(() => {
              return positionActions.deletedByIdSuccessfully({
                positionId: id,
              });
            }),
            catchError(() => {
              return of(positionActions.deleteByIdFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  navigateOnPositionDeletion$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(positionActions.deletedSuccessfully),
        tap(({ sportId }) =>
          this.router.navigateByUrl(`/sport/${sportId}/positions`),
        ),
      );
    },
    { dispatch: false },
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private positionService: PositionService,
    private store: Store,
  ) {}
}
