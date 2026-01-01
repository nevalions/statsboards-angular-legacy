import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import { IPlayer } from '../../../type/player.type';
import { playerActions } from './actions';

export interface PlayerState {
  playerIsLoading: boolean;
  playerIsSubmitting: boolean;
  currentPlayerId: number | undefined | null;
  currentPlayer: IPlayer | undefined | null;
  allPlayers: IPlayer[];
  allSportPlayers: IPlayer[];
  errors: any | null;
}

const initialState: PlayerState = {
  playerIsLoading: false,
  playerIsSubmitting: false,
  currentPlayerId: null,
  allPlayers: [],
  allSportPlayers: [],
  currentPlayer: null,
  errors: null,
};

const playerFeature = createFeature({
  name: 'player',
  reducer: createReducer(
    initialState,

    on(playerActions.getId, (state): PlayerState => ({
      ...state,
      playerIsLoading: true,
    })),
    on(playerActions.getPlayerIdSuccessfully, (state, action): PlayerState => ({
      ...state,
      playerIsLoading: false,
      currentPlayerId: action.playerId,
    })),
    on(playerActions.getPlayerIdFailure, (state): PlayerState => ({
      ...state,
      playerIsLoading: false,
    })),

    // create actions
    on(playerActions.create, (state): PlayerState => ({
      ...state,
      playerIsSubmitting: true,
    })),
    on(playerActions.createdSuccessfully, (state, action) => {
      const newList = [...state.allPlayers, action.currentPlayer];
      const newSportList = [...state.allSportPlayers, action.currentPlayer];

      return {
        ...state,
        playerIsSubmitting: false,
        currentPlayer: action.currentPlayer,
        allPlayers: newList,
        allSportPlayers: newSportList,
      };
    }),
    on(playerActions.createFailure, (state, action): PlayerState => ({
      ...state,
      playerIsSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(playerActions.delete, (state): PlayerState => ({
      ...state,
      playerIsSubmitting: true,
    })),
    on(playerActions.deletedSuccessfully, (state, action): PlayerState => ({
      ...state,
      playerIsSubmitting: false,
      allPlayers: (state.allPlayers || []).filter(
        (item) => item.id !== action.playerId,
      ),
      allSportPlayers: (state.allPlayers || []).filter(
        (item) => item.id !== action.playerId,
      ),
      errors: null,
    })),
    on(playerActions.deleteFailure, (state, action): PlayerState => ({
      ...state,
      playerIsSubmitting: false,
      errors: action,
    })),

    // update actions
    on(playerActions.update, (state): PlayerState => ({
      ...state,
      playerIsSubmitting: true,
    })),
    on(playerActions.updatedSuccessfully, (state, action): PlayerState => ({
      ...state,
      playerIsSubmitting: false,
      currentPlayer: action.updatedPlayer,
      allPlayers: state.allPlayers.map((item) =>
        item.id === action.updatedPlayer.id ? action.updatedPlayer : item,
      ),
      allSportPlayers: state.allSportPlayers.map((item) =>
        item.id === action.updatedPlayer.id ? action.updatedPlayer : item,
      ),

      errors: null,
    })),
    on(playerActions.updateFailure, (state, action): PlayerState => ({
      ...state,
      playerIsSubmitting: false,
      errors: action,
    })),

    // get actions
    on(playerActions.get, (state): PlayerState => ({
      ...state,
      playerIsLoading: true,
    })),
    on(playerActions.getItemSuccess, (state, action): PlayerState => ({
      ...state,
      playerIsLoading: false,
      currentPlayer: action.player,
    })),
    on(playerActions.getItemFailure, (state, action): PlayerState => ({
      ...state,
      playerIsLoading: false,
      errors: action,
    })),

    on(playerActions.getAll, (state): PlayerState => ({
      ...state,
      playerIsLoading: true,
    })),
    on(playerActions.getAllItemsSuccess, (state, action) => {
      const sortedTournaments = SortService.sort(action.players, 'second_name');
      return {
        ...state,
        playerIsLoading: false,
        allPlayers: sortedTournaments,
      };
    }),
    on(playerActions.getAllItemsFailure, (state, action): PlayerState => ({
      ...state,
      playerIsLoading: false,
      errors: action,
    })),

    on(playerActions.getAllPlayersBySportId, (state): PlayerState => ({
      ...state,
      playerIsLoading: true,
    })),
    on(playerActions.getAllPlayersBySportIdSuccess, (state, action) => {
      const sortedPlayers = SortService.sort(action.players, 'id');
      return {
        ...state,
        playerIsLoading: false,
        allSportPlayers: sortedPlayers,
      };
    }),
    on(playerActions.getAllItemsFailure, (state, action): PlayerState => ({
      ...state,
      playerIsLoading: false,
      errors: action,
    })),
  ),
});

export const {
  name: playerFeatureKey,
  reducer: playerReducer,
  selectPlayerIsLoading,
  selectPlayerIsSubmitting,
  selectCurrentPlayerId,
  selectCurrentPlayer,
  selectAllPlayers,
  selectAllSportPlayers,
} = playerFeature;
