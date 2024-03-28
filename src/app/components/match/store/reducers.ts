import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import {
  crudStoreInterface,
  getDefaultCrudStore,
} from '../../../type/store.intarface';
import { matchActions } from './actions';
import { IMatch } from '../../../type/match.type';

export interface MatchState extends crudStoreInterface {
  matchIsLoading: boolean;
  currentMatchId: number | undefined | null;
  currentMatch: IMatch | undefined | null;
  allMatches: IMatch[];
  allMatchesInSport: IMatch[];
  allMatchesInTournament: IMatch[];
}

const initialState: MatchState = {
  ...getDefaultCrudStore(),
  matchIsLoading: false,
  currentMatchId: null,
  allMatches: [],
  allMatchesInSport: [],
  allMatchesInTournament: [],
  currentMatch: null,
  errors: null,
};

const matchFeature = createFeature({
  name: 'match',
  reducer: createReducer(
    initialState,
    on(matchActions.getId, (state) => ({
      ...state,
      matchIsLoading: true,
    })),
    on(matchActions.getMatchIdSuccessfully, (state, action) => ({
      ...state,
      matchIsLoading: false,
      currentMatchId: action.matchId,
    })),
    on(matchActions.getMatchIdFailure, (state) => ({
      ...state,
      matchIsLoading: false,
    })),

    // create actions
    on(matchActions.create, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(matchActions.createdSuccessfully, (state, action) => {
      const newList = [...state.allMatches, action.currentMatch];
      const sortedTournaments = SortService.sort(newList, 'week', '-date');
      return {
        ...state,
        isSubmitting: false,
        currentMatch: action.currentMatch,
        allMatches: sortedTournaments,
        allMatchesInTournament: sortedTournaments,
      };
    }),
    on(matchActions.createFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(matchActions.delete, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(matchActions.deletedSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      allMatches: (state.allMatches || []).filter(
        (item) => item.id !== action.matchId,
      ),
      allMatchesInTournament: (state.allMatchesInTournament || []).filter(
        (item) => item.id !== action.matchId,
      ),
      errors: null,
    })),
    on(matchActions.deleteFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // update actions
    on(matchActions.update, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(matchActions.updatedSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      currentMatch: action.updatedMatch,
      allMatches: state.allMatches.map((item) =>
        item.id === action.updatedMatch.id ? action.updatedMatch : item,
      ),
      allMatchesInTournament: state.allMatchesInTournament.map((item) =>
        item.id === action.updatedMatch.id ? action.updatedMatch : item,
      ),
      errors: null,
    })),
    on(matchActions.updateFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),
    on(matchActions.updateAllMatchesInTournament, (state, { newMatch }) => {
      const newList = [...state.allMatchesInTournament, newMatch];
      const sortedMatches = SortService.sort(newList, 'week', '-date');
      return {
        ...state,
        allMatchesInSport: sortedMatches,
      };
    }),

    // get actions
    on(matchActions.get, (state) => ({
      ...state,
      isLoading: true,
      matchIsLoading: true,
    })),
    on(matchActions.getItemSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      matchIsLoading: true,
      currentMatch: action.match,
    })),
    on(matchActions.getItemFailure, (state, action) => ({
      ...state,
      isLoading: false,
      matchIsLoading: false,
      errors: action,
    })),

    on(matchActions.getAll, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(matchActions.getAllItemsSuccess, (state, action) => {
      const sortedMatches = SortService.sort(action.matches, '-date');
      return {
        ...state,
        isLoading: false,
        allMatches: sortedMatches,
      };
    }),
    on(matchActions.getAllItemsFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(matchActions.getMatchesBySportId, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(matchActions.getMatchesBySportIDSuccess, (state, action) => {
      const sortedMatches = SortService.sort(action.matches, '-date');
      return {
        ...state,
        isLoading: false,
        allMatchesInSport: sortedMatches,
      };
    }),
    on(matchActions.getMatchesBySportIDFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(matchActions.getMatchesByTournamentId, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(matchActions.getMatchesByTournamentIDSuccess, (state, action) => {
      const sortedMatches = SortService.sort(action.matches, 'week', '-date');
      return {
        ...state,
        isLoading: false,
        allMatchesInTournament: sortedMatches,
      };
    }),
    on(matchActions.getMatchesByTournamentIDFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),
  ),
});

export const {
  name: matchFeatureKey,
  reducer: matchReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectMatchIsLoading,
  selectCurrentMatchId,
  selectCurrentMatch,
  selectAllMatches,
  selectAllMatchesInSport,
  selectAllMatchesInTournament,
} = matchFeature;
