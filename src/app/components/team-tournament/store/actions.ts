import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ITeam, ITeamTournament } from '../../../type/team.type';
import { ITournament } from '../../../type/tournament.type';

export const teamTournamentActions = createActionGroup({
  source: 'teamTournament',
  events: {
    GetId: emptyProps(),
    'Get team tournament connection id successfully': props<{
      teamTournamentId: number;
    }>(),
    'Get team tournament connection id failure': emptyProps(),

    Create: props<{ request: ITeamTournament }>(),
    'Created successfully': props<{
      currentTeamTournament: ITeamTournament;
    }>(),
    'Create failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ teamTournament: ITeamTournament }>(),
    'Get item failure': emptyProps(),

    GetConnectionByTeamIdTournamentId: props<{
      teamId: number;
      tournamentId: number;
    }>(),
    'Get connection by team id and tournament id success': props<{
      teamTournament: ITeamTournament;
    }>(),
    'Get connection by team id and tournament id failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all items success': props<{ teamTournaments: ITeamTournament[] }>(),
    'Get all items failure': emptyProps(),

    Update: props<{ id: number; newTeamTournamentData: ITeamTournament }>(),
    'Updated successfully': props<{ updatedTeamTournament: ITeamTournament }>(),
    'Update failure': emptyProps(),

    // Delete: props<{ id: number; teamId: number }>(),
    Delete: emptyProps(),
    'Deleted successfully': props<{
      // connection: ITeamTournament;
      connectionId: number;
      teamId: number;
      tournamentId: number;
    }>(),
    'Delete failure': emptyProps(),
  },
});
