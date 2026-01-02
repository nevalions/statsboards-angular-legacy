import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createSelector, createReducer, on } from '@ngrx/store';
import { footballEventActions } from './actions';
import { IFootballEvent } from '../../../../type/football-event.type';

export interface FootballEventState extends EntityState<IFootballEvent> {
  footballEventIsLoading: boolean;
  footballEventIsSubmitting: boolean;
  currentFootballEventId: number | undefined | null;
  currentFootballEvent: IFootballEvent | undefined | null;
  errors: any | null;
}

const adapter = createEntityAdapter<IFootballEvent>({
  sortComparer: (a, b) => (a.event_number || 0) - (b.event_number || 0),
});

const initialState: FootballEventState = adapter.getInitialState({
  footballEventIsLoading: false,
  footballEventIsSubmitting: false,
  currentFootballEventId: null,
  currentFootballEvent: null,
  errors: null,
});

const footballEventFeature = createFeature({
  name: 'footballEvent',
  reducer: createReducer(
    initialState,
    // create actions
    on(footballEventActions.create, (state): FootballEventState => ({
      ...state,
      footballEventIsSubmitting: true,
    })),
    on(footballEventActions.createdSuccessfully, (state, action) =>
      adapter.addOne(action.footballEvent, {
        ...state,
        footballEventIsSubmitting: false,
        currentFootballEvent: action.footballEvent,
      }),
    ),
    on(footballEventActions.createFailure, (state, action): FootballEventState => ({
      ...state,
      footballEventIsSubmitting: false,
      errors: action,
    })),

    // update actions
    on(footballEventActions.update, (state): FootballEventState => ({
      ...state,
      footballEventIsSubmitting: true,
    })),
    on(footballEventActions.updatedSuccessfully, (state, action): FootballEventState => ({
      ...state,
      footballEventIsSubmitting: false,
      currentFootballEvent: action.updatedFootballEvent,
    })),
    on(footballEventActions.updateFailure, (state, action): FootballEventState => ({
      ...state,
      footballEventIsSubmitting: false,
      errors: action,
    })),
    // update action by key value actions
    on(footballEventActions.updateFootballEventByKeyValue, (state): FootballEventState => ({
      ...state,
      footballEventIsSubmitting: true,
    })),
    on(
      footballEventActions.updateFootballEventByKeyValueSuccessfully,
      (state, action) => {
        const updatedEvent = action.updatedFootballEvent;
        if (updatedEvent.id) {
          return adapter.updateOne(
            {
              id: updatedEvent.id,
              changes: updatedEvent,
            },
            {
              ...state,
              footballEventIsSubmitting: false,
              currentFootballEvent: updatedEvent,
            },
          );
        }
        return {
          ...state,
          footballEventIsSubmitting: false,
          currentFootballEvent: updatedEvent,
        };
      },
    ),
    on(
      footballEventActions.updateFootballEventByKeyValueFailure,
      (state) => ({
        ...state,
        footballEventIsSubmitting: false,
      }),
    ),

    // get actions
    on(footballEventActions.get, (state): FootballEventState => ({
      ...state,
      footballEventIsLoading: true,
    })),
    on(footballEventActions.getItemSuccess, (state, action): FootballEventState => ({
      ...state,
      footballEventIsLoading: false,
      currentFootballEvent: action.footballEvent,
    })),
    on(footballEventActions.getItemFailure, (state, action): FootballEventState => ({
      ...state,
      footballEventIsLoading: false,
      errors: action,
    })),

    on(footballEventActions.getFootballEventsByMatchId, (state): FootballEventState => ({
      ...state,
      footballEventIsLoading: true,
    })),
    on(
      footballEventActions.getFootballEventsByMatchIDSuccess,
      (state, action) => {
        const newList = action.footballEvents;
        return adapter.setAll(newList, {
          ...state,
          footballEventIsSubmitting: false,
          footballEventIsLoading: false,
        });
      },
    ),
    on(
      footballEventActions.getFootballEventsByMatchIDFailure,
      (state) => ({
        ...state,
        footballEventIsLoading: false,
      }),
    ),

    // delete by id
    on(footballEventActions.deleteById, (state): FootballEventState => ({
      ...state,
      footballEventIsSubmitting: true,
    })),
    on(footballEventActions.deletedByIdSuccessfully, (state, action) =>
      adapter.removeOne(action.deletedFootballEvent.id || 0, {
        ...state,
        footballEventIsSubmitting: false,
      }),
    ),
    on(footballEventActions.deleteByIdFailure, (state): FootballEventState => ({
      ...state,
      footballEventIsSubmitting: false,
    })),

    // recalculate
    on(footballEventActions.recalculateEventsSuccess, (state, action) => {
      return adapter.setAll(action.footballEvents, {
        ...state,
        footballEventIsSubmitting: false,
      })
    }),
    on(footballEventActions.recalculateEventsFailure, (state): FootballEventState => ({
      ...state,
      footballEventIsSubmitting: false,
    })),
  ),
});

const { selectAll } = adapter.getSelectors();

export const {
  name: footballEventFeatureKey,
  reducer: footballEventReducer,
  selectFootballEventIsSubmitting,
  selectFootballEventIsLoading,
  selectCurrentFootballEventId,
  selectCurrentFootballEvent,
  selectFootballEventState,
} = footballEventFeature;

export const selectAllMatchFootballEvents = createSelector(selectFootballEventState, selectAll);
