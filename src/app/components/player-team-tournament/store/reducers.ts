import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import {
  IPlayerInTeamTournament,
  IPlayerInTeamTournamentFullData,
  IPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from '../../../type/player.type';
import { playerInTeamTournamentActions } from './actions';

export interface PlayerInTeamTournamentState {
  playerInTeamTournamentIsLoading: boolean;
  playerInTeamTournamentIsSubmitting: boolean;
  currentPlayerInTeamTournamentId: number | undefined | null;
  currentPlayerInTeamTournament: IPlayerInTeamTournament | undefined | null;
  allPlayersInTeamTournament: IPlayerInTeamTournament[];
  allPlayersInTeamTournamentWithPerson: IPlayerInTeamTournamentWithPersonWithSportWithPosition[];
  allHomePlayersInTeamTournamentWithPerson: IPlayerInTeamTournamentFullData[];
  allAwayPlayersInTeamTournamentWithPerson: IPlayerInTeamTournamentFullData[];
  allPlayersInTournament: IPlayerInTeamTournament[];
  parsedPlayersFromTeamEESL: any[] | IPlayerInTeamTournament[];
}

const initialState: PlayerInTeamTournamentState = {
  playerInTeamTournamentIsLoading: false,
  playerInTeamTournamentIsSubmitting: false,
  currentPlayerInTeamTournamentId: null,
  allPlayersInTeamTournament: [],
  allPlayersInTeamTournamentWithPerson: [],
  allHomePlayersInTeamTournamentWithPerson: [],
  allAwayPlayersInTeamTournamentWithPerson: [],
  allPlayersInTournament: [],
  currentPlayerInTeamTournament: null,
  parsedPlayersFromTeamEESL: [],
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
      const sortedList = SortService.sort(
        newList,
        'playerInSport.person.second_name',
      );
      const newSportList = [
        ...state.allPlayersInTournament,
        action.currentPlayerInTeamTournament,
      ];
      const sortedPlayerList = SortService.sort(
        newSportList,
        'playerInSport.person.second_name',
      );

      return {
        ...state,
        playerInTeamTournamentIsSubmitting: false,
        currentPlayerInTeamTournament: action.currentPlayerInTeamTournament,
        allPlayersInTeamTournament: sortedList,
        allPlayersInTournament: sortedPlayerList,
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
      allPlayersInTournament: (state.allPlayersInTournament || []).filter(
        (item) => item.id !== action.playerInTeamTournamentId,
      ),
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
        allPlayersInTournament: (state.allPlayersInTournament || []).filter(
          (item) => item.id !== action.playerInTeamTournamentId,
        ),
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
    on(playerInTeamTournamentActions.updatedSuccessfully, (state, action) => {
      // const playerExistsInTeamTournament =
      //   state.allPlayersInTeamTournament.some(
      //     (player) => player.id === action.updatedPlayerInTeamTournament.id,
      //   );
      //
      // const updatedAllPlayersInTeamTournament = playerExistsInTeamTournament
      //   ? state.allPlayersInTeamTournament.map((player) =>
      //       player.id === action.updatedPlayerInTeamTournament.id
      //         ? action.updatedPlayerInTeamTournament
      //         : player,
      //     )
      //   : [
      //       ...state.allPlayersInTeamTournament,
      //       action.updatedPlayerInTeamTournament,
      //     ];
      //
      // const sortedAllPlayersInTeamTournament = SortService.sort(
      //   updatedAllPlayersInTeamTournament,
      //   'playerInSport.person.second_name',
      // );

      const newList = state.allPlayersInTeamTournament.map((item) =>
        item.id === action.updatedPlayerInTeamTournament.id
          ? action.updatedPlayerInTeamTournament
          : item,
      );
      const sortedList = SortService.sort(
        newList,
        'playerInSport.person.second_name',
      );

      const newSportList = state.allPlayersInTournament.map((item) =>
        item.id === action.updatedPlayerInTeamTournament.id
          ? action.updatedPlayerInTeamTournament
          : item,
      );
      const sortedPlayerList = SortService.sort(
        newSportList,
        'playerInSport.person.second_name',
      );

      return {
        ...state,
        playerInTeamTournamentIsSubmitting: false,
        currentPlayerInTeamTournament: action.updatedPlayerInTeamTournament,
        allPlayersInTeamTournament: sortedList,
        allPlayersInTournament: sortedPlayerList,
        errors: null,
      };
    }),
    on(playerInTeamTournamentActions.updateFailure, (state, action) => ({
      ...state,
      playerInTeamTournamentIsSubmitting: false,
      errors: action,
    })),

    // update actions Add Player to team in tournament
    on(playerInTeamTournamentActions.addPlayerToTeam, (state) => ({
      ...state,
      playerInTeamTournamentIsSubmitting: true,
    })),
    on(
      // add and sort
      playerInTeamTournamentActions.playerAddedToTeamSuccessfully,
      (state, action) => {
        const newList = [
          ...state.allPlayersInTeamTournament,
          action.updatedPlayerInTeamTournament,
        ];
        const sortedList = SortService.sort(
          newList,
          'playerInSport.person.second_name',
        );
        // const newSportList = [
        //   ...state.allPlayersInTournament,
        //   action.updatedPlayerInTeamTournament,
        // ];
        // const sortedPlayerList = SortService.sort(
        //   newSportList,
        //   'playerInSport.person.second_name',
        // );

        // const newList = state.allPlayersInTeamTournament.map((item) =>
        //   item.id === action.updatedPlayerInTeamTournament.id
        //     ? action.updatedPlayerInTeamTournament
        //     : item,
        // );
        // const sortedList = SortService.sort(
        //   newList,
        //   'playerInSport.person.second_name',
        // );
        //

        // update and sort
        const newSportList = state.allPlayersInTournament.map((item) =>
          item.id === action.updatedPlayerInTeamTournament.id
            ? action.updatedPlayerInTeamTournament
            : item,
        );
        const sortedPlayerList = SortService.sort(
          newSportList,
          'playerInSport.person.second_name',
        );
        return {
          ...state,
          playerInTeamTournamentIsSubmitting: false,
          currentPlayerInTeamTournament: action.updatedPlayerInTeamTournament,
          allPlayersInTeamTournament: sortedList,
          allPlayersInTournament: sortedPlayerList,
          errors: null,
        };
      },
    ),
    on(
      playerInTeamTournamentActions.playerAddToTeamFailure,
      (state, action) => ({
        ...state,
        playerInTeamTournamentIsSubmitting: false,
        errors: action,
      }),
    ),

    // update actions Remove Player from team in tournament
    on(playerInTeamTournamentActions.removePlayerFromTeam, (state) => ({
      ...state,
      playerInTeamTournamentIsSubmitting: true,
    })),
    on(
      playerInTeamTournamentActions.removePlayerFromTeamSuccessfully,
      (state, action) => {
        // delete and remove
        const itemList = state.allPlayersInTeamTournament.filter(
          (item: IPlayerInTeamTournament) =>
            item.id !== action.updatedPlayerInTeamTournament.id,
        );

        // update and sort
        const newSportList = state.allPlayersInTournament.map((item) =>
          item.id === action.updatedPlayerInTeamTournament.id
            ? action.updatedPlayerInTeamTournament
            : item,
        );
        const sortedPlayerList = SortService.sort(
          newSportList,
          'playerInSport.person.second_name',
        );

        // const itemSportList = state.allPlayersInTournament.filter(
        //   (item: IPlayerInTeamTournament) =>
        //     item.id !== action.updatedPlayerInTeamTournament.id,
        // );

        return {
          ...state,
          playerInTeamTournamentIsSubmitting: false,
          currentPlayerInTeamTournament: action.updatedPlayerInTeamTournament,
          allPlayersInTeamTournament: itemList,
          allPlayersInTournament: sortedPlayerList,
          errors: null,
        };
      },
    ),
    on(
      playerInTeamTournamentActions.removePlayerFromTeamFailure,
      (state, action) => ({
        ...state,
        playerInTeamTournamentIsSubmitting: false,
        errors: action,
      }),
    ),

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
        'playerInSport.person.second_name',
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

    // get all with ids from route
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
          'playerInSport.person.second_name',
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

    // get all from props
    on(
      playerInTeamTournamentActions.getAllPlayerInTeamTournamentsWithPersonProps,
      (state) => ({
        ...state,
        playerInTeamTournamentIsLoading: true,
      }),
    ),
    on(
      playerInTeamTournamentActions.getAllPlayersInTeamTournamentWithPersonPropsSuccess,
      (state, action) => {
        const sortedPlayerInTeamTournaments = SortService.sort(
          action.playersInTeamTournamentWithPerson,
          'playerInSport.person.second_name',
        );
        return {
          ...state,
          playerInTeamTournamentIsLoading: false,
          allPlayersInTeamTournamentWithPerson: sortedPlayerInTeamTournaments,
        };
      },
    ),
    on(
      playerInTeamTournamentActions.getAllPlayersInTeamTournamentWithPersonPropsFailure,
      (state, action) => ({
        ...state,
        playerInTeamTournamentIsLoading: false,
        errors: action,
      }),
    ),

    // get all home away
    on(
      playerInTeamTournamentActions.getAllPlayersInTeamTournamentsForMatch,
      (state) => ({
        ...state,
        playerInTeamTournamentIsLoading: true,
      }),
    ),
    on(
      playerInTeamTournamentActions.getAllPlayersInTeamTournamentForMatchSuccess,
      (state, action) => {
        const sortedHomePlayerInTeamTournaments = SortService.sort(
          action.availablePlayers.home,
          'person.second_name',
        );
        const sortedAwayPlayerInTeamTournaments = SortService.sort(
          action.availablePlayers.away,
          'person.second_name',
        );

        return {
          ...state,
          playerInTeamTournamentIsLoading: false,
          allHomePlayersInTeamTournamentWithPerson:
            sortedHomePlayerInTeamTournaments,
          allAwayPlayersInTeamTournamentWithPerson:
            sortedAwayPlayerInTeamTournaments,
        };
      },
    ),
    on(
      playerInTeamTournamentActions.getAllPlayersInTeamTournamentWithPersonPropsFailure,
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

    //parsing
    on(playerInTeamTournamentActions.parsPlayersFromTeamEESL, (state) => ({
      ...state,
      playerInTeamTournamentIsLoading: true,
    })),
    on(
      playerInTeamTournamentActions.parsedPlayerFromTeamEESLSuccessfully,
      (state, action) => {
        // Prepare new players list
        let updatedPlayerList: IPlayerInTeamTournament[] = [];

        // Update existing players and gather new players
        action.parseList.forEach((newPlayer) => {
          let existingPlayer = state.allPlayersInTeamTournament.find(
            (player) => player.id === newPlayer.id,
          );

          if (existingPlayer) {
            // Update existing player
            updatedPlayerList.push({ ...existingPlayer, ...newPlayer });
          } else {
            // Add new player
            updatedPlayerList.push(newPlayer);
          }
        });

        // Return updated state
        return {
          ...state,
          allPlayersInTeamTournament: updatedPlayerList,
          playerInTeamTournamentIsLoading: false,
          parsedPlayersFromTeamEESL: action.parseList,
        };
      },
    ),

    on(playerInTeamTournamentActions.getItemFailure, (state, action) => ({
      ...state,
      playerInTeamTournamentIsLoading: false,
      errors: action,
    })),
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
  selectAllPlayersInTeamTournamentWithPerson,
  selectAllHomePlayersInTeamTournamentWithPerson,
  selectAllAwayPlayersInTeamTournamentWithPerson,
  selectAllPlayersInTournament,
  selectParsedPlayersFromTeamEESL,
} = playerInTeamTournamentFeature;
