import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import { teamActions } from './actions';
import { ITeam } from '../../../type/team.type';
import {
  crudStoreInterface,
  getDefaultCrudStore,
} from '../../../type/store.intarface';

export interface TeamState extends crudStoreInterface {
  currentTeam: ITeam | undefined | null;
  allTeams: ITeam[];
  allTeamsInSport: ITeam[];
  allTeamsInTournament: ITeam[];
}

const initialState: TeamState = {
  ...getDefaultCrudStore(),
  allTeams: [],
  allTeamsInSport: [],
  allTeamsInTournament: [],
  currentTeam: null,
  errors: null,
};

const teamFeature = createFeature({
  name: 'team',
  reducer: createReducer(
    initialState,

    // create actions
    on(teamActions.create, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(teamActions.createdSuccessfully, (state, action) => {
      const newList = [...state.allTeams, action.currentTeam];
      const sortedTournaments = SortService.sort(newList, 'title');
      return {
        ...state,
        isSubmitting: false,
        currentTeam: action.currentTeam,
        allTeams: sortedTournaments, // sorted list
      };
    }),
    on(teamActions.createFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(teamActions.delete, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(teamActions.deletedSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      itemsList: (state.allTeams || []).filter((item) => item.id !== action.id),
      errors: null,
    })),
    on(teamActions.deleteFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // update actions
    on(teamActions.update, (state) => ({
      ...state,
      isSubmitting: true,
    })),
    on(teamActions.updatedSuccessfully, (state, action) => ({
      ...state,
      isSubmitting: false,
      currentTeam: action.updatedTeam,
      allTeams: state.allTeams.map((item) =>
        item.id === action.updatedTeam.id ? action.updatedTeam : item,
      ),
      errors: null,
    })),
    on(teamActions.updateFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      errors: action,
    })),

    // get actions
    on(teamActions.get, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(teamActions.getItemSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      currentTeam: action.team,
    })),
    on(teamActions.getItemFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(teamActions.getAll, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(teamActions.getAllItemsSuccess, (state, action) => {
      const sortedTournaments = SortService.sort(action.teams, 'title');
      return {
        ...state,
        isLoading: false,
        allTeams: sortedTournaments,
      };
    }),
    on(teamActions.getAllItemsFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(teamActions.getTeamsBySportId, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(teamActions.getTeamsBySportIDSuccess, (state, action) => {
      const sortedTournaments = SortService.sort(action.teams, 'title');
      return {
        ...state,
        isLoading: false,
        allTeamsInSport: sortedTournaments,
      };
    }),
    on(teamActions.getTeamsBySportIDFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),

    on(teamActions.getTeamsByTournamentId, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(teamActions.getTeamsByTournamentIDSuccess, (state, action) => {
      const sortedTeams = SortService.sort(action.teams, 'title');
      return {
        ...state,
        isLoading: false,
        allTeamsInTournament: sortedTeams,
      };
    }),
    on(teamActions.getTeamsByTournamentIDFailure, (state, action) => ({
      ...state,
      isLoading: false,
      errors: action,
    })),
  ),
});

export const {
  name: teamFeatureKey,
  reducer: teamReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectCurrentTeam,
  selectAllTeams,
  selectAllTeamsInSport,
  selectAllTeamsInTournament,
} = teamFeature;
