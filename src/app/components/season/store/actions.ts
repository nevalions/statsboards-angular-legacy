import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ISeason } from '../../../type/season.type';

export const seasonActions = createActionGroup({
  source: 'season',
  events: {
    Create: props<{ request: ISeason }>(),
    'Created successfully': props<{ currentSeason: ISeason }>(),
    'Create failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ season: ISeason }>(),
    'Get item failure': emptyProps(),

    GetSeasonByYear: props<{ year: number }>(),
    'Get season by year success': props<{ season: ISeason }>(),
    'Get season by year failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all items success': props<{ seasons: ISeason[] }>(),
    'Get all items failure': emptyProps(),

    Update: props<{ id: number; newSeasonData: ISeason }>(),
    'Updated successfully': props<{ updatedSeason: ISeason }>(),
    'Update failure': emptyProps(),

    Delete: props<{ id: number }>(),
    'Deleted successfully': props<{ id: number }>(),
    'Delete failure': emptyProps(),
  },
});
