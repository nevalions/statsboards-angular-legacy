import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createSelector, createReducer, on } from '@ngrx/store';
import { ITeamTournament } from '../../../type/team.type';
import { teamTournamentActions } from './actions';
import { tournamentActions } from '../../tournament/store/actions';

export interface TeamTournamentState extends EntityState<ITeamTournament> {
  isLoading: boolean;
  isSubmitting: boolean;
  currentTeamTournamentId: number | undefined | null;
  currentTeamTournament: ITeamTournament | undefined | null;
  errors: any | null;
}

const adapter = createEntityAdapter<ITeamTournament>({
  sortComparer: false,
});

const initialState: TeamTournamentState = adapter.getInitialState({
  isLoading: false,
  isSubmitting: false,
  currentTeamTournamentId: null,
  currentTeamTournament: null,
  errors: null,
});

const teamTournamentFeature = createFeature({
  name: 'teamTournament',
  reducer: createReducer(
    initialState,
    on(
      teamTournamentActions.getId,
      (state): TeamTournamentState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      teamTournamentActions.getTeamTournamentConnectionIdSuccessfully,
      (state, action) => ({
        ...state,
        isLoading: false,
        currentTournamentId: action.teamTournamentId,
      }),
    ),
    on(
      teamTournamentActions.getTeamTournamentConnectionIdFailure,
      (state): TeamTournamentState => ({
        ...state,
        isLoading: false,
      }),
    ),

    // create actions
    on(
      teamTournamentActions.create,
      (state): TeamTournamentState => ({
        ...state,
        isSubmitting: true,
      }),
    ),
    on(teamTournamentActions.createdSuccessfully, (state, action) =>
      adapter.addOne(action.currentTeamTournament, {
        ...state,
        isSubmitting: false,
        currentTeamTournament: action.currentTeamTournament,
      }),
    ),
    on(
      teamTournamentActions.createFailure,
      (state, action): TeamTournamentState => ({
        ...state,
        isSubmitting: false,
        errors: action,
      }),
    ),

    // delete actions
    on(
      teamTournamentActions.delete,
      (state): TeamTournamentState => ({
        ...state,
        isSubmitting: true,
      }),
    ),

    on(teamTournamentActions.deletedSuccessfully, (state, action) => {
      let newState = state;
      Object.values(state.entities).forEach((entity) => {
        if (
          entity?.team_id === action.teamId &&
          entity?.tournament_id === action.tournamentId &&
          entity.id
        ) {
          newState = adapter.removeOne(entity.id as number, newState);
        }
      });
      return {
        ...newState,
        isSubmitting: false,
        errors: null,
      };
    }),

    on(
      teamTournamentActions.deleteFailure,
      (state, action): TeamTournamentState => ({
        ...state,
        isSubmitting: false,
        errors: action,
      }),
    ),

    // update actions
    on(
      teamTournamentActions.update,
      (state): TeamTournamentState => ({
        ...state,
        isSubmitting: true,
      }),
    ),
    on(teamTournamentActions.updatedSuccessfully, (state, action) =>
      adapter.updateOne(
        {
          id: action.updatedTeamTournament.id || 0,
          changes: action.updatedTeamTournament,
        },
        {
          ...state,
          isSubmitting: false,
          currentTeamTournament: action.updatedTeamTournament,
          errors: null,
        },
      ),
    ),
    on(
      teamTournamentActions.updateFailure,
      (state, action): TeamTournamentState => ({
        ...state,
        isSubmitting: false,
        errors: action,
      }),
    ),

    // get actions
    on(
      teamTournamentActions.get,
      (state): TeamTournamentState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      teamTournamentActions.getItemSuccess,
      (state, action): TeamTournamentState => ({
        ...state,
        isLoading: false,
        currentTeamTournament: action.teamTournament,
      }),
    ),
    on(
      teamTournamentActions.getItemFailure,
      (state, action): TeamTournamentState => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),

    on(
      teamTournamentActions.getConnectionByTeamIdTournamentId,
      (state): TeamTournamentState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(
      teamTournamentActions.getConnectionByTeamIdAndTournamentIdSuccess,
      (state, action) => ({
        ...state,
        isLoading: false,
        currentTeamTournament: action.teamTournament,
      }),
    ),
    on(
      teamTournamentActions.getConnectionByTeamIdAndTournamentIdFailure,
      (state, action) => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),

    on(
      teamTournamentActions.getAll,
      (state): TeamTournamentState => ({
        ...state,
        isLoading: true,
      }),
    ),
    on(teamTournamentActions.getAllItemsSuccess, (state, action) =>
      adapter.setAll(action.teamTournaments, {
        ...state,
        isLoading: false,
      }),
    ),
    on(
      teamTournamentActions.getAllItemsFailure,
      (state, action): TeamTournamentState => ({
        ...state,
        isLoading: false,
        errors: action,
      }),
    ),
  ),
});

const { selectAll } = adapter.getSelectors();

export const {
  name: teamTournamentFeatureKey,
  reducer: teamTournamentReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectCurrentTeamTournamentId,
  selectCurrentTeamTournament,
  selectTeamTournamentState,
} = teamTournamentFeature;

export const selectAllTeamTournament = createSelector(
  selectTeamTournamentState,
  selectAll,
);
