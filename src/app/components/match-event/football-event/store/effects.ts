import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  from,
  map,
  of,
  switchMap,
  toArray,
  withLatestFrom,
} from 'rxjs';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { footballEventActions } from './actions';
import { IFootballEvent } from '../../../../type/football-event.type';
import { selectCurrentMatchId } from '../../../match/store/reducers';
import { matchActions } from '../../../match/store/actions';
import { FootballEventService } from '../football-event.service';
import { selectAllMatchFootballEvents } from './reducers';
import { SortService } from '../../../../services/sort.service';
import { mergeMap } from 'rxjs/operators';

export function recalculateEventNumbers(
  events: IFootballEvent[],
): IFootballEvent[] {
  return events.map((event, index) => ({
    ...event,
    event_number: index + 1,
  }));
}

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

  deleteEventInMatchByIdEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(footballEventActions.deleteById),
        switchMap(({ id }) => {
          return this.footballEventService.deleteItem(id).pipe(
            map(() => {
              return footballEventActions.deletedByIdSuccessfully({
                eventInMatchId: id,
              });
            }),
            catchError(() => {
              return of(footballEventActions.deleteByIdFailure());
            }),
          );
        }),
      );
    },
    { functional: true },
  );

  recalculateOnCreateEventNumbersEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(footballEventActions.createdSuccessfully),
        withLatestFrom(this.store.pipe(select(selectAllMatchFootballEvents))),
        switchMap(([action, allMatchFootballEvents]) => {
          const updatedEvents = [
            ...allMatchFootballEvents,
            action.footballEvent,
          ];
          const sortedEvents = SortService.sort(updatedEvents, 'event_number');
          const recalculatedEvents = recalculateEventNumbers(sortedEvents);

          // Update each event in the backend
          const updateEvents$ = recalculatedEvents.map(
            (event: IFootballEvent) =>
              this.footballEventService.editFootballEventKeyValue(
                event.id!,
                event,
              ),
          );

          return from(updateEvents$).pipe(
            mergeMap((updateEvent$) => updateEvent$),
            toArray(),
            map(() =>
              footballEventActions.recalculateEventsSuccess({
                footballEvents: recalculatedEvents,
              }),
            ),
            catchError(() =>
              of(footballEventActions.recalculateEventsFailure()),
            ),
          );
        }),
      );
    },
    { functional: true },
  );

  constructor(
    private router: Router,
    private actions$: Actions,
    private footballEventService: FootballEventService,
    private store: Store,
  ) {}
}
