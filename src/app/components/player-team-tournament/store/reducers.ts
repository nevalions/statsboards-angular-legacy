import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import { playerInTeamTournamentActions } from './actions';
import { IPlayerInTeamTournament } from '../../../type/player.type';

export interface PlayerInTeamTournamentState {
  playerInTeamTournamentIsLoading: boolean;
  playerInTeamTournamentIsSubmitting: boolean;
  currentPlayerInTeamTournamentId: number | undefined | null;
  currentPlayerInTeamTournament: IPlayerInTeamTournament | undefined | null;
  allPlayersInTeamTournament: IPlayerInTeamTournament[];
  allPlayersInTournament: IPlayerInTeamTournament[];
}

const initialState: PlayerInTeamTournamentState = {
  playerInTeamTournamentIsLoading: false,
  playerInTeamTournamentIsSubmitting: false,
  currentPlayerInTeamTournamentId: null,
  allPlayersInTeamTournament: [],
  allPlayersInTournament: [],
  currentPlayerInTeamTournament: null,
};

const playerInTeamTournamentFeature = createFeature({
  name: 'playerInTeamTournament',
  reducer: createReducer(
    initialState,

    on(playerInTeamTournamentActions.getId, (state) => ({
      ...state,
      playerInTeamTournamentIsLoading: true,
    })),
    on(
      playerInTeamTournamentActions.getPlayerInTeamTournamentIdSuccessfully,
      (state, action) => ({
        ...state,
        playerInTeamTournamentIsLoading: false,
        currentPlayerInTeamTournamentId: action.playerInTeamTournamentId,
      }),
    ),
    on(
      playerInTeamTournamentActions.getPlayerInTeamTournamentIdFailure,
      (state) => ({
        ...state,
        playerInTeamTournamentIsLoading: false,
      }),
    ),

    // create actions
    on(playerInTeamTournamentActions.create, (state) => ({
      ...state,
      playerInTeamTournamentIsSubmitting: true,
    })),
    on(playerInTeamTournamentActions.createdSuccessfully, (state, action) => {
      const newList = [
        ...state.allPlayersInTeamTournament,
        action.currentPlayerInTeamTournament,
      ];
      const sortedList = SortService.sort(newList, 'title');
      // const newSportList = [
      //   ...state.allSportPlayersInTeamTournament,
      //   action.currentPlayerInTeamTournament,
      // ];
      // const sortedSportList = SortService.sort(newSportList, 'title');

      return {
        ...state,
        playerInTeamTournamentIsSubmitting: false,
        currentPlayerInTeamTournament: action.currentPlayerInTeamTournament,
        allPlayersInTeamTournament: sortedList,
        // allSportPlayersInTeamTournament: sortedSportList,
      };
    }),
    on(playerInTeamTournamentActions.createFailure, (state, action) => ({
      ...state,
      playerInTeamTournamentIsSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(playerInTeamTournamentActions.delete, (state) => ({
      ...state,
      playerInTeamTournamentIsSubmitting: true,
    })),
    on(playerInTeamTournamentActions.deletedSuccessfully, (state, action) => ({
      ...state,
      playerInTeamTournamentIsSubmitting: false,
      allPlayersInTeamTournament: (
        state.allPlayersInTeamTournament || []
      ).filter((item) => item.id !== action.playerInTeamTournamentId),
      // allSportPlayersInTeamTournament: (
      //   state.allSportPlayersInTeamTournament || []
      // ).filter((item) => item.id !== action.playerInTeamTournamentId),
      errors: null,
    })),
    on(playerInTeamTournamentActions.deleteFailure, (state, action) => ({
      ...state,
      playerInTeamTournamentIsSubmitting: false,
      errors: action,
    })),

    on(playerInTeamTournamentActions.deleteById, (state) => ({
      ...state,
      playerInTeamTournamentIsSubmitting: true,
    })),
    on(
      playerInTeamTournamentActions.deletedByIdSuccessfully,
      (state, action) => ({
        ...state,
        playerInTeamTournamentIsSubmitting: false,
        allPlayersInTeamTournament: (
          state.allPlayersInTeamTournament || []
        ).filter((item) => item.id !== action.playerInTeamTournamentId),
        // allSportPlayersInTeamTournament: (
        //   state.allSportPlayersInTeamTournament || []
        // ).filter((item) => item.id !== action.playerInTeamTournamentId),
        errors: null,
      }),
    ),
    on(playerInTeamTournamentActions.deleteByIdFailure, (state, action) => ({
      ...state,
      playerInTeamTournamentIsSubmitting: false,
      errors: action,
    })),

    // update actions
    on(playerInTeamTournamentActions.update, (state) => ({
      ...state,
      playerInTeamTournamentIsSubmitting: true,
    })),
    on(playerInTeamTournamentActions.updatedSuccessfully, (state, action) => ({
      ...state,
      playerInTeamTournamentIsSubmitting: false,
      currentPlayerInTeamTournament: action.updatedPlayerInTeamTournament,
      allPlayersInTeamTournament: SortService.sort(
        state.allPlayersInTeamTournament.map((item) =>
          item.id === action.updatedPlayerInTeamTournament.id
            ? action.updatedPlayerInTeamTournament
            : item,
        ),
        'title',
      ),
      // allSportPlayersInTeamTournament: SortService.sort(
      //   state.allSportPlayersInTeamTournament.map((item) =>
      //     item.id === action.updatedPlayerInTeamTournament.id
      //       ? action.updatedPlayerInTeamTournament
      //       : item,
      //   ),
      //   'title',
      // ),
      errors: null,
    })),
    on(playerInTeamTournamentActions.updateFailure, (state, action) => ({
      ...state,
      playerInTeamTournamentIsSubmitting: false,
      errors: action,
    })),

    // get actions
    on(playerInTeamTournamentActions.get, (state) => ({
      ...state,
      playerInTeamTournamentIsLoading: true,
    })),
    on(playerInTeamTournamentActions.getItemSuccess, (state, action) => ({
      ...state,
      playerInTeamTournamentIsLoading: false,
      currentPlayerInTeamTournament: action.playerInTeamTournament,
    })),
    on(playerInTeamTournamentActions.getItemFailure, (state, action) => ({
      ...state,
      playerInTeamTournamentIsLoading: false,
      errors: action,
    })),

    on(playerInTeamTournamentActions.getAll, (state) => ({
      ...state,
      playerInTeamTournamentIsLoading: true,
    })),
    on(playerInTeamTournamentActions.getAllItemsSuccess, (state, action) => {
      const sortedTournaments = SortService.sort(
        action.playerInTeamTournaments,
        'title',
      );
      return {
        ...state,
        playerInTeamTournamentIsLoading: false,
        allPlayersInTeamTournament: sortedTournaments,
      };
    }),
    on(playerInTeamTournamentActions.getAllItemsFailure, (state, action) => ({
      ...state,
      playerInTeamTournamentIsLoading: false,
      errors: action,
    })),

    on(
      playerInTeamTournamentActions.getAllPlayerInTeamTournamentsByTeamIdTournamentId,
      (state) => ({
        ...state,
        playerInTeamTournamentIsLoading: true,
      }),
    ),
    on(
      playerInTeamTournamentActions.getAllPlayersInTeamTournamentByTeamIdAndTournamentIdSuccess,
      (state, action) => {
        const sortedPlayerInTeamTournaments = SortService.sort(
          action.playersInTeamTournament,
          'person.second_name',
        );
        return {
          ...state,
          playerInTeamTournamentIsLoading: false,
          allPlayersInTeamTournament: sortedPlayerInTeamTournaments,
        };
      },
    ),
    on(
      playerInTeamTournamentActions.getAllPlayersInTeamTournamentByTeamIdAndTournamentIdFailure,
      (state, action) => ({
        ...state,
        playerInTeamTournamentIsLoading: false,
        errors: action,
      }),
    ),

    on(
      playerInTeamTournamentActions.getAllPlayersInTournamentByTournamentId,
      (state) => ({
        ...state,
        playerInTeamTournamentIsLoading: true,
      }),
    ),
    on(
      playerInTeamTournamentActions.getAllPlayersInTournamentByTournamentIdSuccess,
      (state, action) => {
        const sortedPlayerInTeamTournaments = SortService.sort(
          action.playersInTeamTournament,
          'id',
        );
        return {
          ...state,
          playerInTeamTournamentIsLoading: false,
          allPlayersInTournament: sortedPlayerInTeamTournaments,
        };
      },
    ),
    on(
      playerInTeamTournamentActions.getAllPlayersInTournamentByTournamentIdFailure,
      (state, action) => ({
        ...state,
        playerInTeamTournamentIsLoading: false,
        errors: action,
      }),
    ),
  ),
});

export const {
  name: playerInTeamTournamentFeatureKey,
  reducer: playerInTeamTournamentReducer,
  selectPlayerInTeamTournamentIsLoading,
  selectPlayerInTeamTournamentIsSubmitting,
  selectCurrentPlayerInTeamTournamentId,
  selectCurrentPlayerInTeamTournament,
  selectAllPlayersInTeamTournament,
  selectAllPlayersInTournament,
} = playerInTeamTournamentFeature;
