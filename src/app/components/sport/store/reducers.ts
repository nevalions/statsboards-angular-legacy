import {
  crudStoreInterface,
  getDefaultCrudStore,
} from '../../../type/store.intarface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import { ISport } from '../../../type/sport.type';
import { sportActions } from './actions';
import { selectRouteParam } from '../../../router/router.selector';

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

    on(sportActions.getId, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(sportActions.getSportIdSuccessfully, (state, action) => ({
      ...state,
      isLoading: false,
      currentSportId: action.sportId,
    })),
    on(sportActions.getSportIdFailure, (state) => ({
      ...state,
      isLoading: false,
    })),

    // create actions
    on(sportActions.create, (state) => ({
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
    on(sportActions.createFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(sportActions.delete, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(sportActions.deletedSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      allSports: (state.allSports || []).filter(
        (item) => item.id !== action.id,
      ),
      errors: null,
    })),
    on(sportActions.deleteFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // update actions
    on(sportActions.update, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(sportActions.updatedSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      currentSport: action.updatedSport,
      allSports: state.allSports.map((item) =>
        item.id === action.updatedSport.id ? action.updatedSport : item,
      ),
      errors: null,
    })),
    on(sportActions.updateFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // get actions
    on(sportActions.get, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(sportActions.getItemSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      currentSport: action.sport,
    })),
    on(sportActions.getItemFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(sportActions.getAll, (state) => ({
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
    on(sportActions.getAllItemsFailure, (state, action) => ({
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
