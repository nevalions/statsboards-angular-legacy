import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IPosition } from '../../../type/position.type';

export const positionActions = createActionGroup({
  source: 'position',
  events: {
    GetId: emptyProps(),
    'Get position id successfully': props<{ positionId: number }>(),
    'Get position id failure': emptyProps(),

    Create: props<{ request: IPosition }>(),
    'Created successfully': props<{ currentPosition: IPosition }>(),
    'Create failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ position: IPosition }>(),
    'Get item failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all items success': props<{ positions: IPosition[] }>(),
    'Get all items failure': emptyProps(),

    GetAllPositionsBySportId: emptyProps(),
    'Get all positions by sport id success': props<{
      positions: IPosition[];
    }>(),
    'Get all positions by sport id failure': emptyProps(),

    Update: props<{ id: number; newPositionData: IPosition }>(),
    'Updated successfully': props<{ updatedPosition: IPosition }>(),
    'Update failure': emptyProps(),

    Delete: emptyProps(),
    'Deleted successfully': props<{ positionId: number; sportId: number }>(),
    'Delete failure': emptyProps(),

    DeleteById: props<{ id: number }>(),
    'Deleted by id successfully': props<{
      positionId: number;
    }>(),
    'Delete by id failure': emptyProps(),
  },
});
