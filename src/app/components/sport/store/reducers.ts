import {
  crudStoreInterface,
  getDefaultCrudStore,
} from '../../../type/store.intarface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import { ISport } from '../../../type/sport.type';
import { SportService } from '../sport.service';
import { sportActions } from './actions';

export interface SportState extends crudStoreInterface<ISport> {}

const initialState: SportState = getDefaultCrudStore<ISport>();

const sportFeature = createFeature({
  name: 'sport',
  reducer: createReducer(
    initialState,

    // create actions
    on(sportActions.create, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(sportActions.createdSuccessfully, (state, action) => {
      const newList = [...state.itemsList, action.currentSport];
      const sortedTournaments = SortService.sort(newList, 'title');
      return {
        ...state,
        isSubmitting: false,
        currentItem: action.currentSport,
        itemsList: sortedTournaments, // sorted list
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
      itemsList: (state.itemsList || []).filter(
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
      currentItem: action.updatedSport,
      itemsList: state.itemsList.map((item) =>
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
      currentItem: action.sport,
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
    on(sportActions.getAllItemsSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      itemsList: action.sports,
    })),
    on(sportActions.getAllItemsFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    // on(sportActions.getSeasonByYear, (state) => ({
    //   ...state,
    //   isLoading: true,
    // })),
    // on(sportActions.getSeasonByYearSuccess, (state, action) => ({
    //   ...state,
    //   isLoading: false,
    //   currentItem: action.season,
    // })),
    // on(sportActions.getSeasonByYearFailure, (state, action) => ({
    //   ...state,
    //   isLoading: false,
    //   errors: action,
    // })),
  ),
});

export const {
  name: sportFeatureKey,
  reducer: sportReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectCurrentItem,
  selectItemsList,
} = sportFeature;
