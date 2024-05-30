import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import {
  IPlayerInMatch,
  IPlayerInMatchFullData,
} from '../../../type/player.type';
import { playerInMatchActions } from './actions';

export interface PlayerInMatchState {
  playerInMatchIsLoading: boolean;
  playerInMatchIsSubmitting: boolean;
  selectedPlayerInMatchId: number | undefined | null;
  selectedPlayerInMatchLower: IPlayerInMatchFullData | undefined | null;
  currentPlayerInMatchId: number | undefined | null;
  currentPlayerInMatch: IPlayerInMatch | undefined | null;
  currentPlayerInMatchFullData: IPlayerInMatchFullData | undefined | null;
  allPlayersInMatch: IPlayerInMatch[];
  allPlayersInMatchFullData: IPlayerInMatchFullData[];
  parsedPlayersFromMatchEESL: any[] | IPlayerInMatchFullData[];
}

const initialState: PlayerInMatchState = {
  playerInMatchIsLoading: false,
  playerInMatchIsSubmitting: false,
  currentPlayerInMatchId: null,
  selectedPlayerInMatchId: null,
  selectedPlayerInMatchLower: null,
  allPlayersInMatch: [],
  allPlayersInMatchFullData: [],
  currentPlayerInMatch: null,
  currentPlayerInMatchFullData: null,
  parsedPlayersFromMatchEESL: [],
};

const playerInMatchFeature = createFeature({
  name: 'playerInMatch',
  reducer: createReducer(
    initialState,

    // getId from route
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
        // allPlayersInMatchFullData: sortedList,
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
      allPlayersInMatchFullData: (state.allPlayersInMatchFullData || []).filter(
        (item) => item.match_player.id !== action.playerInMatchId,
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

      // const newFullDataList = state.allPlayersInMatchFullData.map((item) => {
      //   if (item.match_player.id === action.updatedPlayerInMatch.id) {
      //     return {
      //       ...item,
      //       match_player: action.updatedPlayerInMatch,
      //     };
      //   } else {
      //     return item;
      //   }
      // });

      // console.log('new full data list', newFullDataList);
      // const sortedFullDataList = SortService.sort(
      //   newFullDataList,
      //   'match_number',
      // );

      return {
        ...state,
        playerInMatchIsSubmitting: false,
        currentPlayerInMatch: action.updatedPlayerInMatch,
        allPlayersInMatch: sortedList,
        // allPlayersInMatchFullData: sortedFullDataList,
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

    //get player in match full data action
    on(playerInMatchActions.getPlayerInMatchFullData, (state) => ({
      ...state,
      playerInMatchIsLoading: true,
    })),
    on(
      playerInMatchActions.getPlayerInMatchFullDataSuccess,
      (state, action) => {
        // Assume each player's unique identifier is located at player.id
        const index = state.allPlayersInMatchFullData.findIndex(
          (player) =>
            player.match_player.id ===
            action.playerInMatchFullData.match_player.id,
        );

        let updatedAllPlayersInMatchFullData = [
          ...state.allPlayersInMatchFullData,
        ];

        if (index !== -1) {
          // Player exists, so update the existing record
          updatedAllPlayersInMatchFullData[index] =
            action.playerInMatchFullData;
        } else {
          // Player doesn't exist, so add the new record
          updatedAllPlayersInMatchFullData.push(action.playerInMatchFullData);
        }

        // Continue with the updated list as before
        return {
          ...state,
          playerInMatchIsLoading: false,
          currentPlayerInMatch: action.playerInMatchFullData.match_player,
          currentPlayerInMatchFullData: action.playerInMatchFullData,
          allPlayersInMatchFullData: SortService.sort(
            updatedAllPlayersInMatchFullData,
            'match_player.match_number',
          ),
        };
      },
    ),
    on(playerInMatchActions.getItemFailure, (state, action) => ({
      ...state,
      playerInMatchIsLoading: false,
      errors: action,
    })),

    // get all actions
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
    // get all players with full data
    on(playerInMatchActions.getAllPlayersWithFullDataInMatch, (state) => ({
      ...state,
      playerInMatchIsLoading: true,
    })),
    on(
      playerInMatchActions.getAllPlayersWithFullDataInMatchSuccess,
      (state, action) => {
        const sortedTournaments = SortService.sort(
          action.playersInMatch,
          'match_player.match_number',
        );
        return {
          ...state,
          playerInMatchIsLoading: false,
          allPlayersInMatchFullData: sortedTournaments,
        };
      },
    ),
    on(
      playerInMatchActions.getAllPlayersWithFullDataInMatchFailure,
      (state, action) => ({
        ...state,
        playerInMatchIsLoading: false,
        errors: action,
      }),
    ),
    //set selected player id
    on(playerInMatchActions.setSelectedPlayerId, (state, action) => {
      return {
        ...state,
        selectedPlayerInMatchId: action.id,
      };
    }),
    on(playerInMatchActions.setSelectedPlayerIdFailure, (state, action) => {
      return {
        ...state,
        selectedPlayerInMatchId: null,
        errors: action,
      };
    }),
    //set selected player lower id
    on(playerInMatchActions.setSelectedPlayerLower, (state, action) => {
      console.log(action.player);
      return {
        ...state,
        selectedPlayerInMatchLower: action.player,
      };
    }),
    on(playerInMatchActions.setSelectedPlayerLowerFailure, (state, action) => {
      return {
        ...state,
        selectedPlayerInMatchLower: null,
        errors: action,
      };
    }),
    // get selected player lower by id
    on(playerInMatchActions.getSelectedPlayerLowerById, (state) => ({
      ...state,
      selectedPlayerInMatchLower: null,
      playerInMatchIsLoading: true,
    })),
    on(
      playerInMatchActions.getSelectedPlayerLowerByIdSuccessfully,
      (state, action) => ({
        ...state,
        playerInMatchIsLoading: false,
        selectedPlayerInMatchLower: action.player,
      }),
    ),
    on(
      playerInMatchActions.getSelectedPlayerLowerByIdFailure,
      (state, action) => ({
        ...state,
        selectedPlayerInMatchLower: null,
        playerInMatchIsLoading: false,
        errors: action,
      }),
    ),

    //pars match
    on(playerInMatchActions.parsPlayersFromMatchEESL, (state) => ({
      ...state,
      playerInMatchIsLoading: true,
    })),
    on(
      playerInMatchActions.parsedPlayerFromMatchEESLSuccessfully,
      (state, action) => {
        let updatedPlayerList: IPlayerInMatchFullData[] = [];
        action.parseList.forEach((newPlayer) => {
          let existingPlayer = state.allPlayersInMatch.find(
            (player) => player.id === newPlayer.id,
          );

          if (existingPlayer) {
            updatedPlayerList.push({ ...existingPlayer, ...newPlayer });
          } else {
            updatedPlayerList.push(newPlayer);
          }
        });
        return {
          ...state,
          allPlayersInMatchFullData: updatedPlayerList,
          playerInMatchIsLoading: false,
          parsedPlayersFromTeamEESL: action.parseList,
        };
      },
    ),

    on(playerInMatchActions.getItemFailure, (state, action) => ({
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
  selectSelectedPlayerInMatchId,
  selectCurrentPlayerInMatchId,
  selectCurrentPlayerInMatch,
  selectAllPlayersInMatch,
  selectCurrentPlayerInMatchFullData,
  selectAllPlayersInMatchFullData,
  selectSelectedPlayerInMatchLower,
  selectParsedPlayersFromMatchEESL,
} = playerInMatchFeature;
