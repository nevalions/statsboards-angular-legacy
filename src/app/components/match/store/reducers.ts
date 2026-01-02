import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { matchActions } from './actions';
import { IMatch, IMatchWithFullData } from '../../../type/match.type';
import { IPlayerInTeamTournament } from '../../../type/player.type';

export interface MatchState extends EntityState<IMatch> {
  matchIsLoading: boolean;
  matchIsSubmitting: boolean;
  currentMatchId: number | undefined | null;
  currentMatch: IMatch | undefined | null;
  allMatchesInSport: IMatch[];
  allMatchesInTournament: IMatch[];
  allMatchesWithFullDataInTournament: IMatchWithFullData[];
  allMatchesInTournamentPaginated: IMatch[];
  parsedMatchesFromTournamentEESL: any[] | IPlayerInTeamTournament[];
  errors: any | null;
}

const adapter = createEntityAdapter<IMatch>({
  sortComparer: (a, b) => {
    if (a.week !== b.week) {
      return a.week - b.week;
    }
    const dateA = a.match_date ? new Date(a.match_date).getTime() : 0;
    const dateB = b.match_date ? new Date(b.match_date).getTime() : 0;
    return dateB - dateA;
  },
});

const initialState: MatchState = adapter.getInitialState({
  matchIsLoading: false,
  matchIsSubmitting: false,
  currentMatchId: null,
  allMatchesInSport: [],
  allMatchesInTournament: [],
  allMatchesInTournamentPaginated: [],
  allMatchesWithFullDataInTournament: [],
  currentMatch: null,
  parsedMatchesFromTournamentEESL: [],
  errors: null,
});

