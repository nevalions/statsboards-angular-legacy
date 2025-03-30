import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import { matchActions } from './actions';
import { IMatch, IMatchWithFullData } from '../../../type/match.type';
import { IPlayerInTeamTournament } from '../../../type/player.type';

export interface MatchState {
  matchIsLoading: boolean;
  matchIsSubmitting: boolean;
  currentMatchId: number | undefined | null;
  currentMatch: IMatch | undefined | null;
  allMatches: IMatch[];
  allMatchesInSport: IMatch[];
  allMatchesInTournament: IMatch[];
  allMatchesWithFullDataInTournament: IMatchWithFullData[];
  allMatchesInTournamentPaginated: IMatch[];
  parsedMatchesFromTournamentEESL: any[] | IPlayerInTeamTournament[];
}

const initialState: MatchState = {
  matchIsLoading: false,
  matchIsSubmitting: false,
  currentMatchId: null,
  allMatches: [],
  allMatchesInSport: [],
  allMatchesInTournament: [],
  allMatchesInTournamentPaginated: [],
  allMatchesWithFullDataInTournament: [],
  currentMatch: null,
  parsedMatchesFromTournamentEESL: [],
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
      matchIsSubmitting: true,
    })),
    on(matchActions.createdSuccessfully, (state, action) => {
      const newList = [...state.allMatches, action.currentMatch];
      const sortedTournaments = SortService.sort(newList, 'week', '-date');
      return {
        ...state,
        matchIsSubmitting: false,
        currentMatch: action.currentMatch,
        allMatches: sortedTournaments,
        allMatchesInTournament: sortedTournaments,
      };
    }),
    on(matchActions.createFailure, (state, action) => ({
      ...state,
      matchIsSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(matchActions.delete, (state) => ({
      ...state,
      matchIsSubmitting: true,
    })),
    on(matchActions.deletedSuccessfully, (state, action) => ({
      ...state,
      matchIsSubmitting: false,
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
      matchIsSubmitting: false,
      errors: action,
    })),

    // update actions
    on(matchActions.update, (state) => ({
      ...state,
      matchIsSubmitting: true,
    })),
    on(matchActions.updatedSuccessfully, (state, action) => ({
      ...state,
      matchIsSubmitting: false,
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
      matchIsSubmitting: false,
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
      matchIsLoading: true,
    })),
    on(matchActions.getItemSuccess, (state, action) => ({
      ...state,
      matchIsLoading: false,
      currentMatch: action.match,
    })),
    on(matchActions.getItemFailure, (state, action) => ({
      ...state,
      matchIsLoading: false,
      errors: action,
    })),

    on(matchActions.getAll, (state) => ({
      ...state,
      matchIsLoading: true,
    })),
    on(matchActions.getAllItemsSuccess, (state, action) => {
      const sortedMatches = SortService.sort(action.matches, '-date');
      return {
        ...state,
        matchIsLoading: false,
        allMatches: sortedMatches,
      };
    }),
    on(matchActions.getAllItemsFailure, (state, action) => ({
      ...state,
      matchIsLoading: false,
      errors: action,
    })),

    on(matchActions.getMatchesBySportId, (state) => ({
      ...state,
      matchIsLoading: true,
    })),
    on(matchActions.getMatchesBySportIDSuccess, (state, action) => {
      const sortedMatches = SortService.sort(action.matches, '-date');
      return {
        ...state,
        matchIsLoading: false,
        allMatchesInSport: sortedMatches,
      };
    }),
    on(matchActions.getMatchesBySportIDFailure, (state, action) => ({
      ...state,
      matchIsLoading: false,
      errors: action,
    })),

    on(matchActions.getMatchesByTournamentId, (state) => ({
      ...state,
      matchIsLoading: true,
    })),
    on(matchActions.getMatchesByTournamentIDSuccess, (state, action) => {
      const sortedMatches = SortService.sort(action.matches, 'week', '-date');
      return {
        ...state,
        matchIsLoading: false,
        allMatchesInTournament: sortedMatches,
      };
    }),
    on(matchActions.getMatchesByTournamentIDFailure, (state, action) => ({
      ...state,
      matchIsLoading: false,
      errors: action,
    })),

    on(matchActions.getMatchesByTournamentIdWithPagination, (state) => ({
      ...state,
      matchIsLoading: true,
    })),
    on(matchActions.getMatchesByTournamentIDWithPaginationSuccess, (state, action) => {
      const sortedMatches = SortService.sort(action.matches, 'week', '-date');
      return {
        ...state,
        matchIsLoading: false,
        allMatchesInTournamentPaginated: sortedMatches,
      };
    }),
    on(matchActions.getMatchesByTournamentIDWithPaginationFailure, (state, action) => ({
      ...state,
      matchIsLoading: false,
      errors: action,
    })),

    //pars matches from tournament EESL
    on(matchActions.parsMatchesFromTournamentEESL, (state) => ({
      ...state,
      matchIsLoading: true,
    })),
    on(
      matchActions.parsedMatchesFromTournamentEESLSuccessfully,
      (state, action) => {
        let updatedMatchList: IMatchWithFullData[] = [];
        action.parseList.forEach((newMatch) => {
          let existingMatch = state.allMatchesInTournament.find(
            (match) => match.id === newMatch.match.id,
          );

          if (existingMatch) {
            updatedMatchList.push({ ...existingMatch, ...newMatch });
          } else {
            updatedMatchList.push(newMatch);
          }
        });
        return {
          ...state,
          allMatchesWithFullDataInTournament: updatedMatchList,
          matchIsLoading: false,
          parsedMatchesFromTournamentEESL: action.parseList,
        };
      },
    ),
    on(
      matchActions.parsedMatchesFromTournamentEESLFailure,
      (state, action) => ({
        ...state,
        matchIsLoading: false,
        errors: action,
      }),
    ),
  ),
});

export const {
  name: matchFeatureKey,
  reducer: matchReducer,
  selectMatchIsLoading,
  selectMatchIsSubmitting,
  selectCurrentMatchId,
  selectCurrentMatch,
  selectAllMatches,
  selectAllMatchesInSport,
  selectAllMatchesInTournament,
  selectAllMatchesWithFullDataInTournament,
  selectAllMatchesInTournamentPaginated,
  selectParsedMatchesFromTournamentEESL,
} = matchFeature;
