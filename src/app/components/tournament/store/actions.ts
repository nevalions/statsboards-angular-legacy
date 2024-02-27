import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ITournament } from '../../../type/tournament.type';

export const tournamentActions = createActionGroup({
  source: 'tournament',
  events: {
    GetId: emptyProps(),
    'Get tournament id successfully': props<{ tournamentId: number }>(),
    'Get tournament id failure': emptyProps(),

    Create: props<{ request: ITournament }>(),
    'Created successfully': props<{ currentTournament: ITournament }>(),
    'Create failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ tournament: ITournament }>(),
    'Get item failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all items success': props<{ tournaments: ITournament[] }>(),
    'Get all items failure': emptyProps(),

    GetTournamentsBySportAndSeason: emptyProps(),
    'Get tournaments by sport and season success': props<{
      tournaments: ITournament[];
    }>(),
    'Get tournaments by sport and season failure': emptyProps(),

    Update: props<{ id: number; newTournamentData: ITournament }>(),
    'Updated successfully': props<{ updatedTournament: ITournament }>(),
    'Update failure': emptyProps(),

    UpdateSportSeasonTournaments: props<{ newTournament: ITournament }>(),

    Delete: emptyProps(),
    'Deleted successfully': props<{
      tournamentId: number;
      sportId: number;
      seasonId: number;
    }>(),
    'Delete failure': emptyProps(),
  },
});
