import { createFeature, createReducer, on } from '@ngrx/store';
import { footballEventActions } from './actions';
import { IFootballEvent } from '../../../../type/football-event.type';

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
      (state, action) => ({
        ...state,
        footballEventIsSubmitting: false,
        currentFootballEvent: action.updatedFootballEvent,
      }),
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
      (state, action) => ({
        ...state,
        footballEventIsLoading: false,
        allMatchFootballEvents: action.footballEvents,
      }),
    ),
    on(
      footballEventActions.getFootballEventsByMatchIDFailure,
      (state, action) => ({
        ...state,
        footballEventIsLoading: false,
      }),
    ),
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
