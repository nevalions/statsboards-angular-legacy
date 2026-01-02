import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createSelector, createFeature, createReducer, on } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import { ITeam } from '../../../type/team.type';
import { teamActions } from './actions';

export interface TeamState extends EntityState<ITeam> {
  isTeamSubmitting: boolean;
  isTeamLoading: boolean;
  currentTeamId: number | undefined | null;
  currentTeam: ITeam | undefined | null;
  homeTeam: ITeam | undefined | null;
  awayTeam: ITeam | undefined | null;
  allTeamsInSport: ITeam[];
  allTeamsInTournament: ITeam[];
  errors: any;
}

const adapter = createEntityAdapter<ITeam>({
  sortComparer: (a: ITeam, b: ITeam) => a.title.localeCompare(b.title),
});

const initialState: TeamState = adapter.getInitialState({
  isTeamSubmitting: false,
  isTeamLoading: false,
  currentTeamId: null,
  allTeamsInSport: [],
  allTeamsInTournament: [],
  currentTeam: null,
  homeTeam: null,
  awayTeam: null,
  errors: null,
});

const teamFeature = createFeature({
  name: 'team',
  reducer: createReducer(
    initialState,
    on(
      teamActions.getId,
      (state): TeamState => ({
        ...state,
        isTeamLoading: true,
      }),
    ),
    on(
      teamActions.getTeamIdSuccessfully,
      (state, action): TeamState => ({
        ...state,
        isTeamLoading: false,
        currentTeamId: action.teamId,
      }),
    ),
    on(
      teamActions.getTeamIdFailure,
      (state): TeamState => ({
        ...state,
        isTeamLoading: false,
      }),
    ),

    on(
      teamActions.create,
      (state): TeamState => ({
        ...state,
        isTeamSubmitting: true,
      }),
    ),
    on(teamActions.createdSuccessfully, (state, action) =>
      adapter.addOne(action.currentTeam, {
        ...state,
        isTeamSubmitting: false,
        currentTeam: action.currentTeam,
      }),
    ),
    on(
      teamActions.createFailure,
      (state, action): TeamState => ({
        ...state,
        isTeamSubmitting: false,
        errors: action,
      }),
    ),

    on(
      teamActions.delete,
      (state): TeamState => ({
        ...state,
        isTeamSubmitting: true,
      }),
    ),
    on(teamActions.deletedSuccessfully, (state, action) => {
      if (action.teamId !== null && action.teamId !== undefined) {
        return adapter.removeOne(action.teamId, {
          ...state,
          isTeamSubmitting: false,
          allTeamsInSport: state.allTeamsInSport.filter(
            (item) => item.id !== action.teamId,
          ),
          allTeamsInTournament: state.allTeamsInTournament.filter(
            (item) => item.id !== action.teamId,
          ),
          errors: null,
        });
      }
      return {
        ...state,
        isTeamSubmitting: false,
        errors: null,
      };
    }),
    on(
      teamActions.deleteFailure,
      (state, action): TeamState => ({
        ...state,
        isTeamSubmitting: false,
        errors: action,
      }),
    ),

    on(
      teamActions.update,
      (state): TeamState => ({
        ...state,
        isTeamSubmitting: true,
      }),
    ),
    on(teamActions.updatedSuccessfully, (state, action) => {
      if (action.updatedTeam.id) {
        return adapter.updateOne(
          { id: action.updatedTeam.id, changes: action.updatedTeam },
          {
            ...state,
            isTeamSubmitting: false,
            currentTeam: action.updatedTeam,
            errors: null,
          },
        );
      }
      return {
        ...state,
        isTeamSubmitting: false,
        currentTeam: action.updatedTeam,
        errors: null,
      };
    }),
    on(
      teamActions.updateFailure,
      (state, action): TeamState => ({
        ...state,
        isTeamSubmitting: false,
        errors: action,
      }),
    ),
    on(teamActions.updateAllTeamsInSport, (state, { newTeam }) => {
      const newList = [...state.allTeamsInSport, newTeam];
      const sortedTeams = SortService.sort(newList, 'title');
      return {
        ...state,
        allTeamsInSport: sortedTeams,
      };
    }),

    on(
      teamActions.get,
      (state): TeamState => ({
        ...state,
        isTeamLoading: true,
      }),
    ),
    on(
      teamActions.getItemSuccess,
      (state, action): TeamState => ({
        ...state,
        isTeamLoading: false,
        currentTeam: action.team,
      }),
    ),
    on(
      teamActions.getItemFailure,
      (state, action): TeamState => ({
        ...state,
        isTeamLoading: false,
        errors: action,
      }),
    ),

    on(
      teamActions.getAll,
      (state): TeamState => ({
        ...state,
        isTeamLoading: true,
      }),
    ),
    on(teamActions.getAllItemsSuccess, (state, action) =>
      adapter.setAll(action.teams, {
        ...state,
        isTeamLoading: false,
      }),
    ),
    on(
      teamActions.getAllItemsFailure,
      (state, action): TeamState => ({
        ...state,
        isTeamLoading: false,
        errors: action,
      }),
    ),

    on(
      teamActions.getTeamsBySportId,
      (state): TeamState => ({
        ...state,
        isTeamLoading: true,
      }),
    ),
    on(teamActions.getTeamsBySportIDSuccess, (state, action) => {
      const sortedTournaments = SortService.sort(action.teams, 'title');
      return {
        ...state,
        isTeamLoading: false,
        allTeamsInSport: sortedTournaments,
      };
    }),
    on(
      teamActions.getTeamsBySportIDFailure,
      (state, action): TeamState => ({
        ...state,
        isTeamLoading: false,
        errors: action,
      }),
    ),

    on(
      teamActions.getTeamsByTournamentId,
      (state): TeamState => ({
        ...state,
        isTeamLoading: true,
      }),
    ),
    on(teamActions.getTeamsByTournamentIDSuccess, (state, action) => {
      const sortedTeams = SortService.sort(action.teams, 'title');
      return {
        ...state,
        isTeamLoading: false,
        allTeamsInTournament: sortedTeams,
      };
    }),
    on(
      teamActions.getTeamsByTournamentIDFailure,
      (state, action): TeamState => ({
        ...state,
        isTeamLoading: false,
        errors: action,
      }),
    ),

    on(
      teamActions.getMatchTeams,
      (state): TeamState => ({
        ...state,
        isTeamLoading: true,
      }),
    ),
    on(teamActions.getMatchTeamsSuccess, (state, action) => {
      return {
        ...state,
        isTeamLoading: false,
        homeTeam: action.homeTeam,
        awayTeam: action.awayTeam,
      };
    }),
    on(
      teamActions.getMatchTeamsFailure,
      (state, action): TeamState => ({
        ...state,
        isTeamLoading: false,
        errors: action,
      }),
    ),

    on(teamActions.addTeamToTournament, (state, { team_id }) => {
      const teamToAdd = state.allTeamsInSport.find(
        (team) => team.id === team_id,
      );
      if (!teamToAdd) {
        console.log(`No team found with id: ${team_id}`);
        return state;
      }
      const newList = [...state.allTeamsInTournament, teamToAdd];
      const sortedList = SortService.sort(newList, 'title');
      return {
        ...state,
        allTeamsInTournament: sortedList,
      };
    }),

    on(
      teamActions.removeTeamFromTournament,
      (state, action): TeamState => ({
        ...state,
        allTeamsInTournament: state.allTeamsInTournament.filter(
          (team) => team.id !== action.id,
        ),
      }),
    ),
  ),
});

const { selectAll } = adapter.getSelectors();

export const {
  name: teamFeatureKey,
  reducer: teamReducer,
  selectIsTeamSubmitting,
  selectIsTeamLoading,
  selectCurrentTeamId,
  selectCurrentTeam,
  selectAllTeamsInSport,
  selectAllTeamsInTournament,
  selectHomeTeam,
  selectAwayTeam,
  selectTeamState,
} = teamFeature;

export const selectAllTeams = createSelector(selectTeamState, selectAll);
