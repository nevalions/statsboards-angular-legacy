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

    StartGameClock: emptyProps(),
    'Clock start success': props<{ matchData: IMatchData }>(),
    'Clock start failure': emptyProps(),

    PauseGameClock: emptyProps(),
    'Clock pause success': props<{ matchData: IMatchData }>(),
    'Clock pause failure': emptyProps(),

    ResetGameClock: props<{ seconds: number }>(),
    'Clock reset success': props<{ matchData: IMatchData }>(),
    'Clock reset failure': emptyProps(),

    StartPlayClock: props<{ seconds: number }>(),
    'Play clock start success': props<{ matchData: IMatchData }>(),
    'Play clock start failure': emptyProps(),

    ResetPlayClock: emptyProps(),
    'Play clock reset success': props<{ matchData: IMatchData }>(),
    'Play clock reset failure': emptyProps(),

    GetMatchDataByMatchId: emptyProps(),
    'Get matchdata by match ID success': props<{ matchdata: IMatchData }>(),
    'Get matchdata by match ID failure': emptyProps(),

    Update: props<{ id: number; newMatchData: IMatchData }>(),
    'Updated successfully': props<{ updatedMatchData: IMatchData }>(),
    'Update failure': emptyProps(),

    UpdateMatchDataByKeyValue: props<{
      id: number;
      data: any;
    }>(),
    'Update MatchData by key value successfully': props<{
      updatedMatchData: IMatchData;
    }>(),
    'Update MatchData by key value failure': emptyProps(),
  },
});
