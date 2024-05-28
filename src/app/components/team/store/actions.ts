import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ITeam, ITeamTournament } from '../../../type/team.type';

export const teamActions = createActionGroup({
  source: 'team',
  events: {
    GetId: emptyProps(),
    'Get team id successfully': props<{ teamId: number }>(),
    'Get team id failure': emptyProps(),

    Create: props<{ request: ITeam }>(),
    'Created successfully': props<{ currentTeam: ITeam }>(),
    'Create failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ team: ITeam }>(),
    'Get item failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all items success': props<{ teams: ITeam[] }>(),
    'Get all items failure': emptyProps(),

    GetTeamsBySportId: emptyProps(),
    'Get teams by sport ID success': props<{ teams: ITeam[] }>(),
    'Get teams by sport ID failure': emptyProps(),

    GetTeamsByTournamentId: emptyProps(),
    'Get teams by tournament ID success': props<{ teams: ITeam[] }>(),
    'Get teams by tournament ID failure': emptyProps(),

    getMatchTeams: props<{ id: number }>(),
    'Get match teams success': props<{ homeTeam: ITeam; awayTeam: ITeam }>(),
    'Get match teams failure': emptyProps(),

    addTeamToTournament: props<{ team_id: number }>(),
    removeTeamFromTournament: props<{ id: number }>(),

    Update: props<{ id: number; newTeamData: ITeam }>(),
    'Updated successfully': props<{ updatedTeam: ITeam }>(),
    'Update failure': emptyProps(),

    'Update all Teams in sport': props<{ newTeam: ITeam }>(),

    // Delete: props<{ id: number }>(),
    // 'Deleted successfully': props<{ id: number }>(),
    // 'Delete failure': emptyProps(),

    Delete: emptyProps(),
    'Deleted successfully': props<{
      teamId: number;
      sportId: number;
    }>(),
    'Delete failure': emptyProps(),
  },
});
