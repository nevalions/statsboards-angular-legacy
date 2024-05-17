import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import { playerInMatchActions } from './actions';
import {
  IPlayerInMatch,
  IPlayerInMatchFullData,
} from '../../../type/player.type';

export interface PlayerInMatchState {
  playerInMatchIsLoading: boolean;
  playerInMatchIsSubmitting: boolean;
  currentPlayerInMatchId: number | undefined | null;
  currentPlayerInMatch: IPlayerInMatch | undefined | null;
  allPlayersInMatch: IPlayerInMatch[];
  // allPlayersInMatchFullData: IPlayerInMatchFullData[];
  // parsedPlayersFromTeamEESL: any[] | IPlayerInMatch[];
}

const initialState: PlayerInMatchState = {
  playerInMatchIsLoading: false,
  playerInMatchIsSubmitting: false,
  currentPlayerInMatchId: null,
  allPlayersInMatch: [],
  // allPlayersInMatchFullData: [],
  currentPlayerInMatch: null,
  // parsedPlayersFromTeamEESL: [],
};

const playerInMatchFeature = createFeature({
  name: 'playerInMatch',
  reducer: createReducer(
    initialState,

    on(playerInMatchActions.getId, (state) => ({
      ...state,
      playerInMatchIsLoading: true,
    })),
    on(
      playerInMatchActions.getPlayerInMatchIdSuccessfully,
      (state, action) => ({
        ...state,
        playerInMatchIsLoading: false,
        currentPlayerInMatchId: action.playerInMatchId,
      }),
    ),
    on(playerInMatchActions.getPlayerInMatchIdFailure, (state) => ({
      ...state,
      playerInMatchIsLoading: false,
    })),

    // create actions
    on(playerInMatchActions.create, (state) => ({
      ...state,
      playerInMatchIsSubmitting: true,
    })),
    on(playerInMatchActions.createdSuccessfully, (state, action) => {
      const newList = [...state.allPlayersInMatch, action.currentPlayerInMatch];
      const sortedList = SortService.sort(newList, 'match_number');

      return {
        ...state,
        playerInMatchIsSubmitting: false,
        currentPlayerInMatch: action.currentPlayerInMatch,
        allPlayersInMatch: sortedList,
      };
    }),
    on(playerInMatchActions.createFailure, (state, action) => ({
      ...state,
      playerInMatchIsSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(playerInMatchActions.delete, (state) => ({
      ...state,
      playerInMatchIsSubmitting: true,
    })),
    on(playerInMatchActions.deletedSuccessfully, (state, action) => ({
      ...state,
      playerInMatchIsSubmitting: false,
      allPlayersInMatch: (state.allPlayersInMatch || []).filter(
        (item) => item.id !== action.playerInMatchId,
      ),
      errors: null,
    })),
    on(playerInMatchActions.deleteFailure, (state, action) => ({
      ...state,
      playerInMatchIsSubmitting: false,
      errors: action,
    })),

    on(playerInMatchActions.deleteById, (state) => ({
      ...state,
      playerInMatchIsSubmitting: true,
    })),
    on(playerInMatchActions.deletedByIdSuccessfully, (state, action) => ({
      ...state,
      playerInMatchIsSubmitting: false,
      allPlayersInMatch: (state.allPlayersInMatch || []).filter(
        (item) => item.id !== action.playerInMatchId,
      ),
      errors: null,
    })),
    on(playerInMatchActions.deleteByIdFailure, (state, action) => ({
      ...state,
      playerInMatchIsSubmitting: false,
      errors: action,
    })),

    // update actions
    on(playerInMatchActions.update, (state) => ({
      ...state,
      playerInMatchIsSubmitting: true,
    })),
    on(playerInMatchActions.updatedSuccessfully, (state, action) => {
      const newList = state.allPlayersInMatch.map((item) =>
        item.id === action.updatedPlayerInMatch.id
          ? action.updatedPlayerInMatch
          : item,
      );
      const sortedList = SortService.sort(newList, 'match_number');

      return {
        ...state,
        playerInMatchIsSubmitting: false,
        currentPlayerInMatch: action.updatedPlayerInMatch,
        allPlayersInMatch: sortedList,
        errors: null,
      };
    }),
    on(playerInMatchActions.updateFailure, (state, action) => ({
      ...state,
      playerInMatchIsSubmitting: false,
      errors: action,
    })),

    // get actions
    on(playerInMatchActions.get, (state) => ({
      ...state,
      playerInMatchIsLoading: true,
    })),
    on(playerInMatchActions.getItemSuccess, (state, action) => ({
      ...state,
      playerInMatchIsLoading: false,
      currentPlayerInMatch: action.playerInMatch,
    })),
    on(playerInMatchActions.getItemFailure, (state, action) => ({
      ...state,
      playerInMatchIsLoading: false,
      errors: action,
    })),

    on(playerInMatchActions.getAllPlayersInMatch, (state) => ({
      ...state,
      playerInMatchIsLoading: true,
    })),
    on(playerInMatchActions.getAllPlayersInMatchSuccess, (state, action) => {
      const sortedTournaments = SortService.sort(
        action.playersInMatch,
        'match_number',
      );
      return {
        ...state,
        playerInMatchIsLoading: false,
        allPlayersInMatch: sortedTournaments,
      };
    }),
    on(playerInMatchActions.getAllPlayersInMatchFailure, (state, action) => ({
      ...state,
      playerInMatchIsLoading: false,
      errors: action,
    })),
  ),
});

export const {
  name: playerInMatchFeatureKey,
  reducer: playerInMatchReducer,
  selectPlayerInMatchIsLoading,
  selectPlayerInMatchIsSubmitting,
  selectCurrentPlayerInMatchId,
  selectCurrentPlayerInMatch,
  selectAllPlayersInMatch,
} = playerInMatchFeature;
