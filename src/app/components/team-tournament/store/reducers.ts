import {
  crudStoreInterface,
  getDefaultCrudStore,
} from '../../../type/store.intarface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import { ITeamTournament } from '../../../type/team.type';
import { teamTournamentActions } from './actions';
import { tournamentActions } from '../../tournament/store/actions';

export interface TeamTournamentState extends crudStoreInterface {
  currentTeamTournamentId: number | undefined | null;
  currentTeamTournament: ITeamTournament | undefined | null;
  allTeamTournament: ITeamTournament[];
}

const initialState: TeamTournamentState = {
  ...getDefaultCrudStore(),
  currentTeamTournamentId: null,
  currentTeamTournament: null,
  allTeamTournament: [],
};

const teamTournamentFeature = createFeature({
  name: 'teamTournament',
  reducer: createReducer(
    initialState,
    on(teamTournamentActions.getId, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(
      teamTournamentActions.getTeamTournamentConnectionIdSuccessfully,
      (state, action) => ({
        ...state,
        isLoading: false,
        currentTournamentId: action.teamTournamentId,
      }),
    ),
    on(teamTournamentActions.getTeamTournamentConnectionIdFailure, (state) => ({
      ...state,
      isLoading: false,
    })),

    // create actions
    on(teamTournamentActions.create, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(teamTournamentActions.createdSuccessfully, (state, action) => {
      const newList = [
        ...state.allTeamTournament,
        action.currentTeamTournament,
      ];
      const sortedTournaments = SortService.sort(newList, 'id');
      return {
        ...state,
        isSubmitting: false,
        currentTeamTournament: action.currentTeamTournament,
        allTeamTournament: sortedTournaments, // sorted list
      };
    }),
    on(teamTournamentActions.createFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(teamTournamentActions.delete, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(teamTournamentActions.deletedSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      allTeamTournament: (state.allTeamTournament || []).filter(
        (item) => item.id !== action.connectionId,
      ),
      errors: null,
    })),
    on(teamTournamentActions.deleteFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // update actions
    on(teamTournamentActions.update, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(teamTournamentActions.updatedSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      currentTeamTournament: action.updatedTeamTournament,
      allTeamTournament: state.allTeamTournament.map((item) =>
        item.id === action.updatedTeamTournament.id
          ? action.updatedTeamTournament
          : item,
      ),
      errors: null,
    })),
    on(teamTournamentActions.updateFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // get actions
    on(teamTournamentActions.get, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(teamTournamentActions.getItemSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      currentTeamTournament: action.teamTournament,
    })),
    on(teamTournamentActions.getItemFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(teamTournamentActions.getConnectionByTeamIdTournamentId, (state) => ({
      ...state,
      isLoading: true,
    })),
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

    on(teamTournamentActions.getAll, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(teamTournamentActions.getAllItemsSuccess, (state, action) => {
      const sortedTeamTournaments = SortService.sort(
        action.teamTournaments,
        'id',
      );
      return {
        ...state,
        isLoading: false,
        allTeamTournament: sortedTeamTournaments,
      };
    }),
    on(teamTournamentActions.getAllItemsFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),
  ),
});

export const {
  name: teamTournamentFeatureKey,
  reducer: teamTournamentReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectCurrentTeamTournamentId,
  selectCurrentTeamTournament,
  selectAllTeamTournament,
} = teamTournamentFeature;
