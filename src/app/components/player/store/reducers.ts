import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createSelector, createFeature, createReducer, on } from '@ngrx/store';
import { IPlayer } from '../../../type/player.type';
import { playerActions } from './actions';

export interface PlayerState extends EntityState<IPlayer> {
  playerIsLoading: boolean;
  playerIsSubmitting: boolean;
  currentPlayerId: number | undefined | null;
  currentPlayer: IPlayer | undefined | null;
  allSportPlayers: IPlayer[];
  errors: any | null;
}

const adapter = createEntityAdapter<IPlayer>({
  sortComparer: (a: IPlayer, b: IPlayer) => {
    if (a.id === undefined || a.id === null) return 1;
    if (b.id === undefined || b.id === null) return -1;
    return a.id - b.id;
  },
});

const initialState: PlayerState = adapter.getInitialState({
  playerIsLoading: false,
  playerIsSubmitting: false,
  currentPlayerId: null,
  allSportPlayers: [],
  currentPlayer: null,
  errors: null,
});

const playerFeature = createFeature({
  name: 'player',
  reducer: createReducer(
    initialState,
    on(
      playerActions.getId,
      (state): PlayerState => ({
        ...state,
        playerIsLoading: true,
      }),
    ),
    on(
      playerActions.getPlayerIdSuccessfully,
      (state, action): PlayerState => ({
        ...state,
        playerIsLoading: false,
        currentPlayerId: action.playerId,
      }),
    ),
    on(
      playerActions.getPlayerIdFailure,
      (state): PlayerState => ({
        ...state,
        playerIsLoading: false,
      }),
    ),

    on(
      playerActions.create,
      (state): PlayerState => ({
        ...state,
        playerIsSubmitting: true,
      }),
    ),
    on(playerActions.createdSuccessfully, (state, action) => {
      const newSportList = [...state.allSportPlayers, action.currentPlayer];
      return adapter.addOne(action.currentPlayer, {
        ...state,
        playerIsSubmitting: false,
        currentPlayer: action.currentPlayer,
        allSportPlayers: newSportList,
      });
    }),
    on(
      playerActions.createFailure,
      (state, action): PlayerState => ({
        ...state,
        playerIsSubmitting: false,
        errors: action,
      }),
    ),

    on(
      playerActions.delete,
      (state): PlayerState => ({
        ...state,
        playerIsSubmitting: true,
      }),
    ),
    on(playerActions.deletedSuccessfully, (state, action) => {
      if (action.playerId !== null && action.playerId !== undefined) {
        return adapter.removeOne(action.playerId, {
          ...state,
          playerIsSubmitting: false,
          allSportPlayers: state.allSportPlayers.filter(
            (item) => item.id !== action.playerId,
          ),
          errors: null,
        });
      }
      return {
        ...state,
        playerIsSubmitting: false,
        errors: null,
      };
    }),
    on(
      playerActions.deleteFailure,
      (state, action): PlayerState => ({
        ...state,
        playerIsSubmitting: false,
        errors: action,
      }),
    ),

    on(
      playerActions.update,
      (state): PlayerState => ({
        ...state,
        playerIsSubmitting: true,
      }),
    ),
    on(playerActions.updatedSuccessfully, (state, action) => {
      if (action.updatedPlayer.id) {
        return adapter.updateOne(
          { id: action.updatedPlayer.id, changes: action.updatedPlayer },
          {
            ...state,
            playerIsSubmitting: false,
            currentPlayer: action.updatedPlayer,
            allSportPlayers: state.allSportPlayers.map((item) =>
              item.id === action.updatedPlayer.id ? action.updatedPlayer : item,
            ),
            errors: null,
          },
        );
      }
      return {
        ...state,
        playerIsSubmitting: false,
        currentPlayer: action.updatedPlayer,
        allSportPlayers: state.allSportPlayers.map((item) =>
          item.id === action.updatedPlayer.id ? action.updatedPlayer : item,
        ),
        errors: null,
      };
    }),
    on(
      playerActions.updateFailure,
      (state, action): PlayerState => ({
        ...state,
        playerIsSubmitting: false,
        errors: action,
      }),
    ),

    on(
      playerActions.get,
      (state): PlayerState => ({
        ...state,
        playerIsLoading: true,
      }),
    ),
    on(
      playerActions.getItemSuccess,
      (state, action): PlayerState => ({
        ...state,
        playerIsLoading: false,
        currentPlayer: action.player,
      }),
    ),
    on(
      playerActions.getItemFailure,
      (state, action): PlayerState => ({
        ...state,
        playerIsLoading: false,
        errors: action,
      }),
    ),

    on(
      playerActions.getAll,
      (state): PlayerState => ({
        ...state,
        playerIsLoading: true,
      }),
    ),
    on(playerActions.getAllItemsSuccess, (state, action) =>
      adapter.setAll(action.players, {
        ...state,
        playerIsLoading: false,
      }),
    ),
    on(
      playerActions.getAllItemsFailure,
      (state, action): PlayerState => ({
        ...state,
        playerIsLoading: false,
        errors: action,
      }),
    ),

    on(
      playerActions.getAllPlayersBySportId,
      (state): PlayerState => ({
        ...state,
        playerIsLoading: true,
      }),
    ),
    on(playerActions.getAllPlayersBySportIdSuccess, (state, action) => {
      return {
        ...state,
        playerIsLoading: false,
        allSportPlayers: action.players,
      };
    }),
    on(
      playerActions.getAllItemsFailure,
      (state, action): PlayerState => ({
        ...state,
        playerIsLoading: false,
        errors: action,
      }),
    ),
  ),
});

const { selectAll } = adapter.getSelectors();

export const {
  name: playerFeatureKey,
  reducer: playerReducer,
  selectPlayerIsLoading,
  selectPlayerIsSubmitting,
  selectCurrentPlayerId,
  selectCurrentPlayer,
  selectAllSportPlayers,
  selectPlayerState,
} = playerFeature;

export const selectAllPlayers = createSelector(selectPlayerState, selectAll);
