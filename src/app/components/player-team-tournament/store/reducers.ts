import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createSelector, createReducer, on } from '@ngrx/store';
import {
  IPlayerInTeamTournament,
  IPlayerInTeamTournamentFullData,
} from '../../../type/player.type';
import { playerInTeamTournamentActions } from './actions';

export interface PlayerInTeamTournamentState extends EntityState<IPlayerInTeamTournament> {
  playerInTeamTournamentIsLoading: boolean;
  playerInTeamTournamentIsSubmitting: boolean;
  currentPlayerInTeamTournamentId: number | undefined | null;
  currentPlayerInTeamTournament: IPlayerInTeamTournament | undefined | null;
  allPlayersInTeamTournamentWithPerson: IPlayerInTeamTournamentFullData[];
  allHomePlayersInTeamTournamentWithPerson: IPlayerInTeamTournamentFullData[];
  allAwayPlayersInTeamTournamentWithPerson: IPlayerInTeamTournamentFullData[];
  allPlayersInTournament: IPlayerInTeamTournament[];
  parsedPlayersFromTeamEESL: any[] | IPlayerInTeamTournament[];
  errors: any | null;
}

const adapter = createEntityAdapter<IPlayerInTeamTournament>();

const initialState: PlayerInTeamTournamentState = adapter.getInitialState({
  playerInTeamTournamentIsLoading: false,
  playerInTeamTournamentIsSubmitting: false,
  currentPlayerInTeamTournamentId: null,
  allPlayersInTeamTournamentWithPerson: [],
  allHomePlayersInTeamTournamentWithPerson: [],
  allAwayPlayersInTeamTournamentWithPerson: [],
  allPlayersInTournament: [],
  currentPlayerInTeamTournament: null,
  parsedPlayersFromTeamEESL: [],
  errors: null,
});

