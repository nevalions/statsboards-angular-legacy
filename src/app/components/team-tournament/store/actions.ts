import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ITeamTournament } from '../../../type/team.type';

export const teamTournamentActions = createActionGroup({
  source: 'teamTournament',
  events: {
    Create: props<{ request: ITeamTournament }>(),
    'Created successfully': props<{ currentTeamTournament: ITeamTournament }>(),
    'Create failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ teamTournament: ITeamTournament }>(),
    'Get item failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all items success': props<{ teamTournaments: ITeamTournament[] }>(),
    'Get all items failure': emptyProps(),

    Update: props<{ id: number; newTeamTournamentData: ITeamTournament }>(),
    'Updated successfully': props<{ updatedTeamTournament: ITeamTournament }>(),
    'Update failure': emptyProps(),

    Delete: props<{ id: number }>(),
    'Deleted successfully': props<{ id: number }>(),
    'Delete failure': emptyProps(),
  },
});
