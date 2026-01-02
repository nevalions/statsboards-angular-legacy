import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createSelector, createReducer, on } from '@ngrx/store';
import {
  crudStoreInterface,
  getDefaultCrudStore,
} from '../../../type/store.intarface';
import { IMatchWithFullData } from '../../../type/match.type';
import { matchWithFullDataActions } from './actions';

export interface MatchWithFullDataState
  extends EntityState<IMatchWithFullData>, crudStoreInterface {
  currentMatchWithFullDataId: number | undefined | null;
  currentMatchWithFullData: IMatchWithFullData | undefined | null;
  allMatchesWithFullDataInSport: IMatchWithFullData[];
  allMatchesWithFullDataInTournament: IMatchWithFullData[];
}

const adapter = createEntityAdapter<IMatchWithFullData>({
  sortComparer: (a, b) => {
    const weekA = a.match?.week || 0;
    const weekB = b.match?.week || 0;
    if (weekA !== weekB) {
      return weekA - weekB;
    }
    const dateA = a.match?.match_date
      ? new Date(a.match.match_date).getTime()
      : 0;
    const dateB = b.match?.match_date
      ? new Date(b.match.match_date).getTime()
      : 0;
    return dateB - dateA;
  },
});

const initialState: MatchWithFullDataState = adapter.getInitialState({
  ...getDefaultCrudStore(),
  currentMatchWithFullDataId: null,
  allMatchesWithFullDataInSport: [],
  allMatchesWithFullDataInTournament: [],
  currentMatchWithFullData: null,
  errors: null,
});

