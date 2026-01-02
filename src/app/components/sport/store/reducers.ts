import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on, createSelector } from '@ngrx/store';
import { ISport } from '../../../type/sport.type';
import {
  crudStoreInterface,
  getDefaultCrudStore,
} from '../../../type/store.intarface';
import { sportActions } from './actions';

export interface SportState extends EntityState<ISport>, crudStoreInterface {
  currentSportId: number | undefined | null;
  currentSport: ISport | undefined | null;
}

const adapter = createEntityAdapter<ISport>({
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

const initialState: SportState = adapter.getInitialState({
  ...getDefaultCrudStore(),
  currentSportId: null,
  currentSport: null,
});

const sportFeature = createFeature({
  name: 'sport',
  reducer: createReducer(
    initialState,

    on(
      sportActions.getId,
      (state): SportState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      sportActions.getSportIdSuccessfully,
      (state, action): SportState => ({
        ...state,
        isLoading: false,
        currentSportId: action.sportId,
      }),
    ),
    on(
      sportActions.getSportIdFailure,
      (state): SportState => ({
        ...state,
        isLoading: false,
      }),
    ),

    on(
      sportActions.create,
      (state): SportState => ({
        ...state,
        isSubmitting: true,
      }),
    ),
    on(
      sportActions.createdSuccessfully,
      (state, action): SportState =>
        adapter.addOne(action.currentSport, {
          ...state,
          isSubmitting: false,
          currentSport: action.currentSport,
        }),
    ),
    on(
      sportActions.createFailure,
      (state, action): SportState => ({
        ...state,
        isSubmitting: false,
        errors: action,
      }),
    ),

    on(
      sportActions.delete,
      (state): SportState => ({
        ...state,
        isSubmitting: true,
      }),
    ),
    on(
      sportActions.deletedSuccessfully,
      (state, action): SportState =>
        adapter.removeOne(action.id, {
          ...state,
          isSubmitting: false,
          errors: null,
        }),
    ),
    on(
      sportActions.deleteFailure,
      (state, action): SportState => ({
        ...state,
        isSubmitting: false,
        errors: action,
      }),
    ),

    on(
      sportActions.update,
      (state): SportState => ({
        ...state,
        isSubmitting: true,
      }),
    ),
    on(
      sportActions.updatedSuccessfully,
      (state, action): SportState =>
        adapter.updateOne(
          { id: action.updatedSport.id!, changes: action.updatedSport },
          {
            ...state,
            isSubmitting: false,
            currentSport: action.updatedSport,
            errors: null,
          },
        ),
    ),
    on(
      sportActions.updateFailure,
      (state, action): SportState => ({
        ...state,
        isSubmitting: false,
        errors: action,
      }),
    ),

    on(
      sportActions.get,
      (state): SportState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      sportActions.getItemSuccess,
      (state, action): SportState => ({
        ...state,
        isLoading: false,
        currentSportId: action.sport.id,
        currentSport: action.sport,
      }),
    ),
    on(
      sportActions.getItemFailure,
      (state, action): SportState => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),
    on(
      sportActions.getSportByMatch,
      (state): SportState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      sportActions.getSportByMatchSuccess,
      (state, action): SportState => ({
        ...state,
        isLoading: false,
        currentSportId: action.sport.id,
        currentSport: action.sport,
      }),
    ),
    on(
      sportActions.getSportByMatchFailure,
      (state, action): SportState => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),

    on(
      sportActions.getAll,
      (state): SportState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      sportActions.getAllItemsSuccess,
      (state, action): SportState =>
        adapter.setAll(action.sports, {
          ...state,
          isLoading: false,
        }),
    ),
    on(
      sportActions.getAllItemsFailure,
      (state, action): SportState => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),
  ),
});

const { selectAll, selectEntities, selectTotal } = adapter.getSelectors();

export const {
  name: sportFeatureKey,
  reducer: sportReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectCurrentSportId,
  selectCurrentSport,
} = sportFeature;

export const selectAllSports = createSelector(
  sportFeature.selectSportState,
  selectAll,
);
export const selectSportEntities = createSelector(
  sportFeature.selectSportState,
  selectEntities,
);
export const selectSportTotal = createSelector(
  sportFeature.selectSportState,
  selectTotal,
);
