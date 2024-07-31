import { createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import { ITeam } from '../../../type/team.type';
import { teamActions } from './actions';

export interface TeamState {
  isTeamSubmitting: boolean;
  isTeamLoading: boolean;
  currentTeamId: number | undefined | null;
  currentTeam: ITeam | undefined | null;
  homeTeam: ITeam | undefined | null;
  awayTeam: ITeam | undefined | null;
  // homeTeamWithFootballStats: IFootballTeamWithStats | undefined | null;
  // awayTeamWithFootballStats: IFootballTeamWithStats | undefined | null;
  allTeams: ITeam[];
  allTeamsInSport: ITeam[];
  allTeamsInTournament: ITeam[];
  errors: any;
}

const initialState: TeamState = {
  isTeamSubmitting: false,
  isTeamLoading: false,
  currentTeamId: null,
  allTeams: [],
  allTeamsInSport: [],
  allTeamsInTournament: [],
  currentTeam: null,
  homeTeam: null,
  awayTeam: null,
  // homeTeamWithFootballStats: null,
  // awayTeamWithFootballStats: null,
  errors: null,
};

const teamFeature = createFeature({
  name: 'team',
  reducer: createReducer(
    initialState,
    on(teamActions.getId, (state) => ({
      ...state,
      isTeamLoading: true,
    })),
    on(teamActions.getTeamIdSuccessfully, (state, action) => ({
      ...state,
      isTeamLoading: false,
      currentTeamId: action.teamId,
    })),
    on(teamActions.getTeamIdFailure, (state) => ({
      ...state,
      isTeamLoading: false,
    })),

    // create actions
    on(teamActions.create, (state) => ({
      ...state,
      isTeamSubmitting: true,
    })),
    on(teamActions.createdSuccessfully, (state, action) => {
      const newList = [...state.allTeams, action.currentTeam];
      const sortedTeams = SortService.sort(newList, 'title');
      return {
        ...state,
        isTeamSubmitting: false,
        currentTeam: action.currentTeam,
        allTeams: sortedTeams, // sorted list
      };
    }),
    on(teamActions.createFailure, (state, action) => ({
      ...state,
      isTeamSubmitting: false,
      errors: action,
    })),

    // delete actions
    on(teamActions.delete, (state) => ({
      ...state,
      isTeamSubmitting: true,
    })),
    on(teamActions.deletedSuccessfully, (state, action) => ({
      ...state,
      isTeamSubmitting: false,
      allTeams: (state.allTeams || []).filter(
        (item) => item.id !== action.teamId,
      ),
      allTeamsInSport: (state.allTeamsInSport || []).filter(
        (item) => item.id !== action.teamId,
      ),
      allTeamsInTournament: (state.allTeamsInTournament || []).filter(
        (item) => item.id !== action.teamId,
      ),
      errors: null,
    })),
    on(teamActions.deleteFailure, (state, action) => ({
      ...state,
      isTeamSubmitting: false,
      errors: action,
    })),

    // update actions
    on(teamActions.update, (state) => ({
      ...state,
      isTeamSubmitting: true,
    })),
    on(teamActions.updatedSuccessfully, (state, action) => ({
      ...state,
      isTeamSubmitting: false,
      currentTeam: action.updatedTeam,
      allTeams: state.allTeams.map((item) =>
        item.id === action.updatedTeam.id ? action.updatedTeam : item,
      ),
      errors: null,
    })),
    on(teamActions.updateFailure, (state, action) => ({
      ...state,
      isTeamSubmitting: false,
      errors: action,
    })),
    on(teamActions.updateAllTeamsInSport, (state, { newTeam }) => {
      const newList = [...state.allTeamsInSport, newTeam];
      const sortedTeams = SortService.sort(newList, 'title');
      return {
        ...state,
        allTeamsInSport: sortedTeams,
      };
    }),

    // get actions
    on(teamActions.get, (state) => ({
      ...state,
      isTeamLoading: true,
    })),
    on(teamActions.getItemSuccess, (state, action) => ({
      ...state,
      isTeamLoading: false,
      currentTeam: action.team,
    })),
    on(teamActions.getItemFailure, (state, action) => ({
      ...state,
      isTeamLoading: false,
      errors: action,
    })),

    on(teamActions.getAll, (state) => ({
      ...state,
      isTeamLoading: true,
    })),
    on(teamActions.getAllItemsSuccess, (state, action) => {
      const sortedTournaments = SortService.sort(action.teams, 'title');
      return {
        ...state,
        isTeamLoading: false,
        allTeams: sortedTournaments,
      };
    }),
    on(teamActions.getAllItemsFailure, (state, action) => ({
      ...state,
      isTeamLoading: false,
      errors: action,
    })),

    on(teamActions.getTeamsBySportId, (state) => ({
      ...state,
      isTeamLoading: true,
    })),
    on(teamActions.getTeamsBySportIDSuccess, (state, action) => {
      const sortedTournaments = SortService.sort(action.teams, 'title');
      return {
        ...state,
        isTeamLoading: false,
        allTeamsInSport: sortedTournaments,
      };
    }),
    on(teamActions.getTeamsBySportIDFailure, (state, action) => ({
      ...state,
      isTeamLoading: false,
      errors: action,
    })),

    on(teamActions.getTeamsByTournamentId, (state) => ({
      ...state,
      isTeamLoading: true,
    })),
    on(teamActions.getTeamsByTournamentIDSuccess, (state, action) => {
      const sortedTeams = SortService.sort(action.teams, 'title');
      return {
        ...state,
        isTeamLoading: false,
        allTeamsInTournament: sortedTeams,
      };
    }),
    on(teamActions.getTeamsByTournamentIDFailure, (state, action) => ({
      ...state,
      isTeamLoading: false,
      errors: action,
    })),

    on(teamActions.getMatchTeams, (state) => ({
      ...state,
      isTeamLoading: true,
    })),
    on(teamActions.getMatchTeamsSuccess, (state, action) => {
      return {
        ...state,
        isTeamLoading: false,
        homeTeam: action.homeTeam,
        awayTeam: action.awayTeam,
      };
    }),
    on(teamActions.getMatchTeamsFailure, (state, action) => ({
      ...state,
      isTeamLoading: false,
      errors: action,
    })),

    on(teamActions.addTeamToTournament, (state, { team_id }) => {
      const teamToAdd = state.allTeamsInSport.find(
        (team) => team.id === team_id,
      );
      if (!teamToAdd) {
        // console.log(store.allTeamsInSport);
        console.log(`No team found with id: ${team_id}`);
        return state;
      }
      // console.log(`Team with id: ${team_id} added to the tournament.`);
      const newList = [...state.allTeamsInTournament, teamToAdd];
      const sortedList = SortService.sort(newList, 'title');
      return {
        ...state,
        allTeamsInTournament: sortedList,
      };
    }),

    on(teamActions.removeTeamFromTournament, (state, action) => ({
      ...state,
      allTeamsInTournament: state.allTeamsInTournament.filter(
        (team) => team.id !== action.id,
      ),
    })),
  ),
});

export const {
  name: teamFeatureKey,
  reducer: teamReducer,
  selectIsTeamSubmitting,
  selectIsTeamLoading,
  selectCurrentTeamId,
  selectCurrentTeam,
  selectAllTeams,
  selectAllTeamsInSport,
  selectAllTeamsInTournament,
  selectHomeTeam,
  selectAwayTeam,
} = teamFeature;