const matchFeature = createFeature({
  name: 'match',
  reducer: createReducer(
    initialState,
    on(
      matchActions.getId,
      (state): MatchState => ({
        ...state,
        matchIsLoading: true,
      }),
    ),
    on(
      matchActions.getMatchIdSuccessfully,
      (state, action): MatchState => ({
        ...state,
        matchIsLoading: false,
        currentMatchId: action.matchId,
      }),
    ),
    on(
      matchActions.getMatchIdFailure,
      (state): MatchState => ({
        ...state,
        matchIsLoading: false,
      }),
    ),

    on(
      matchActions.create,
      (state): MatchState => ({
        ...state,
        matchIsSubmitting: true,
      }),
    ),
    on(matchActions.createdSuccessfully, (state, action) => {
      return adapter.addOne(action.currentMatch, {
        ...state,
        matchIsSubmitting: false,
        currentMatch: action.currentMatch,
        allMatchesInTournament: [
          ...state.allMatchesInTournament,
          action.currentMatch,
        ],
      });
    }),
    on(
      matchActions.createFailure,
      (state, action): MatchState => ({
        ...state,
        matchIsSubmitting: false,
        errors: action,
      }),
    ),

    on(
      matchActions.delete,
      (state): MatchState => ({
        ...state,
        matchIsSubmitting: true,
      }),
    ),
    on(matchActions.deletedSuccessfully, (state, action): MatchState => {
      return adapter.removeOne(action.matchId, {
        ...state,
        matchIsSubmitting: false,
        allMatchesInTournament: state.allMatchesInTournament.filter(
          (item) => item.id !== action.matchId,
        ),
        errors: null,
      });
    }),
    on(
      matchActions.deleteFailure,
      (state, action): MatchState => ({
        ...state,
        matchIsSubmitting: false,
        errors: action,
      }),
    ),

    on(
      matchActions.update,
      (state): MatchState => ({
        ...state,
        matchIsSubmitting: true,
      }),
    ),
    on(matchActions.updatedSuccessfully, (state, action): MatchState => {
      return adapter.updateOne(
        { id: action.updatedMatch.id!, changes: action.updatedMatch },
        {
          ...state,
          matchIsSubmitting: false,
          currentMatch: action.updatedMatch,
          allMatchesInTournament: state.allMatchesInTournament.map((item) =>
            item.id === action.updatedMatch.id ? action.updatedMatch : item,
          ),
          errors: null,
        },
      );
    }),
    on(
      matchActions.updateFailure,
      (state, action): MatchState => ({
        ...state,
        matchIsSubmitting: false,
        errors: action,
      }),
    ),
    on(matchActions.updateAllMatchesInTournament, (state, { newMatch }) => {
      return adapter.addOne(newMatch, {
        ...state,
        allMatchesInSport: [...state.allMatchesInSport, newMatch],
      });
    }),

    on(
      matchActions.get,
      (state): MatchState => ({
        ...state,
        matchIsLoading: true,
      }),
    ),
    on(
      matchActions.getItemSuccess,
      (state, action): MatchState => ({
        ...state,
        matchIsLoading: false,
        currentMatch: action.match,
      }),
    ),
    on(
      matchActions.getItemFailure,
      (state, action): MatchState => ({
        ...state,
        matchIsLoading: false,
        errors: action,
      }),
    ),

    on(
      matchActions.getAll,
      (state): MatchState => ({
        ...state,
        matchIsLoading: true,
      }),
    ),
    on(matchActions.getAllItemsSuccess, (state, action) => {
      return adapter.setAll(action.matches, {
        ...state,
        matchIsLoading: false,
      });
    }),
    on(
      matchActions.getAllItemsFailure,
      (state, action): MatchState => ({
        ...state,
        matchIsLoading: false,
        errors: action,
      }),
    ),

    on(
      matchActions.getMatchesBySportId,
      (state): MatchState => ({
        ...state,
        matchIsLoading: true,
      }),
    ),
    on(matchActions.getMatchesBySportIDSuccess, (state, action) => {
      const sortedMatches = [...action.matches].sort((a, b) => {
        const dateA = a.match_date ? new Date(a.match_date).getTime() : 0;
        const dateB = b.match_date ? new Date(b.match_date).getTime() : 0;
        return dateB - dateA;
      });
      return {
        ...state,
        matchIsLoading: false,
        allMatchesInSport: sortedMatches,
      };
    }),
    on(
      matchActions.getMatchesBySportIDFailure,
      (state, action): MatchState => ({
        ...state,
        matchIsLoading: false,
        errors: action,
      }),
    ),

    on(
      matchActions.getMatchesByTournamentId,
      (state): MatchState => ({
        ...state,
        matchIsLoading: true,
      }),
    ),
    on(matchActions.getMatchesByTournamentIDSuccess, (state, action) => {
      const sortedMatches = [...action.matches].sort((a, b) => {
        if (a.week !== b.week) {
          return a.week - b.week;
        }
        const dateA = a.match_date ? new Date(a.match_date).getTime() : 0;
        const dateB = b.match_date ? new Date(b.match_date).getTime() : 0;
        return dateB - dateA;
      });
      return {
        ...state,
        matchIsLoading: false,
        allMatchesInTournament: sortedMatches,
      };
    }),
    on(
      matchActions.getMatchesByTournamentIDFailure,
      (state, action): MatchState => ({
        ...state,
        matchIsLoading: false,
        errors: action,
      }),
    ),

    on(
      matchActions.getMatchesByTournamentIdWithPagination,
      (state): MatchState => ({
        ...state,
        matchIsLoading: true,
      }),
    ),
    on(
      matchActions.getMatchesByTournamentIDWithPaginationSuccess,
      (state, action) => {
        const sortedMatches = [...action.matches].sort((a, b) => {
          if (a.week !== b.week) {
            return a.week - b.week;
          }
          const dateA = a.match_date ? new Date(a.match_date).getTime() : 0;
          const dateB = b.match_date ? new Date(b.match_date).getTime() : 0;
          return dateB - dateA;
        });
        return {
          ...state,
          matchIsLoading: false,
          allMatchesInTournamentPaginated: sortedMatches,
        };
      },
    ),
    on(
      matchActions.getMatchesByTournamentIDWithPaginationFailure,
      (state, action): MatchState => ({
        ...state,
        matchIsLoading: false,
        errors: action,
      }),
    ),

    on(
      matchActions.parsMatchesFromTournamentEESL,
      (state): MatchState => ({
        ...state,
        matchIsLoading: true,
      }),
    ),
    on(
      matchActions.parsedMatchesFromTournamentEESLSuccessfully,
      (state, action) => {
        let updatedMatchList: IMatchWithFullData[] = [];
        action.parseList.forEach((newMatch) => {
          let existingMatch = state.allMatchesWithFullDataInTournament.find(
            (match) => match.id === newMatch.id,
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

const { selectAll } = adapter.getSelectors();

export const {
  name: matchFeatureKey,
  reducer: matchReducer,
  selectMatchIsLoading,
  selectMatchIsSubmitting,
  selectCurrentMatchId,
  selectCurrentMatch,
  selectAllMatchesInSport,
  selectAllMatchesInTournament,
  selectAllMatchesWithFullDataInTournament,
  selectAllMatchesInTournamentPaginated,
  selectParsedMatchesFromTournamentEESL,
} = matchFeature;

export const selectAllMatches = createSelector(
  matchFeature.selectMatchState,
  selectAll,
);
