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
import { select, Store } from '@ngrx/store';

import { footballEventActions } from './actions';
import { IFootballEvent } from '../../../../type/football-event.type';
import { selectCurrentMatchId } from '../../../match/store/reducers';
import { matchActions } from '../../../match/store/actions';
import { FootballEventService } from '../football-event.service';
import { mergeMap } from 'rxjs/operators';
import { SortService } from '../../../../services/sort.service';
import { selectAllMatchFootballEvents } from './reducers';

// Function to recalculate event numbers based on conflicts and toChangeList
export function recalculateEventNumbers(
  newEvent: any,
  allMatchFootballEvents: any[],
) {
  // Check if the new event's number already exists
  const existingEventNumbers = new Set(
    allMatchFootballEvents.map((event) => event.event_number),
  );

  // Identify conflicts and prepare toChangeList
  const conflictingWithNewEvent = allMatchFootballEvents.filter(
    (event) =>
      event.id !== newEvent.id && event.event_number === newEvent.event_number,
  );

  console.log('conflict new', conflictingWithNewEvent);

  const toChangeList: number[] = [];

  existingEventNumbers.forEach((eventNumber) => {
    if (
      conflictingWithNewEvent.some(
        (event) => event.event_number === eventNumber,
      )
    ) {
      toChangeList.push(eventNumber);
    }
    if (
      conflictingWithNewEvent.length > 0 &&
      eventNumber > newEvent.event_number &&
      allMatchFootballEvents.some(
        (event) =>
          event.event_number === eventNumber && event.id !== newEvent.id,
      )
    ) {
      toChangeList.push(eventNumber);
    }
  });

  // Recalculate event numbers based on conflicts
  const recalculatedExistingEvents = allMatchFootballEvents.map((event) => {
    if (
      event.id !== newEvent.id &&
      event.event_number &&
      toChangeList.includes(event.event_number)
    ) {
      const adjustedEventNumber = event.event_number + 1;
      console.log(
        `Event number ${event.event_number} conflicts, adjusting to ${adjustedEventNumber}`,
      );
      return { ...event, event_number: adjustedEventNumber };
    }
    return event;
  });

  console.log('change & recalc', toChangeList, recalculatedExistingEvents);

  return { toChangeList, recalculatedExistingEvents };
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
            map((deletedFootballEvent) => {
              return footballEventActions.deletedByIdSuccessfully({
                deletedFootballEvent,
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

  recalculateOnCreateEventNumbersEffect = createEffect(() => {
    return this.actions$.pipe(
      ofType(footballEventActions.createdSuccessfully),
      withLatestFrom(this.store.pipe(select(selectAllMatchFootballEvents))),
      switchMap(([action, allMatchFootballEvents]) => {
        return this.recalculateEventNumbersAndHandleUpdate(
          action.footballEvent,
          allMatchFootballEvents,
        );
      }),
    );
  });

  recalculateOnUpdateEventNumbersEffect = createEffect(() => {
    return this.actions$.pipe(
      ofType(footballEventActions.updateFootballEventByKeyValueSuccessfully),
      withLatestFrom(this.store.pipe(select(selectAllMatchFootballEvents))),
      switchMap(([action, allMatchFootballEvents]) => {
        return this.recalculateEventNumbersAndHandleUpdate(
          action.updatedFootballEvent,
          allMatchFootballEvents,
        );
      }),
    );
  });

  recalculateOnDeleteEventNumbersEffect = createEffect(() => {
    return this.actions$.pipe(
      ofType(footballEventActions.deletedByIdSuccessfully),
      withLatestFrom(this.store.pipe(select(selectAllMatchFootballEvents))),
      switchMap(([action, allMatchFootballEvents]) => {
        return this.handleDeletedEvent(
          action.deletedFootballEvent.event_number,
          allMatchFootballEvents,
        );
      }),
    );
  });

  private handleDeletedEvent(
    deletedEventNumber: number | null | undefined,
    allMatchFootballEvents: any[],
  ) {
    console.log(
      'recalculate on delete',
      deletedEventNumber,
      allMatchFootballEvents,
    );
    if (deletedEventNumber === null || deletedEventNumber === undefined) {
      return of(
        footballEventActions.recalculateEventsSuccess({
          footballEvents: allMatchFootballEvents,
        }),
      );
    }

    // Identify events to adjust
    const toChangeList = allMatchFootballEvents
      .filter(
        (event) =>
          event.event_number && event.event_number > deletedEventNumber,
      )
      .map((event) => event.event_number);

    // Return early if toChangeList is empty
    if (toChangeList.length === 0) {
      return of(
        footballEventActions.recalculateEventsSuccess({
          footballEvents: allMatchFootballEvents,
        }),
      );
    }

    // Adjust event numbers
    const recalculatedExistingEvents = allMatchFootballEvents.map((event) => {
      if (event.event_number && event.event_number > deletedEventNumber) {
        const adjustedEventNumber = event.event_number - 1;
        console.log(
          `Event number ${event.event_number} greater than deleted event, adjusting to ${adjustedEventNumber}`,
        );
        return { ...event, event_number: adjustedEventNumber };
      }
      return event;
    });

    // Update the backend
    const updateEvents$ = recalculatedExistingEvents
      .filter(
        (event) =>
          event.event_number !==
          allMatchFootballEvents.find((e) => e.id === event.id)?.event_number,
      )
      .map((event) =>
        this.footballEventService.editFootballEventKeyValue(event.id!, event),
      );

    return from(updateEvents$).pipe(
      mergeMap((updateEvent$) => updateEvent$),
      toArray(),
      map(() =>
        footballEventActions.recalculateEventsSuccess({
          footballEvents: SortService.sort(
            recalculatedExistingEvents,
            'event_number',
          ),
        }),
      ),
      catchError((error) => {
        console.error('Update Events Error:', error);
        return of(footballEventActions.recalculateEventsFailure());
      }),
    );
  }

  constructor(
    private actions$: Actions,
    private footballEventService: FootballEventService,
    private store: Store,
  ) {}

  private recalculateEventNumbersAndHandleUpdate(
    newEvent: any,
    allMatchFootballEvents: any[],
  ) {
    const { toChangeList, recalculatedExistingEvents } =
      recalculateEventNumbers(newEvent, allMatchFootballEvents);

    // Return early if toChangeList is empty
    if (toChangeList.length === 0) {
      console.log('changeListEmpty');
      return of(
        footballEventActions.recalculateEventsSuccess({
          footballEvents: SortService.sort(
            recalculatedExistingEvents,
            'event_number',
          ),
        }),
      );
    }

    const updateEvents$ = recalculatedExistingEvents
      .filter(
        (event) =>
          event.event_number !==
          allMatchFootballEvents.find((e) => e.id === event.id)?.event_number,
      )
      .map((event) =>
        this.footballEventService.editFootballEventKeyValue(event.id!, event),
      );

    return from(updateEvents$).pipe(
      mergeMap((updateEvent$) => updateEvent$),
      toArray(),
      map(() =>
        footballEventActions.recalculateEventsSuccess({
          footballEvents: SortService.sort(
            recalculatedExistingEvents,
            'event_number',
          ),
        }),
      ),
      catchError((error) => {
        console.error('Update Events Error:', error);
        return of(footballEventActions.recalculateEventsFailure());
      }),
    );
  }
}
