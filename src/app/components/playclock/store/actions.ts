import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IPlayclock } from '../../../type/playclock.type';

export const playclockActions = createActionGroup({
  source: 'playclock',
  events: {
    GetId: emptyProps(),
    'Get playclock id successfully': props<{ playclock_id: number }>(),
    'Get playclock id failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get playclock success': props<{ playclock: IPlayclock }>(),
    'Get playclock failure': emptyProps(),

    StartGameClock: emptyProps(),
    'Clock start success': props<{ playclock: IPlayclock }>(),
    'Clock start failure': emptyProps(),

    PauseGameClock: emptyProps(),
    'Clock pause success': props<{ playclock: IPlayclock }>(),
    'Clock pause failure': emptyProps(),

    ResetGameClock: props<{ seconds: number }>(),
    'Clock reset success': props<{ playclock: IPlayclock }>(),
    'Clock reset failure': emptyProps(),

    StartPlayClock: props<{ seconds: number }>(),
    'Play clock start success': props<{ playclock: IPlayclock }>(),
    'Play clock start failure': emptyProps(),

    ResetPlayClock: emptyProps(),
    'Play clock reset success': props<{ playclock: IPlayclock }>(),
    'Play clock reset failure': emptyProps(),

    GetPlayClockByMatchId: emptyProps(),
    'Get playclock by match ID success': props<{ playclock: IPlayclock }>(),
    'Get playclock by match ID failure': emptyProps(),

    Update: props<{ id: number; newPlayclock: IPlayclock }>(),
    'Updated successfully': props<{ updatedPlayclock: IPlayclock }>(),
    'Update failure': emptyProps(),
  },
});
