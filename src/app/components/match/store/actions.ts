import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IMatch } from '../../../type/match.type';

export const matchActions = createActionGroup({
  source: 'match',
  events: {
    GetId: emptyProps(),
    'Get match id successfully': props<{ matchId: number }>(),
    'Get match id failure': emptyProps(),

    Create: props<{ request: IMatch }>(),
    'Created successfully': props<{ currentMatch: IMatch }>(),
    'Create failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ match: IMatch }>(),
    'Get item failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all items success': props<{ matches: IMatch[] }>(),
    'Get all items failure': emptyProps(),

    GetMatchesBySportId: emptyProps(),
    'Get matches by sport ID success': props<{ matches: IMatch[] }>(),
    'Get matches by sport ID failure': emptyProps(),

    GetMatchesByTournamentId: emptyProps(),
    'Get matches by tournament ID success': props<{ matches: IMatch[] }>(),
    'Get matches by tournament ID failure': emptyProps(),

    Update: props<{ id: number; newMatchData: IMatch }>(),
    'Updated successfully': props<{ updatedMatch: IMatch }>(),
    'Update failure': emptyProps(),

    UpdateAllMatchesInTournament: props<{ newMatch: IMatch }>(),

    Delete: emptyProps(),
    'Deleted successfully': props<{
      matchId: number;
      tournamentId: number;
      sportId: number;
      seasonId: number;
    }>(),
    'Delete failure': emptyProps(),
  },
});
