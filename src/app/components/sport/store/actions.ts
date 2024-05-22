import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ISport } from '../../../type/sport.type';

export const sportActions = createActionGroup({
  source: 'sport',
  events: {
    GetId: emptyProps(),
    'Get sport id successfully': props<{ sportId: number }>(),
    'Get sport id failure': emptyProps(),

    Create: props<{ request: ISport }>(),
    'Created successfully': props<{ currentSport: ISport }>(),
    'Create failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ sport: ISport }>(),
    'Get item failure': emptyProps(),

    GetSportByMatch: emptyProps(),
    'Get sport by match success': props<{ sport: ISport }>(),
    'Get sport by match failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all items success': props<{ sports: ISport[] }>(),
    'Get all items failure': emptyProps(),

    Update: props<{ id: number; newSportData: ISport }>(),
    'Updated successfully': props<{ updatedSport: ISport }>(),
    'Update failure': emptyProps(),

    Delete: props<{ id: number }>(),
    'Deleted successfully': props<{ id: number }>(),
    'Delete failure': emptyProps(),
  },
});
