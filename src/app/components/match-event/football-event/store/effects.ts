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
import { mergeMap } from 'rxjs/operators';
import { SortService } from '../../../../services/sort.service';
import { selectAllMatchFootballEvents } from './reducers';

// Function to identify conflicts and prepare toChangeList
export function identifyConflictsAndAdjustments(
  newEvent: any,
  allMatchFootballEvents: any[],
): {
  toChangeList: number[];
} {
  // Check if the new event's number already exists
  const existingEventNumbers = new Set(
    allMatchFootballEvents.map((event) => event.event_number),
  );

  // Identify all events that conflict with the new event
  const conflictingWithNewEvent = allMatchFootballEvents.filter(
    (event) =>
      event.id !== newEvent.id && event.event_number === newEvent.event_number,
  );

  console.log('conflictingWithNewEvent', conflictingWithNewEvent);

  // Initialize an array to store event numbers that need to be adjusted
  const toChangeList: number[] = [];

  // Push event_numbers from conflictingWithNewEvent to toChangeList
  conflictingWithNewEvent.forEach((event) => {
    toChangeList.push(event.event_number);
  });

  if (!conflictingWithNewEvent.length) {
    console.log('no conflictingWithNewEvent');
    return { toChangeList };
  }

  // Iterate through the existing event numbers set
  existingEventNumbers.forEach((eventNumber) => {
    // Check if the event number is greater than newEvent.event_number and conflicts
    if (
      eventNumber > newEvent.event_number &&
      allMatchFootballEvents.some(
        (event) =>
          event.event_number === eventNumber && event.id !== newEvent.id,
      )
    ) {
      // Add the conflicting event number to the list
      toChangeList.push(eventNumber);
    }
  });
  // console.log('Other conflicting event numbers:', toChangeList);
  return { toChangeList };
}

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

  //
  // // Effect to recalculate event numbers on successful creation of a football event
  // recalculateOnCreateEventNumbersEffect = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(footballEventActions.createdSuccessfully),
  //     withLatestFrom(this.store.pipe(select(selectAllMatchFootballEvents))),
  //     switchMap(([action, allMatchFootballEvents]) => {
  //       const newEvent = action.footballEvent;
  //
  //       // Identify conflicts and prepare toChangeList
  //       const { toChangeList } = identifyConflictsAndAdjustments(
  //         newEvent,
  //         allMatchFootballEvents,
  //       );
  //
  //       // Recalculate event numbers based on conflicts
  //       const recalculatedExistingEvents = recalculateEventNumbers(
  //         newEvent,
  //         allMatchFootballEvents,
  //         toChangeList,
  //       );
  //
  //       console.log(
  //         'Recalculated Existing Events:',
  //         recalculatedExistingEvents,
  //       );
  //
  //       // Update each changed event in the backend
  //       const updateEvents$ = recalculatedExistingEvents
  //         .filter(
  //           (event) =>
  //             event.event_number !==
  //             allMatchFootballEvents.find((e) => e.id === event.id)
  //               ?.event_number,
  //         )
  //         .map((event) =>
  //           this.footballEventService.editFootballEventKeyValue(
  //             event.id!,
  //             event,
  //           ),
  //         );
  //
  //       return from(updateEvents$).pipe(
  //         mergeMap((updateEvent$) => updateEvent$),
  //         toArray(),
  //         map(() =>
  //           footballEventActions.recalculateEventsSuccess({
  //             footballEvents: SortService.sort(
  //               recalculatedExistingEvents,
  //               'event_number',
  //             ),
  //           }),
  //         ),
  //         catchError((error) => {
  //           console.error('Update Events Error:', error);
  //           return of(footballEventActions.recalculateEventsFailure());
  //         }),
  //       );
  //     }),
  //   );
  // });
  //
  // // Effect to recalculate event numbers on successful creation of a football event
  // recalculateOnUpdateEventNumbersEffect = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(footballEventActions.updateFootballEventByKeyValueSuccessfully),
  //     withLatestFrom(this.store.pipe(select(selectAllMatchFootballEvents))),
  //     switchMap(([action, allMatchFootballEvents]) => {
  //       const newEvent = action.updatedFootballEvent;
  //       console.log('newEvent', newEvent);
  //
  //       // Identify conflicts and prepare toChangeList
  //       const { toChangeList } = identifyConflictsAndAdjustments(
  //         newEvent,
  //         allMatchFootballEvents,
  //       );
  //       console.log('tochangelist', toChangeList);
  //
  //       // Recalculate event numbers based on conflicts
  //       const recalculatedExistingEvents = recalculateEventNumbers(
  //         newEvent,
  //         allMatchFootballEvents,
  //         toChangeList,
  //       );
  //
  //       console.log(
  //         'Recalculated Existing Events:',
  //         recalculatedExistingEvents,
  //       );
  //
  //       // Update each changed event in the backend
  //       const updateEvents$ = recalculatedExistingEvents
  //         .filter(
  //           (event) =>
  //             event.event_number !==
  //             allMatchFootballEvents.find((e) => e.id === event.id)
  //               ?.event_number,
  //         )
  //         .map((event) =>
  //           this.footballEventService.editFootballEventKeyValue(
  //             event.id!,
  //             event,
  //           ),
  //         );
  //
  //       return from(updateEvents$).pipe(
  //         mergeMap((updateEvent$) => updateEvent$),
  //         toArray(),
  //         map(() =>
  //           footballEventActions.recalculateEventsSuccess({
  //             footballEvents: SortService.sort(
  //               recalculatedExistingEvents,
  //               'event_number',
  //             ),
  //           }),
  //         ),
  //         catchError((error) => {
  //           console.error('Update Events Error:', error);
  //           return of(footballEventActions.recalculateEventsFailure());
  //         }),
  //       );
  //     }),
  //   );
  // });

  constructor(
    private router: Router,
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
