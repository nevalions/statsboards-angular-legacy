import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IPerson } from '../../../type/person.type';

export const personActions = createActionGroup({
  source: 'person',
  events: {
    GetId: emptyProps(),
    'Get person id successfully': props<{ personId: number }>(),
    'Get person id failure': emptyProps(),

    Create: props<{ request: IPerson }>(),
    'Created successfully': props<{ currentPerson: IPerson }>(),
    'Create failure': emptyProps(),

    Get: props<{ id: number }>(),
    'Get item success': props<{ person: IPerson }>(),
    'Get item failure': emptyProps(),

    GetAll: emptyProps(),
    'Get all items success': props<{ persons: IPerson[] }>(),
    'Get all items failure': emptyProps(),

    Update: props<{ id: number; newPersonData: IPerson }>(),
    'Updated successfully': props<{ updatedPerson: IPerson }>(),
    'Update failure': emptyProps(),

    Delete: props<{ id: number }>(),
    'Deleted successfully': props<{ id: number }>(),
    'Delete failure': emptyProps(),
  },
});
