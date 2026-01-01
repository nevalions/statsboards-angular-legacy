import { createFeature, createReducer, on } from '@ngrx/store';
import {
  crudStoreInterface,
  getDefaultCrudStore,
} from '../../../type/store.intarface';
import { IScoreboard } from '../../../type/matchdata.type';
import { scoreboardDataActions } from './actions';

export interface ScoreboardDataState extends crudStoreInterface {
  scoreboardDataLoading: boolean;
  scoreboardDataIsSubmitting: boolean;
  currentScoreboardDataId: number | undefined | null;
  currentScoreboardData: IScoreboard | undefined | null;
}

const initialState: ScoreboardDataState = {
  ...getDefaultCrudStore(),
  scoreboardDataLoading: false,
  scoreboardDataIsSubmitting: false,
  currentScoreboardDataId: null,
  currentScoreboardData: null,
  errors: null,
};

const scoreboardDataFeature = createFeature({
  name: 'scoreboard',
  reducer: createReducer(
    initialState,
    // update actions
    on(scoreboardDataActions.update, (state): ScoreboardDataState => ({
      ...state,
      scoreboardDataIsSubmitting: true,
    })),
    on(scoreboardDataActions.updatedSuccessfully, (state, action): ScoreboardDataState => ({
      ...state,
      scoreboardDataIsSubmitting: false,
      currentScoreboardData: action.updatedScoreboardData,
      errors: null,
    })),
    on(scoreboardDataActions.updateFailure, (state, action): ScoreboardDataState => ({
      ...state,
      scoreboardDataIsSubmitting: false,
      errors: action,
    })),
    // update action by key value actions
    on(scoreboardDataActions.updateScoreBoardDataByKeyValue, (state): ScoreboardDataState => ({
      ...state,
      scoreboardDataIsSubmitting: true,
    })),
    on(
      scoreboardDataActions.updateScoreboardDataByKeyValueSuccessfully,
      (state, action) => ({
        ...state,
        scoreboardDataIsSubmitting: false,
        currentScoreboardData: action.updatedScoreboardData,
        errors: null,
      }),
    ),
    on(
      scoreboardDataActions.updateScoreboardDataByKeyValueFailure,
      (state, action) => ({
        ...state,
        scoreboardDataIsSubmitting: false,
        errors: action,
      }),
    ),

    // get actions
    on(scoreboardDataActions.get, (state): ScoreboardDataState => ({
      ...state,
      scoreboardDataLoading: true,
    })),
    on(scoreboardDataActions.getItemSuccess, (state, action): ScoreboardDataState => ({
      ...state,
      scoreboardDataLoading: false,
      currentScoreboardData: action.scoreboardData,
    })),
    on(scoreboardDataActions.getItemFailure, (state, action): ScoreboardDataState => ({
      ...state,
      scoreboardDataLoading: false,
      errors: action,
    })),

    on(scoreboardDataActions.getScoreboardDataByMatchId, (state): ScoreboardDataState => ({
      ...state,
      scoreboardDataLoading: true,
    })),
    on(
      scoreboardDataActions.getScoreboardDataByMatchIDSuccess,
      (state, action) => ({
        ...state,
        scoreboardDataLoading: false,
        currentScoreboardData: action.scoreboardData,
      }),
    ),
    on(
      scoreboardDataActions.getScoreboardDataByMatchIDFailure,
      (state, action) => ({
        ...state,
        errors: action,
        scoreboardDataLoading: false,
      }),
    ),
  ),
});

export const {
  name: scoreboardDataFeatureKey,
  reducer: scoreboardDataReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectScoreboardDataIsSubmitting,
  selectScoreboardDataLoading,
  selectCurrentScoreboardDataId,
  selectCurrentScoreboardData,
} = scoreboardDataFeature;
