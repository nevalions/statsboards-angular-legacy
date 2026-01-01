import {
  crudStoreInterface,
  getDefaultCrudStore,
} from '../../../type/store.intarface';
import { ISeason } from '../../../type/season.type';
import { createFeature, createReducer, on } from '@ngrx/store';
import { seasonActions } from './actions';
import { SortService } from '../../../services/sort.service';
import { sportActions } from '../../sport/store/actions';

export interface SeasonState extends crudStoreInterface {
  currentSeasonId: number | undefined | null;
  currentSeasonYear: number | undefined | null;
  allSeasons: ISeason[];
  currentSeason: ISeason | undefined | null;
}

const initialState: SeasonState = {
  ...getDefaultCrudStore(),
  currentSeasonId: null,
  currentSeasonYear: null,
  allSeasons: [],
  currentSeason: null,
};

const seasonFeature = createFeature({
  name: 'season',
  reducer: createReducer(
    initialState,
    on(seasonActions.getId, (state): SeasonState => ({
      ...state,
      isLoading: true,
    })),
    on(seasonActions.getSeasonIdSuccessfully, (state, action): SeasonState => ({
      ...state,
      isLoading: false,
      currentSeasonId: action.seasonId,
    })),
    on(seasonActions.getSeasonIdFailure, (state): SeasonState => ({
      ...state,
      isLoading: false,
    })),

    // create actions
    on(seasonActions.create, (state): SeasonState => ({
      ...state,
      isSubmitting: true,
    })),
    on(seasonActions.createdSuccessfully, (state, action) => {
      const newList = [...state.allSeasons, action.currentSeason];
      const sortedTournaments = SortService.sort(newList, 'year');
      return {
        ...state,
        isSubmitting: false,
        currentSeason: action.currentSeason,
        allSeasons: sortedTournaments, // sorted list
      };
    }),
    on(seasonActions.createFailure, (state, action): SeasonState => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(seasonActions.delete, (state): SeasonState => ({
      ...state,
      isSubmitting: true,
    })),
    on(seasonActions.deletedSuccessfully, (state, action): SeasonState => ({
      ...state,
      isSubmitting: false,
      allSeasons: (state.allSeasons || []).filter(
        (item) => item.id !== action.id,
      ),
      errors: null,
    })),
    on(seasonActions.deleteFailure, (state, action): SeasonState => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // update actions
    on(seasonActions.update, (state): SeasonState => ({
      ...state,
      isSubmitting: true,
    })),
    on(seasonActions.updatedSuccessfully, (state, action): SeasonState => ({
      ...state,
      isSubmitting: false,
      currentSeason: action.updatedSeason,
      allSeasons: state.allSeasons.map((item) =>
        item.id === action.updatedSeason.id ? action.updatedSeason : item,
      ),
      errors: null,
    })),
    on(seasonActions.updateFailure, (state, action): SeasonState => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // get actions
    on(seasonActions.get, (state): SeasonState => ({
      ...state,
      isLoading: true,
    })),
    on(seasonActions.getItemSuccess, (state, action): SeasonState => ({
      ...state,
      isLoading: false,
      currentSeason: action.season,
      currentSeasonYear: action.season.year,
    })),
    on(seasonActions.getItemFailure, (state, action): SeasonState => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(seasonActions.getAll, (state): SeasonState => ({
      ...state,
      isLoading: true,
    })),
    on(seasonActions.getAllItemsSuccess, (state, action): SeasonState => ({
      ...state,
      isLoading: false,
      allSeasons: action.seasons,
    })),
    on(seasonActions.getAllItemsFailure, (state, action): SeasonState => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(seasonActions.getSeasonsWithSportId, (state): SeasonState => ({
      ...state,
      isLoading: true,
    })),
    on(seasonActions.getAllSeasonsWithSportIDSuccess, (state, action): SeasonState => ({
      ...state,
      isLoading: false,
      allSeasons: action.seasons,
    })),
    on(seasonActions.getAllSeasonsWithSportIDFailure, (state, action): SeasonState => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(seasonActions.getSeasonByYear, (state): SeasonState => ({
      ...state,
      isLoading: true,
    })),
    on(seasonActions.getSeasonByYearSuccess, (state, action): SeasonState => ({
      ...state,
      isLoading: false,
      currentSeason: action.season,
    })),
    on(seasonActions.getSeasonByYearFailure, (state, action): SeasonState => ({
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
  selectCurrentSeasonId,
  selectCurrentSeasonYear,
  selectCurrentSeason,
  selectAllSeasons,
} = seasonFeature;
