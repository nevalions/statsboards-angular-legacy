import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { footballEventActions } from './actions';
import { IFootballEvent } from '../../../../type/football-event.type';
import { selectCurrentMatchId } from '../../../match/store/reducers';
import { matchActions } from '../../../match/store/actions';
import { FootballEventService } from '../football-event.service';

@Injectable()
export class FootballEventEffects {
  createFootballEventEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(footballEventActions.create),
        switchMap(({ request }) => {
          return this.footballEventService.addItem(request).pipe(
            map((footballEvent: IFootballEvent) => {
              return footballEventActions.createdSuccessfully({
                footballEvent,
              });
            }),
            catchError(() => {
              return of(footballEventActions.createFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  updateFootballEventEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(footballEventActions.update),
        switchMap(({ id, newFootballEvent }) => {
          return this.footballEventService
            .editFootballEventKeyValue(id, newFootballEvent)
            .pipe(
              map((updatedFootballEvent: IFootballEvent) => {
                return footballEventActions.updatedSuccessfully({
                  updatedFootballEvent,
                });
              }),
              catchError(() => {
                return of(footballEventActions.updateFailure());
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  updateFootballEventByKeyValueEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(footballEventActions.updateFootballEventByKeyValue),
        switchMap(({ id, data }) => {
          return this.footballEventService
            .editFootballEventKeyValue(id, data)
            .pipe(
              map((updatedFootballEvent: IFootballEvent) => {
                return footballEventActions.updateFootballEventByKeyValueSuccessfully(
                  {
                    updatedFootballEvent,
                  },
                );
              }),
              catchError(() => {
                return of(
                  footballEventActions.updateFootballEventByKeyValueFailure(),
                );
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  getFootballEventByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(footballEventActions.get),
        switchMap(({ id }) => {
          return this.footballEventService.findById(id).pipe(
            map((footballEvent: IFootballEvent) => {
              return footballEventActions.getItemSuccess({
                footballEvent,
              });
            }),
            catchError(() => {
              return of(footballEventActions.getItemFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  getFootballEventsByMatchIdMainEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(footballEventActions.getFootballEventsByMatchId),
        switchMap(() => this.store.select(selectCurrentMatchId)),
        map((matchId) => matchId),
        switchMap((matchId) => {
          return this.footballEventService
            .getFootballEventsByMatchId(matchId!)
            .pipe(
              map((footballEvents: IFootballEvent[]) => {
                return footballEventActions.getFootballEventsByMatchIDSuccess({
                  footballEvents,
                });
              }),
              catchError(() => {
                return of(
                  footballEventActions.getFootballEventsByMatchIDFailure(),
                );
              }),
            );
        }),
      );
    },
    { functional: true },
  );

  getFootballEventByMatchIdSideEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(matchActions.getMatchIdSuccessfully),
        switchMap((action) =>
          this.footballEventService
            .getFootballEventsByMatchId(action.matchId)
            .pipe(
              map((footballEvents: IFootballEvent[]) =>
                footballEventActions.getFootballEventsByMatchIDSuccess({
                  footballEvents: footballEvents,
                }),
              ),
              catchError((error) =>
                of(footballEventActions.getFootballEventsByMatchIDFailure()),
              ),
            ),
        ),
      );
    },
    { functional: false },
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private footballEventService: FootballEventService,
    private store: Store,
  ) {}
}