const playerInTeamTournamentFeature = createFeature({
  name: 'playerInTeamTournament',
  reducer: createReducer(
    initialState,

    on(
      playerInTeamTournamentActions.getId,
      (state): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsLoading: true,
      }),
    ),
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

    on(
      playerInTeamTournamentActions.create,
      (state): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsSubmitting: true,
      }),
    ),
    on(playerInTeamTournamentActions.createdSuccessfully, (state, action) => {
      return adapter.addOne(action.currentPlayerInTeamTournament, {
        ...state,
        playerInTeamTournamentIsSubmitting: false,
        currentPlayerInTeamTournament: action.currentPlayerInTeamTournament,
        allPlayersInTournament: [
          ...state.allPlayersInTournament,
          action.currentPlayerInTeamTournament,
        ],
      });
    }),
    on(
      playerInTeamTournamentActions.createFailure,
      (state, action): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsSubmitting: false,
        errors: action,
      }),
    ),

    on(
      playerInTeamTournamentActions.delete,
      (state): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsSubmitting: true,
      }),
    ),
    on(
      playerInTeamTournamentActions.deletedSuccessfully,
      (state, action): PlayerInTeamTournamentState => {
        return adapter.removeOne(action.playerInTeamTournamentId, {
          ...state,
          playerInTeamTournamentIsSubmitting: false,
          allPlayersInTournament: state.allPlayersInTournament.filter(
            (item) => item.id !== action.playerInTeamTournamentId,
          ),
          errors: null,
        });
      },
    ),
    on(
      playerInTeamTournamentActions.deleteFailure,
      (state, action): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsSubmitting: false,
        errors: action,
      }),
    ),

    on(
      playerInTeamTournamentActions.deleteById,
      (state): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsSubmitting: true,
      }),
    ),
    on(
      playerInTeamTournamentActions.deletedByIdSuccessfully,
      (state, action) => {
        return adapter.removeOne(action.playerInTeamTournamentId, {
          ...state,
          playerInTeamTournamentIsSubmitting: false,
          allPlayersInTournament: state.allPlayersInTournament.filter(
            (item) => item.id !== action.playerInTeamTournamentId,
          ),
          errors: null,
        });
      },
    ),
    on(
      playerInTeamTournamentActions.deleteByIdFailure,
      (state, action): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsSubmitting: false,
        errors: action,
      }),
    ),

    on(
      playerInTeamTournamentActions.update,
      (state): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsSubmitting: true,
      }),
    ),
    on(playerInTeamTournamentActions.updatedSuccessfully, (state, action) => {
      return adapter.updateOne(
        {
          id: action.updatedPlayerInTeamTournament.id!,
          changes: action.updatedPlayerInTeamTournament,
        },
        {
          ...state,
          playerInTeamTournamentIsSubmitting: false,
          currentPlayerInTeamTournament: action.updatedPlayerInTeamTournament,
          allPlayersInTournament: state.allPlayersInTournament.map((item) =>
            item.id === action.updatedPlayerInTeamTournament.id
              ? action.updatedPlayerInTeamTournament
              : item,
          ),
          errors: null,
        },
      );
    }),
    on(
      playerInTeamTournamentActions.updateFailure,
      (state, action): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsSubmitting: false,
        errors: action,
      }),
    ),

    on(
      playerInTeamTournamentActions.addPlayerToTeam,
      (state): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsSubmitting: true,
      }),
    ),
    on(
      playerInTeamTournamentActions.playerAddedToTeamSuccessfully,
      (state, action) => {
        return adapter.addOne(action.updatedPlayerInTeamTournament, {
          ...state,
          playerInTeamTournamentIsSubmitting: false,
          currentPlayerInTeamTournament: action.updatedPlayerInTeamTournament,
          allPlayersInTournament: state.allPlayersInTournament.map((item) =>
            item.id === action.updatedPlayerInTeamTournament.id
              ? action.updatedPlayerInTeamTournament
              : item,
          ),
          errors: null,
        });
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

    on(
      playerInTeamTournamentActions.removePlayerFromTeam,
      (state): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsSubmitting: true,
      }),
    ),
    on(
      playerInTeamTournamentActions.removePlayerFromTeamSuccessfully,
      (state, action) => {
        const newSportList = state.allPlayersInTournament.map((item) =>
          item.id === action.updatedPlayerInTeamTournament.id
            ? action.updatedPlayerInTeamTournament
            : item,
        );
        return adapter.removeOne(action.updatedPlayerInTeamTournament.id || 0, {
          ...state,
          playerInTeamTournamentIsSubmitting: false,
          currentPlayerInTeamTournament: action.updatedPlayerInTeamTournament,
          allPlayersInTournament: newSportList,
          errors: null,
        });
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

    on(
      playerInTeamTournamentActions.get,
      (state): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsLoading: true,
      }),
    ),
    on(
      playerInTeamTournamentActions.getItemSuccess,
      (state, action): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsLoading: false,
        currentPlayerInTeamTournament: action.playerInTeamTournament,
      }),
    ),
    on(
      playerInTeamTournamentActions.getItemFailure,
      (state, action): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsLoading: false,
        errors: action,
      }),
    ),

    on(
      playerInTeamTournamentActions.getAll,
      (state): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsLoading: true,
      }),
    ),
    on(playerInTeamTournamentActions.getAllItemsSuccess, (state, action) => {
      return adapter.setAll(action.playerInTeamTournaments, {
        ...state,
        playerInTeamTournamentIsLoading: false,
      });
    }),
    on(
      playerInTeamTournamentActions.getAllItemsFailure,
      (state, action): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsLoading: false,
        errors: action,
      }),
    ),

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
        return adapter.setAll(action.playersInTeamTournament, {
          ...state,
          playerInTeamTournamentIsLoading: false,
        });
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
      playerInTeamTournamentActions.getAllPlayerInTeamTournamentsWithPersonProps,
      (state) => ({
        ...state,
        playerInTeamTournamentIsLoading: true,
      }),
    ),
    on(
      playerInTeamTournamentActions.getAllPlayersInTeamTournamentWithPersonPropsSuccess,
      (state, action) => {
        return {
          ...state,
          playerInTeamTournamentIsLoading: false,
          allPlayersInTeamTournamentWithPerson:
            action.playersInTeamTournamentWithPerson,
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
      playerInTeamTournamentActions.getAllPlayersInTeamTournamentsForMatch,
      (state) => ({
        ...state,
        playerInTeamTournamentIsLoading: true,
      }),
    ),
    on(
      playerInTeamTournamentActions.getAllPlayersInTeamTournamentForMatchSuccess,
      (state, action) => {
        const sortedHomePlayerInTeamTournaments = [
          ...action.availablePlayers.home,
        ].sort((a, b) => {
          const nameA = a.person?.second_name || '';
          const nameB = b.person?.second_name || '';
          return nameA.localeCompare(nameB);
        });
        const sortedAwayPlayerInTeamTournaments = [
          ...action.availablePlayers.away,
        ].sort((a, b) => {
          const nameA = a.person?.second_name || '';
          const nameB = b.person?.second_name || '';
          return nameA.localeCompare(nameB);
        });

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
        const sortedPlayerInTeamTournaments = [
          ...action.playersInTeamTournament,
        ].sort((a, b) => {
          return (a.id || 0) - (b.id || 0);
        });
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

    on(
      playerInTeamTournamentActions.parsPlayersFromTeamEESL,
      (state): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsLoading: true,
      }),
    ),
    on(
      playerInTeamTournamentActions.parsedPlayerFromTeamEESLSuccessfully,
      (state, action) => {
        let updatedPlayerList: IPlayerInTeamTournament[] = [];
        action.parseList.forEach((newPlayer) => {
          let existingPlayer = state.allPlayersInTournament.find(
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
          allPlayersInTournament: updatedPlayerList,
          playerInTeamTournamentIsLoading: false,
          parsedPlayersFromTeamEESL: action.parseList,
        };
      },
    ),

    on(
      playerInTeamTournamentActions.getItemFailure,
      (state, action): PlayerInTeamTournamentState => ({
        ...state,
        playerInTeamTournamentIsLoading: false,
        errors: action,
      }),
    ),
  ),
});

const { selectAll } = adapter.getSelectors();

export const {
  name: playerInTeamTournamentFeatureKey,
  reducer: playerInTeamTournamentReducer,
  selectPlayerInTeamTournamentIsLoading,
  selectPlayerInTeamTournamentIsSubmitting,
  selectCurrentPlayerInTeamTournamentId,
  selectCurrentPlayerInTeamTournament,
  selectAllPlayersInTeamTournamentWithPerson,
  selectAllHomePlayersInTeamTournamentWithPerson,
  selectAllAwayPlayersInTeamTournamentWithPerson,
  selectAllPlayersInTournament,
  selectParsedPlayersFromTeamEESL,
  selectPlayerInTeamTournamentState,
} = playerInTeamTournamentFeature;

export const selectAllPlayersInTeamTournament = createSelector(
  selectPlayerInTeamTournamentState,
  selectAll,
);
