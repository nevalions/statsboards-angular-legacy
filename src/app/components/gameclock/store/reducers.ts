import { createFeature, createReducer, on } from '@ngrx/store';
import { gameclockActions } from './actions';
import { IGameclock } from '../../../type/gameclock.type';

export interface GameclockState {
  gameclockLoading: boolean;
  gameclockIsSubmitting: boolean;
  currentGameclockId: number | undefined | null;
  currentGameclock: IGameclock | undefined | null;
  errors: any | undefined | null;
}

const initialState: GameclockState = {
  gameclockLoading: false,
  gameclockIsSubmitting: false,
  currentGameclockId: null,
  currentGameclock: null,
  errors: null,
};

const gameclockFeature = createFeature({
  name: 'gameclock',
  reducer: createReducer(
    initialState,

    // update actions
    on(gameclockActions.update, (state): GameclockState => ({
      ...state,
      gameclockIsSubmitting: true,
    })),
    on(gameclockActions.updatedSuccessfully, (state, action): GameclockState => ({
      ...state,
      gameclockIsSubmitting: false,
      currentGameclock: action.updatedGameclock,
      errors: null,
    })),
    on(gameclockActions.updateFailure, (state, action): GameclockState => ({
      ...state,
      gameclockIsSubmitting: false,
      errors: action,
    })),

    // get actions
    on(gameclockActions.get, (state): GameclockState => ({
      ...state,
      gameclockLoading: true,
    })),
    on(gameclockActions.getGameclockSuccess, (state, action): GameclockState => ({
      ...state,
      gameclockLoading: false,
      currentGameclock: action.gameclock,
    })),
    on(gameclockActions.getGameclockFailure, (state, action): GameclockState => ({
      ...state,
      gameclockLoading: false,
      errors: action,
    })),

    on(gameclockActions.getGameClockByMatchId, (state): GameclockState => ({
      ...state,
      gameclockLoading: true,
    })),
    on(gameclockActions.getGameclockByMatchIDSuccess, (state, action): GameclockState => ({
      ...state,
      gameclockLoading: false,
      currentGameclock: action.gameclock,
      currentGameclockId: action.gameclock.id,
    })),
    on(gameclockActions.getGameclockByMatchIDFailure, (state, action): GameclockState => ({
      ...state,
      errors: action,
      gameclockLoading: false,
    })),
  ),
});

export const {
  name: gameclockFeatureKey,
  reducer: gameclockReducer,
  selectGameclockLoading,
  selectGameclockIsSubmitting,
  selectCurrentGameclockId,
  selectCurrentGameclock,
} = gameclockFeature;
