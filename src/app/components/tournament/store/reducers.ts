import { createFeature, createReducer, on } from '@ngrx/store';
import { crudStoreInterface } from '../../../type/store.intarface';
import { tournamentActions } from './actions';
import { ITournament } from '../../../type/tournament.type';

const initialState: crudStoreInterface<ITournament> = {
  isSubmitting: false,
  isLoading: false,
  itemList: [],
  currentItem: undefined,
  errors: null,
};

const tournamentFeature = createFeature({
  name: 'tournament',
  reducer: createReducer(
    initialState,
    // create actions
    on(tournamentActions.create, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(tournamentActions.createdSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      currentItem: action.currentTournament,
    })),
    on(tournamentActions.createFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),
    // delete actions
    on(tournamentActions.delete, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(tournamentActions.deletedSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      itemList: (state.itemList || []).filter((item) => item.id !== action.id),
      errors: null,
    })),
    on(tournamentActions.deleteFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),
    // update actions
    on(tournamentActions.update, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(tournamentActions.updatedSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      currentIte: action.updatedTournament,
      itemList: state.itemList.map((item) =>
        item.id === action.updatedTournament.id
          ? action.updatedTournament
          : item,
      ),
      errors: null,
    })),
    on(tournamentActions.updateFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),
    on(tournamentActions.get, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(tournamentActions.getItemSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      tournaments: action.tournaments,
    })),
    on(tournamentActions.getItemFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),
    on(tournamentActions.getItemsSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      tournaments: action.tournaments,
    })),
    on(tournamentActions.getItemsFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),
  ),
});

export const {
  name: tournamentFeatureKey,
  reducer: tournamentReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectCurrentItem,
  selectItemList,
} = tournamentFeature;