const matchWithFullDataFeature = createFeature({
  name: 'matchWithFullData',
  reducer: createReducer(
    initialState,
    on(
      matchWithFullDataActions.getId,
      (state): MatchWithFullDataState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      matchWithFullDataActions.getMatchWithFullDataIdSuccessfully,
      (state, action): MatchWithFullDataState => ({
        ...state,
        isLoading: false,
        currentMatchWithFullDataId: action.matchWithFullDataId,
      }),
    ),
    on(
      matchWithFullDataActions.getMatchWithFullDataIdFailure,
      (state): MatchWithFullDataState => ({
        ...state,
        isLoading: false,
      }),
    ),

    on(
      matchWithFullDataActions.create,
      (state): MatchWithFullDataState => ({
        ...state,
        isSubmitting: true,
      }),
    ),
    on(
      matchWithFullDataActions.createdSuccessfully,
      (state, action): MatchWithFullDataState => {
        return adapter.addOne(action.currentMatchWithFullData, {
          ...state,
          isSubmitting: false,
          currentMatchWithFullData: action.currentMatchWithFullData,
        });
      },
    ),
    on(
      matchWithFullDataActions.createFailure,
      (state, action): MatchWithFullDataState => ({
        ...state,
        isSubmitting: false,
        errors: action,
      }),
    ),

    on(
      matchWithFullDataActions.delete,
      (state): MatchWithFullDataState => ({
        ...state,
        isSubmitting: true,
      }),
    ),
    on(
      matchWithFullDataActions.deletedSuccessfully,
      (state, action): MatchWithFullDataState => {
        return adapter.removeOne(action.id, {
          ...state,
          isSubmitting: false,
          allMatchesWithFullDataInTournament:
            state.allMatchesWithFullDataInTournament.filter(
              (item) => item.id !== action.id,
            ),
          errors: null,
        });
      },
    ),
    on(
      matchWithFullDataActions.deleteFailure,
      (state, action): MatchWithFullDataState => ({
        ...state,
        isSubmitting: false,
        errors: action,
      }),
    ),

    on(
      matchWithFullDataActions.update,
      (state): MatchWithFullDataState => ({
        ...state,
        isSubmitting: true,
      }),
    ),
    on(
      matchWithFullDataActions.updatedSuccessfully,
      (state, action): MatchWithFullDataState => {
        return adapter.updateOne(
          {
            id: action.updatedMatchWithFullData.id!,
            changes: action.updatedMatchWithFullData,
          },
          {
            ...state,
            isSubmitting: false,
            currentMatchWithFullData: action.updatedMatchWithFullData,
            errors: null,
          },
        );
      },
    ),
    on(
      matchWithFullDataActions.updateFailure,
      (state, action): MatchWithFullDataState => ({
        ...state,
        isSubmitting: false,
        errors: action,
      }),
    ),

    on(
      matchWithFullDataActions.updateAllMatchesWithFullDataInTournament,
      (state, { newMatchWithFullData }) => {
        return adapter.addOne(newMatchWithFullData, {
          ...state,
          allMatchesWithFullDataInTournament: [
            ...state.allMatchesWithFullDataInTournament,
            newMatchWithFullData,
          ],
        });
      },
    ),
    on(
      matchWithFullDataActions.updateMatchWithFullData,
      (state, { newMatchWithFullData }) => {
        return {
          ...state,
          currentMatchWithFullData: newMatchWithFullData,
        };
      },
    ),

    on(
      matchWithFullDataActions.removeMatchFromTournament,
      (state, action): MatchWithFullDataState => {
        return adapter.removeOne(action.id, {
          ...state,
          allMatchesWithFullDataInTournament:
            state.allMatchesWithFullDataInTournament.filter(
              (match) => match.id !== action.id,
            ),
        });
      },
    ),

    on(
      matchWithFullDataActions.get,
      (state): MatchWithFullDataState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      matchWithFullDataActions.getItemSuccess,
      (state, action): MatchWithFullDataState => ({
        ...state,
        isLoading: false,
        currentMatchWithFullData: action.matchWithFullData,
      }),
    ),
    on(
      matchWithFullDataActions.getItemFailure,
      (state, action): MatchWithFullDataState => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),

    on(
      matchWithFullDataActions.getAll,
      (state): MatchWithFullDataState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(matchWithFullDataActions.getAllItemsSuccess, (state, action) => {
      return adapter.setAll(action.matchesWithFullData, {
        ...state,
        isLoading: false,
      });
    }),
    on(
      matchWithFullDataActions.getAllItemsFailure,
      (state, action): MatchWithFullDataState => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),

    on(
      matchWithFullDataActions.getMatchesWithFullDataBySportId,
      (state): MatchWithFullDataState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      matchWithFullDataActions.getMatchesWithFullDataBySportIDSuccess,
      (state, action) => {
        const sortedMatches = [...action.matchesWithFullData].sort((a, b) => {
          const dateA = a.match?.match_date
            ? new Date(a.match.match_date).getTime()
            : 0;
          const dateB = b.match?.match_date
            ? new Date(b.match.match_date).getTime()
            : 0;
          return dateB - dateA;
        });
        return {
          ...state,
          isLoading: false,
          allMatchesWithFullDataInSport: sortedMatches,
        };
      },
    ),
    on(
      matchWithFullDataActions.getMatchesWithFullDataBySportIDFailure,
      (state, action) => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),

    on(
      matchWithFullDataActions.getMatchesWithFullDataByTournamentId,
      (state) => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      matchWithFullDataActions.getMatchesWithFullDataByTournamentIDSuccess,
      (state, action) => {
        const sortedMatches = [...action.matchesWithFullData].sort((a, b) => {
          const weekA = a.match?.week || 0;
          const weekB = b.match?.week || 0;
          if (weekA !== weekB) {
            return weekA - weekB;
          }
          const dateA = a.match?.match_date
            ? new Date(a.match.match_date).getTime()
            : 0;
          const dateB = b.match?.match_date
            ? new Date(b.match.match_date).getTime()
            : 0;
          return dateB - dateA;
        });
        return {
          ...state,
          isLoading: false,
          allMatchesWithFullDataInTournament: sortedMatches,
        };
      },
    ),
    on(
      matchWithFullDataActions.getMatchesWithFullDataByTournamentIDFailure,
      (state, action) => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),
  ),
});

const { selectAll } = adapter.getSelectors();

export const {
  name: matchWithFullDataFeatureKey,
  reducer: matchWithFullDataReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectCurrentMatchWithFullDataId,
  selectCurrentMatchWithFullData,
  selectAllMatchesWithFullDataInSport,
  selectAllMatchesWithFullDataInTournament,
} = matchWithFullDataFeature;

export const selectAllMatchesWithFullData = createSelector(
  matchWithFullDataFeature.selectMatchWithFullDataState,
  selectAll,
);
