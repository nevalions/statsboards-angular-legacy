import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';
import { ITournament } from '../../../type/tournament.type';

export const tournamentActions = createActionGroup({
  source: 'tournament',
  events: {
    Create: props<{ request: ITournament }>(),
    'Created successfully': props<{ currentTournament: ITournament }>(),
    'Create failure': emptyProps(),
    Get: emptyProps(),
    'Get item success': props<{ tournaments: ITournament }>(),
    'Get item failure': emptyProps(),
    'Get items success': props<{ tournaments: ITournament[] }>(),
    'Get items failure': emptyProps(),
    Update: props<{ id: string; newTournamentData: ITournament }>(),
    'Updated successfully': props<{ updatedTournament: ITournament }>(),
    'Update failure': emptyProps(),
    Delete: props<{ id: string }>(),
    'Deleted successfully': props<{ id: number }>(),
    'Delete failure': emptyProps(),
  },
});
