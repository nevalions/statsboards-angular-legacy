import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IFootballEvent } from '../../../../type/football-event.type';

export const footballEventActions = createActionGroup({
  source: 'footballEvent',
  events: {
    GetId: emptyProps(),
    'Get football event id successfully': props<{
      footballEventId: number;
    }>(),
    'Get football event id failure': emptyProps(),

    Create: props<{ request: IFootballEvent }>(),
    'Created successfully': props<{ footballEvent: IFootballEvent }>(),
    'Create failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ footballEvent: IFootballEvent }>(),
    'Get item failure': emptyProps(),

    GetFootballEventsByMatchId: emptyProps(),
    'Get football events by match ID success': props<{
      footballEvents: IFootballEvent[];
    }>(),
    'Get football events by match ID failure': emptyProps(),

    Update: props<{
      id: number;
      newFootballEvent: IFootballEvent;
    }>(),
    'Updated successfully': props<{
      updatedFootballEvent: IFootballEvent;
    }>(),
    'Update failure': emptyProps(),

    UpdateFootballEventByKeyValue: props<{
      id: number;
      data: Partial<IFootballEvent>;
    }>(),
    'Update football event by key value successfully': props<{
      updatedFootballEvent: IFootballEvent;
    }>(),
    'Update football event by key value failure': emptyProps(),

    DeleteById: props<{ id: number }>(),
    'Deleted by id successfully': props<{
      deletedFootballEvent: IFootballEvent;
    }>(),
    'Delete by id failure': emptyProps(),

    RecalculateEventsSuccess: props<{ footballEvents: IFootballEvent[] }>(),
    'recalculate events failure': emptyProps(),
  },
});
