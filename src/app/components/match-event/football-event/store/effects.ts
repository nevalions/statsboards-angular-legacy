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
import { mergeMap, tap } from 'rxjs/operators';
import { SortService } from '../../../../services/sort.service';

export function recalculateEventNumbers(
  events: IFootballEvent[],
): IFootballEvent[] {
  if (events.length === 0) {
    return [];
  }

  // Create a deep copy of the events array before sorting
  const eventsCopy = events.map((event) => ({ ...event }));

  // Sort events by their current event_number
  const sortedEvents = eventsCopy.sort(
    (a, b) => (a.event_number || 1) - (b.event_number || 1),
  );

  // Check for conflicts and adjust event numbers
  const seenNumbers = new Set<number>();
  const recalculatedEvents = sortedEvents.map((event) => {
    let eventNumber = event.event_number || 1;
    while (seenNumbers.has(eventNumber)) {
      eventNumber += 1;
    }
    seenNumbers.add(eventNumber);
    // Return a new object with the adjusted event_number
    return {
      ...event,
      event_number: eventNumber,
    };
  });

  return recalculatedEvents;
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

  recalculateOnCreateEventNumbersEffect = createEffect(() => {
    return this.actions$.pipe(
      ofType(footballEventActions.createdSuccessfully),
      tap((action) => console.log('Action dispatched:', action)), // Log the dispatched action
      withLatestFrom(this.store.pipe(select(selectAllMatchFootballEvents))),
      tap(([action, allMatchFootballEvents]) => {
        console.log('All Match Football Events:', allMatchFootballEvents);
      }),
      switchMap(([action, allMatchFootballEvents]) => {
        console.log('SwitchMap Triggered');
        const newEvent = action.footballEvent;

        // Check if the new event's number already exists
        const existingEventNumbers = new Set(
          allMatchFootballEvents.map((event) => event.event_number),
        );
        console.log('Existing Event Numbers:', existingEventNumbers);
        console.log('New Event:', newEvent);

        // Recalculate numbers for existing events only if there's a conflict
        const recalculatedExistingEvents = allMatchFootballEvents.map(
          (event) => {
            if (
              event.id !== newEvent.id &&
              newEvent.event_number &&
              event.event_number === newEvent.event_number
            ) {
              const nextEventNumber = event.event_number + 1;
              console.log(
                `Event number ${event.event_number} conflicts, adjusting to ${nextEventNumber}`,
              );
              console.log('CONFLICT EVENT', event);
              return { ...event, event_number: nextEventNumber };
            }
            console.log('Event number without recalculation:', event);
            return event;
          },
        );

        console.log(
          'Recalculated Existing Events:',
          recalculatedExistingEvents,
        );

        // Filter only events that have changed
        const changedEvents = recalculatedExistingEvents.filter(
          (event) =>
            event.event_number !==
            allMatchFootballEvents.find((e) => e.id === event.id)?.event_number,
        );

        // Update each changed event in the backend
        const updateEvents$ = changedEvents.map((event) =>
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
      }),
    );
  });

  constructor(
    private router: Router,
    private actions$: Actions,
    private footballEventService: FootballEventService,
    private store: Store,
  ) {}
}
