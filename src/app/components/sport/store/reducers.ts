import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import { ISport } from '../../../type/sport.type';
import {
  crudStoreInterface,
  getDefaultCrudStore,
} from '../../../type/store.intarface';
import { sportActions } from './actions';

export interface SportState extends crudStoreInterface {
  currentSportId: number | undefined | null;
  currentSport: ISport | undefined | null;
  allSports: ISport[];
}

const initialState: SportState = {
  ...getDefaultCrudStore(),
  currentSportId: null,
  allSports: [],
  currentSport: null,
};

const sportFeature = createFeature({
  name: 'sport',
  reducer: createReducer(
    initialState,

    on(sportActions.getId, (state): SportState => ({
      ...state,
      isLoading: true,
    })),
    on(sportActions.getSportIdSuccessfully, (state, action): SportState => ({
      ...state,
      isLoading: false,
      currentSportId: action.sportId,
    })),
    on(sportActions.getSportIdFailure, (state): SportState => ({
      ...state,
      isLoading: false,
    })),

    // create actions
    on(sportActions.create, (state): SportState => ({
      ...state,
      isSubmitting: true,
    })),
    on(sportActions.createdSuccessfully, (state, action) => {
      const newList = [...state.allSports, action.currentSport];
      const sortedTournaments = SortService.sort(newList, 'title');
      return {
        ...state,
        isSubmitting: false,
        currentSport: action.currentSport,
        allSports: sortedTournaments, // sorted list
      };
    }),
    on(sportActions.createFailure, (state, action): SportState => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(sportActions.delete, (state): SportState => ({
      ...state,
      isSubmitting: true,
    })),
    on(sportActions.deletedSuccessfully, (state, action): SportState => ({
      ...state,
      isSubmitting: false,
      allSports: (state.allSports || []).filter(
        (item) => item.id !== action.id,
      ),
      errors: null,
    })),
    on(sportActions.deleteFailure, (state, action): SportState => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // update actions
    on(sportActions.update, (state): SportState => ({
      ...state,
      isSubmitting: true,
    })),
    on(sportActions.updatedSuccessfully, (state, action): SportState => ({
      ...state,
      isSubmitting: false,
      currentSport: action.updatedSport,
      allSports: state.allSports.map((item) =>
        item.id === action.updatedSport.id ? action.updatedSport : item,
      ),
      errors: null,
    })),
    on(sportActions.updateFailure, (state, action): SportState => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // get actions
    on(sportActions.get, (state): SportState => ({
      ...state,
      isLoading: true,
    })),
    on(sportActions.getItemSuccess, (state, action): SportState => ({
      ...state,
      isLoading: false,
      currentSportId: action.sport.id,
      currentSport: action.sport,
    })),
    on(sportActions.getItemFailure, (state, action): SportState => ({
      ...state,
      isLoading: false,
      errors: action,
    })),
    //get by match
    on(sportActions.getSportByMatch, (state): SportState => ({
      ...state,
      isLoading: true,
    })),
    on(sportActions.getSportByMatchSuccess, (state, action): SportState => ({
      ...state,
      isLoading: false,
      currentSportId: action.sport.id,
      currentSport: action.sport,
    })),
    on(sportActions.getSportByMatchFailure, (state, action): SportState => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(sportActions.getAll, (state): SportState => ({
      ...state,
      isLoading: true,
    })),
    on(sportActions.getAllItemsSuccess, (state, action) => {
      const sortedTournaments = SortService.sort(action.sports, 'title');
      return {
        ...state,
        isLoading: false,
        allSports: sortedTournaments,
      };
    }),
    on(sportActions.getAllItemsFailure, (state, action): SportState => ({
      ...state,
      isLoading: false,
      errors: action,
    })),
  ),
});

export const {
  name: sportFeatureKey,
  reducer: sportReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectCurrentSportId,
  selectCurrentSport,
  selectAllSports,
} = sportFeature;
