import { createFeature, createReducer, on } from '@ngrx/store';
import { playclockActions } from './actions';
import { IPlayclock } from '../../../type/playclock.type';

export interface PlayclockState {
  playclockLoading: boolean;
  playclockIsSubmitting: boolean;
  currentPlayclockId: number | undefined | null;
  currentPlayclock: IPlayclock | undefined | null;
  errors: any | undefined | null;
}

const initialState: PlayclockState = {
  playclockLoading: false,
  playclockIsSubmitting: false,
  currentPlayclockId: null,
  currentPlayclock: null,
  errors: null,
};

const playclockFeature = createFeature({
  name: 'playclock',
  reducer: createReducer(
    initialState,

    // update actions
    on(playclockActions.update, (state) => ({
      ...state,
      playclockIsSubmitting: true,
    })),
    on(playclockActions.updatedSuccessfully, (state, action) => ({
      ...state,
      playclockIsSubmitting: false,
      currentPlayclock: action.updatedPlayclock,
      errors: null,
    })),
    on(playclockActions.updateFailure, (state, action) => ({
      ...state,
      playclockIsSubmitting: false,
      errors: action,
    })),

    // get actions
    on(playclockActions.get, (state) => ({
      ...state,
      playclockLoading: true,
    })),
    on(playclockActions.getPlayclockSuccess, (state, action) => ({
      ...state,
      playclockLoading: false,
      currentPlayclock: action.playclock,
    })),
    on(playclockActions.getPlayclockFailure, (state, action) => ({
      ...state,
      playclockLoading: false,
      errors: action,
    })),

    on(playclockActions.getPlayClockByMatchId, (state) => ({
      ...state,
      playclockLoading: true,
    })),
    on(playclockActions.getPlayclockByMatchIDSuccess, (state, action) => ({
      ...state,
      playclockLoading: false,
      currentPlayclock: action.playclock,
      currentPlayclockId: action.playclock.id,
    })),
    on(playclockActions.getPlayclockByMatchIDFailure, (state, action) => ({
      ...state,
      errors: action,
      playclockLoading: false,
    })),
  ),
});

export const {
  name: playclockFeatureKey,
  reducer: playclockReducer,
  selectPlayclockLoading,
  selectPlayclockIsSubmitting,
  selectCurrentPlayclockId,
  selectCurrentPlayclock,
} = playclockFeature;
