import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ISport } from '../../../type/sport.type';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';

export const sportActions = createActionGroup({
  source: 'sport',
  events: {
    Create: props<{ request: ISport }>(),
    'Created successfully': props<{ currentSport: ISport }>(),
    'Create failure': emptyProps(),

    Get: emptyProps(),
    'Get item success': props<{ sport: ISport }>(),
    'Get item failure': emptyProps(),

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
