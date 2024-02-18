import {
  crudStoreInterface,
  getDefaultCrudStore,
} from '../../../type/store.intarface';
import { ISeason } from '../../../type/season.type';
import { createFeature, createReducer, on } from '@ngrx/store';
import { seasonActions } from './actions';
import { SortService } from '../../../services/sort.service';

export interface SeasonState extends crudStoreInterface<ISeason> {}

const initialState: SeasonState = getDefaultCrudStore<ISeason>();

const seasonFeature = createFeature({
  name: 'season',
  reducer: createReducer(
    initialState,

    // create actions
    on(seasonActions.create, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(seasonActions.createdSuccessfully, (state, action) => {
      const newList = [...state.itemsList, action.currentSeason];
      const sortedTournaments = SortService.sort(newList, 'year');
      return {
        ...state,
        isSubmitting: false,
        currentItem: action.currentSeason,
        itemsList: sortedTournaments, // sorted list
      };
    }),
    on(seasonActions.createFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(seasonActions.delete, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(seasonActions.deletedSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      itemsList: (state.itemsList || []).filter(
        (item) => item.id !== action.id,
      ),
      errors: null,
    })),
    on(seasonActions.deleteFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // update actions
    on(seasonActions.update, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(seasonActions.updatedSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      currentItem: action.updatedSeason,
      itemsList: state.itemsList.map((item) =>
        item.id === action.updatedSeason.id ? action.updatedSeason : item,
      ),
      errors: null,
    })),
    on(seasonActions.updateFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // get actions
    on(seasonActions.get, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(seasonActions.getItemSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      currentItem: action.season,
    })),
    on(seasonActions.getItemFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(seasonActions.getAll, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(seasonActions.getAllItemsSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      itemsList: action.seasons,
    })),
    on(seasonActions.getAllItemsFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(seasonActions.getSeasonsWithSportId, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(seasonActions.getAllSeasonsWithSportIDSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      itemsList: action.seasons,
    })),
    on(seasonActions.getAllSeasonsWithSportIDFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(seasonActions.getSeasonByYear, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(seasonActions.getSeasonByYearSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      currentItem: action.season,
    })),
    on(seasonActions.getSeasonByYearFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),
  ),
});

export const {
  name: seasonFeatureKey,
  reducer: seasonReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectCurrentItem,
  selectItemsList,
} = seasonFeature;
