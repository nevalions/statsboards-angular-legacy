import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IMatchData } from '../../../../type/matchdata.type';

export const matchDataActions = createActionGroup({
  source: 'matchdata',
  events: {
    GetId: emptyProps(),
    'Get matchdata id successfully': props<{ matchdataId: number }>(),
    'Get matchdata id failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ matchdata: IMatchData }>(),
    'Get item failure': emptyProps(),

    // GetMatchDataByMatchId: props<{ matchId: number }>(),
    // 'Get matchdata by match ID success': props<{ matchdata: IMatchData }>(),
    // 'Get matchdata by match ID failure': emptyProps(),

    GetMatchDataByMatchId: emptyProps(),
    'Get matchdata by match ID success': props<{ matchdata: IMatchData }>(),
    'Get matchdata by match ID failure': emptyProps(),

    Update: props<{ id: number; newMatchData: IMatchData }>(),
    'Updated successfully': props<{ updatedMatchData: IMatchData }>(),
    'Update failure': emptyProps(),
  },
});
