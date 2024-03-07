import { createFeature, createReducer, on } from '@ngrx/store';
import {
  crudStoreInterface,
  getDefaultCrudStore,
} from '../../../../type/store.intarface';

import { IMatchData } from '../../../../type/matchdata.type';
import { matchDataActions } from './actions';

export interface MatchDataState extends crudStoreInterface {
  matchDataLoading: boolean;
  matchDataIsSubmitting: boolean;
  currentMatchDataId: number | undefined | null;
  currentMatchData: IMatchData | undefined | null;
}

const initialState: MatchDataState = {
  ...getDefaultCrudStore(),
  matchDataLoading: false,
  matchDataIsSubmitting: false,
  currentMatchDataId: null,
  currentMatchData: null,
  errors: null,
};

const matchDataFeature = createFeature({
  name: 'matchdata',
  reducer: createReducer(
    initialState,

    // update actions
    on(matchDataActions.update, (state) => ({
      ...state,
      matchDataIsSubmitting: true,
    })),
    on(matchDataActions.updatedSuccessfully, (state, action) => ({
      ...state,
      matchDataIsSubmitting: false,
      currentMatchData: action.updatedMatchData,
      errors: null,
    })),
    on(matchDataActions.updateFailure, (state, action) => ({
      ...state,
      matchDataIsSubmitting: false,
      errors: action,
    })),

    // get actions
    on(matchDataActions.get, (state) => ({
      ...state,
      isLoading: true,
      matchDataLoading: true,
    })),
    on(matchDataActions.getItemSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      matchDataLoading: false,
      currentMatchData: action.matchdata,
    })),
    on(matchDataActions.getItemFailure, (state, action) => ({
      ...state,
      isLoading: false,
      matchDataLoading: false,
      errors: action,
    })),

    on(matchDataActions.getMatchDataByMatchId, (state) => ({
      ...state,
      isLoading: true,
      matchDataLoading: true,
    })),
    on(matchDataActions.getMatchdataByMatchIDSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      matchDataLoading: false,
      currentMatchData: action.matchdata,
    })),
    on(matchDataActions.getMatchdataByMatchIDFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
      matchDataLoading: false,
    })),
  ),
});

export const {
  name: matchDataFeatureKey,
  reducer: matchDataReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectMatchDataLoading,
  selectMatchDataIsSubmitting,
  selectCurrentMatchDataId,
  selectCurrentMatchData,
} = matchDataFeature;
