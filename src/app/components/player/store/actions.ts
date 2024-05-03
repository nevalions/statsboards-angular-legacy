import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IPlayer } from '../../../type/player.type';

export const playerActions = createActionGroup({
  source: 'player',
  events: {
    GetId: emptyProps(),
    'Get player id successfully': props<{ playerId: number }>(),
    'Get player id failure': emptyProps(),

    Create: props<{ request: IPlayer }>(),
    'Created successfully': props<{ currentPlayer: IPlayer }>(),
    'Create failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ player: IPlayer }>(),
    'Get item failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all items success': props<{ players: IPlayer[] }>(),
    'Get all items failure': emptyProps(),

    GetAllPlayersBySportId: emptyProps(),
    'Get all players by sport id success': props<{ players: IPlayer[] }>(),
    'Get all players by sport id failure': emptyProps(),

    Update: props<{ id: number; newPlayerData: IPlayer }>(),
    'Updated successfully': props<{ updatedPlayer: IPlayer }>(),
    'Update failure': emptyProps(),

    Delete: emptyProps(),
    'Deleted successfully': props<{ playerId: number; sportId: number }>(),
    'Delete failure': emptyProps(),
  },
});
