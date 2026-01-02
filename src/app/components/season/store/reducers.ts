import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
  crudStoreInterface,
  getDefaultCrudStore,
} from '../../../type/store.intarface';
import { ISeason } from '../../../type/season.type';
import { createFeature, createReducer, on, createSelector } from '@ngrx/store';
import { seasonActions } from './actions';

export interface SeasonState extends EntityState<ISeason>, crudStoreInterface {
  currentSeasonId: number | undefined | null;
  currentSeasonYear: number | undefined | null;
  currentSeason: ISeason | undefined | null;
}

const adapter = createEntityAdapter<ISeason>({
  sortComparer: (a, b) => b.year - a.year,
});

const initialState: SeasonState = adapter.getInitialState({
  ...getDefaultCrudStore(),
  currentSeasonId: null,
  currentSeasonYear: null,
  currentSeason: null,
});

const seasonFeature = createFeature({
  name: 'season',
  reducer: createReducer(
    initialState,
    on(
      seasonActions.getId,
      (state): SeasonState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      seasonActions.getSeasonIdSuccessfully,
      (state, action): SeasonState => ({
        ...state,
        isLoading: false,
        currentSeasonId: action.seasonId,
      }),
    ),
    on(
      seasonActions.getSeasonIdFailure,
      (state): SeasonState => ({
        ...state,
        isLoading: false,
      }),
    ),

    on(
      seasonActions.create,
      (state): SeasonState => ({
        ...state,
        isSubmitting: true,
      }),
    ),
    on(
      seasonActions.createdSuccessfully,
      (state, action): SeasonState =>
        adapter.addOne(action.currentSeason, {
          ...state,
          isSubmitting: false,
          currentSeason: action.currentSeason,
        }),
    ),
    on(
      seasonActions.createFailure,
      (state, action): SeasonState => ({
        ...state,
        isSubmitting: false,
        errors: action,
      }),
    ),

    on(
      seasonActions.delete,
      (state): SeasonState => ({
        ...state,
        isSubmitting: true,
      }),
    ),
    on(
      seasonActions.deletedSuccessfully,
      (state, action): SeasonState =>
        adapter.removeOne(action.id, {
          ...state,
          isSubmitting: false,
          errors: null,
        }),
    ),
    on(
      seasonActions.deleteFailure,
      (state, action): SeasonState => ({
        ...state,
        isSubmitting: false,
        errors: action,
      }),
    ),

    on(
      seasonActions.update,
      (state): SeasonState => ({
        ...state,
        isSubmitting: true,
      }),
    ),
    on(
      seasonActions.updatedSuccessfully,
      (state, action): SeasonState =>
        adapter.updateOne(
          { id: action.updatedSeason.id!, changes: action.updatedSeason },
          {
            ...state,
            isSubmitting: false,
            currentSeason: action.updatedSeason,
            errors: null,
          },
        ),
    ),
    on(
      seasonActions.updateFailure,
      (state, action): SeasonState => ({
        ...state,
        isSubmitting: false,
        errors: action,
      }),
    ),

    on(
      seasonActions.get,
      (state): SeasonState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      seasonActions.getItemSuccess,
      (state, action): SeasonState => ({
        ...state,
        isLoading: false,
        currentSeason: action.season,
        currentSeasonYear: action.season.year,
      }),
    ),
    on(
      seasonActions.getItemFailure,
      (state, action): SeasonState => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),

    on(
      seasonActions.getAll,
      (state): SeasonState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      seasonActions.getAllItemsSuccess,
      (state, action): SeasonState =>
        adapter.setAll(action.seasons, {
          ...state,
          isLoading: false,
        }),
    ),
    on(
      seasonActions.getAllItemsFailure,
      (state, action): SeasonState => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),

    on(
      seasonActions.getSeasonsWithSportId,
      (state): SeasonState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      seasonActions.getAllSeasonsWithSportIDSuccess,
      (state, action): SeasonState =>
        adapter.setAll(action.seasons, {
          ...state,
          isLoading: false,
        }),
    ),
    on(
      seasonActions.getAllSeasonsWithSportIDFailure,
      (state, action): SeasonState => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),

    on(
      seasonActions.getSeasonByYear,
      (state): SeasonState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      seasonActions.getSeasonByYearSuccess,
      (state, action): SeasonState => ({
        ...state,
        isLoading: false,
        currentSeason: action.season,
      }),
    ),
    on(
      seasonActions.getSeasonByYearFailure,
      (state, action): SeasonState => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),
  ),
});

const { selectAll, selectEntities, selectTotal } = adapter.getSelectors();

export const {
  name: seasonFeatureKey,
  reducer: seasonReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectCurrentSeasonId,
  selectCurrentSeasonYear,
  selectCurrentSeason,
} = seasonFeature;

export const selectAllSeasons = createSelector(
  seasonFeature.selectSeasonState,
  selectAll,
);
export const selectSeasonEntities = createSelector(
  seasonFeature.selectSeasonState,
  selectEntities,
);
export const selectSeasonTotal = createSelector(
  seasonFeature.selectSeasonState,
  selectTotal,
);
