import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IGameclock } from '../../../type/gameclock.type';

export const gameclockActions = createActionGroup({
  source: 'gameclock',
  events: {
    GetId: emptyProps(),
    'Get gameclock id successfully': props<{ gameclock_id: number }>(),
    'Get gameclock id failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get gameclock success': props<{ gameclock: IGameclock }>(),
    'Get gameclock failure': emptyProps(),

    StartGameClock: emptyProps(),
    'Clock start success': props<{ gameclock: IGameclock }>(),
    'Clock start failure': emptyProps(),

    PauseGameClock: emptyProps(),
    'Clock pause success': props<{ gameclock: IGameclock }>(),
    'Clock pause failure': emptyProps(),

    ResetGameClock: props<{ seconds: number }>(),
    'Clock reset success': props<{ gameclock: IGameclock }>(),
    'Clock reset failure': emptyProps(),

    GetGameClockByMatchId: emptyProps(),
    'Get gameclock by match ID success': props<{ gameclock: IGameclock }>(),
    'Get gameclock by match ID failure': emptyProps(),

    Update: props<{ id: number; newGameclock: IGameclock }>(),
    'Updated successfully': props<{ updatedGameclock: IGameclock }>(),
    'Update failure': emptyProps(),
  },
});
