import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ISponsor } from '../../../../type/sponsor.type';

export const sponsorActions = createActionGroup({
  source: 'sponsor',
  events: {
    GetId: emptyProps(),
    'Get sponsor id successfully': props<{ sponsorId: number }>(),
    'Get sponsor id failure': emptyProps(),

    Create: props<{ request: ISponsor }>(),
    'Created successfully': props<{ currentSponsor: ISponsor }>(),
    'Create failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ currentSponsor: ISponsor }>(),
    'Get item failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all success': props<{ allSponsors: ISponsor[] }>(),
    'Get all failure': emptyProps(),
    //
    // GetTeamsBySportId: emptyProps(),
    // 'Get teams by sport ID success': props<{ teams: ITeam[] }>(),
    // 'Get teams by sport ID failure': emptyProps(),
    //
    // GetTeamsByTournamentId: emptyProps(),
    // 'Get teams by tournament ID success': props<{ teams: ITeam[] }>(),
    // 'Get teams by tournament ID failure': emptyProps(),
    //
    // addTeamToTournament: props<{ team_id: number }>(),
    // removeTeamFromTournament: props<{ id: number }>(),
    //
    // Update: props<{ id: number; newTeamData: ITeam }>(),
    // 'Updated successfully': props<{ updatedTeam: ITeam }>(),
    // 'Update failure': emptyProps(),
    //
    // 'Update all Teams in sport': props<{ newTeam: ITeam }>(),
    //
    // Delete: props<{ id: number }>(),
    // 'Deleted successfully': props<{ id: number }>(),
    // 'Delete failure': emptyProps(),
  },
});
