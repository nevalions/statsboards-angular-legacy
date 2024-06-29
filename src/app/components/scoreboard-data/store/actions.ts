import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IScoreboard } from '../../../type/matchdata.type';

export const scoreboardDataActions = createActionGroup({
  source: 'scoreboard',
  events: {
    GetId: emptyProps(),
    'Get scoreboardData id successfully': props<{
      scoreboardDataId: number;
    }>(),
    'Get scoreboardData id failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ scoreboardData: IScoreboard }>(),
    'Get item failure': emptyProps(),

    GetScoreboardDataByMatchId: emptyProps(),
    'Get scoreboardData by match ID success': props<{
      scoreboardData: IScoreboard;
    }>(),
    'Get scoreboardData by match ID failure': emptyProps(),

    Update: props<{
      id: number;
      newScoreboardData: IScoreboard;
    }>(),
    'Updated successfully': props<{
      updatedScoreboardData: IScoreboard;
    }>(),
    'Update failure': emptyProps(),

    UpdateScoreBoardDataByKeyValue: props<{
      id: number;
      data: any;
    }>(),
    'Update scoreboardData by key value successfully': props<{
      updatedScoreboardData: IScoreboard;
    }>(),
    'Update scoreboardData by key value failure': emptyProps(),
  },
});
