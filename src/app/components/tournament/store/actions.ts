import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ITournament } from '../../../type/tournament.type';

export const tournamentActions = createActionGroup({
  source: 'tournament',
  events: {
    Create: props<{ request: ITournament }>(),
    'Created successfully': props<{ currentTournament: ITournament }>(),
    'Create failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ tournament: ITournament }>(),
    'Get item failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all items success': props<{ tournaments: ITournament[] }>(),
    'Get all items failure': emptyProps(),

    GetTournamentsBySportAndSeason: props<{
      sport_id: number;
      season_id: number;
    }>(),
    'Get tournaments by sport and season success': props<{
      tournaments: ITournament[];
    }>(),
    'Get tournaments by sport and season failure': emptyProps(),

    Update: props<{ id: number; newTournamentData: ITournament }>(),
    'Updated successfully': props<{ updatedTournament: ITournament }>(),
    'Update failure': emptyProps(),

    Delete: props<{ id: number; sportId: number; seasonId: number }>(),
    'Deleted successfully': props<{
      id: number;
      sportId: number;
      seasonId: number;
    }>(),
    'Delete failure': emptyProps(),
  },
});
