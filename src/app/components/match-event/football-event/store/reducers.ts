import { createFeature, createReducer, on } from '@ngrx/store';
import { footballEventActions } from './actions';
import { IFootballEvent } from '../../../../type/football-event.type';
import { SortService } from '../../../../services/sort.service';

export interface FootballEventState {
  footballEventIsLoading: boolean;
  footballEventIsSubmitting: boolean;
  currentFootballEventId: number | undefined | null;
  currentFootballEvent: IFootballEvent | undefined | null;
  allMatchFootballEvents: IFootballEvent[] | [];
}

const initialState: FootballEventState = {
  footballEventIsLoading: false,
  footballEventIsSubmitting: false,
  currentFootballEventId: null,
  currentFootballEvent: null,
  allMatchFootballEvents: [],
};

const footballEventFeature = createFeature({
  name: 'footballEvent',
  reducer: createReducer(
    initialState,
    // create actions
    on(footballEventActions.create, (state) => ({
      ...state,
      footballEventIsSubmitting: true,
    })),
    on(footballEventActions.createdSuccessfully, (state, action) => {
      const newList = [...state.allMatchFootballEvents, action.footballEvent];
      const sortedEvents = SortService.sort(newList, 'event_number');
      return {
        ...state,
        footballEventIsSubmitting: false,
        currentFootballEvent: action.footballEvent,
        allMatchFootballEvents: sortedEvents,
      };
    }),
    on(footballEventActions.createFailure, (state, action) => ({
      ...state,
      footballEventIsSubmitting: false,
      errors: action,
    })),

    // update actions
    on(footballEventActions.update, (state) => ({
      ...state,
      footballEventIsSubmitting: true,
    })),
    on(footballEventActions.updatedSuccessfully, (state, action) => ({
      ...state,
      footballEventIsSubmitting: false,
      currentFootballEvent: action.updatedFootballEvent,
    })),
    on(footballEventActions.updateFailure, (state, action) => ({
      ...state,
      footballEventIsSubmitting: false,
      errors: action,
    })),
    // update action by key value actions
    on(footballEventActions.updateFootballEventByKeyValue, (state) => ({
      ...state,
      footballEventIsSubmitting: true,
    })),
    on(
      footballEventActions.updateFootballEventByKeyValueSuccessfully,
      (state, action) => {
        const updatedEvent = action.updatedFootballEvent;
        const newList = state.allMatchFootballEvents.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event,
        );
        const sortedEvents = SortService.sort(newList, 'event_number');
        return {
          ...state,
          footballEventIsSubmitting: false,
          currentFootballEvent: updatedEvent,
          allMatchFootballEvents: sortedEvents,
        };
      },
    ),
    on(
      footballEventActions.updateFootballEventByKeyValueFailure,
      (state, action) => ({
        ...state,
        footballEventIsSubmitting: false,
      }),
    ),

    // get actions
    on(footballEventActions.get, (state) => ({
      ...state,
      footballEventIsLoading: true,
    })),
    on(footballEventActions.getItemSuccess, (state, action) => ({
      ...state,
      footballEventIsLoading: false,
      currentFootballEvent: action.footballEvent,
    })),
    on(footballEventActions.getItemFailure, (state, action) => ({
      ...state,
      footballEventIsLoading: false,
    })),

    on(footballEventActions.getFootballEventsByMatchId, (state) => ({
      ...state,
      footballEventIsLoading: true,
    })),
    on(
      footballEventActions.getFootballEventsByMatchIDSuccess,
      (state, action) => {
        const newList = action.footballEvents;
        const sortedEvents = SortService.sort(newList, 'event_number');
        return {
          ...state,
          footballEventIsSubmitting: false,
          allMatchFootballEvents: sortedEvents,
          footballEventIsLoading: false,
        };
      },
    ),
    on(
      footballEventActions.getFootballEventsByMatchIDFailure,
      (state, action) => ({
        ...state,
        footballEventIsLoading: false,
      }),
    ),

    // delete by id
    on(footballEventActions.deleteById, (state) => ({
      ...state,
      footballEventIsSubmitting: true,
    })),
    on(footballEventActions.deletedByIdSuccessfully, (state, action) => ({
      ...state,
      footballEventIsSubmitting: false,
      allMatchFootballEvents: (state.allMatchFootballEvents || []).filter(
        (item) => item.id !== action.eventInMatchId,
      ),
      errors: null,
    })),
    on(footballEventActions.deleteByIdFailure, (state, action) => ({
      ...state,
      footballEventIsSubmitting: false,
    })),
  ),
});

export const {
  name: footballEventFeatureKey,
  reducer: footballEventReducer,
  selectFootballEventIsSubmitting,
  selectFootballEventIsLoading,
  selectCurrentFootballEventId,
  selectAllMatchFootballEvents,
  selectCurrentFootballEvent,
} = footballEventFeature;
