import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { addGetAllByTwoKeyValueEffects } from './crud.effects';

export interface BaseEntity {
  id: string | number;
}

export function crudActions<T>() {
  return createActionGroup({
    source: 'crud',
    events: {
      Create: props<{ endpoint: string; request: T }>(),
      'Created successfully': props<{ currentItem: T }>(),
      'Create failure': emptyProps(),

      Get: props<{ endpoint: string; id: number }>(),
      'Get item success': props<{ currentItem: T }>(),
      'Get item failure': emptyProps(),

      GetAll: props<{ endpoint: string }>(),
      'Get items success': props<{ itemsList: T[] }>(),
      'Get items failure': emptyProps(),

      GetAllByTwoKeyValue: props<{
        firstItem: string;
        firstKey: string;
        firstValue: any;
        secondItem: string;
        secondKey: string;
        secondValue: number;
        optionalValue?: any;
      }>(),
      'GetAllByTwoKeyValue items success': props<{ itemsList: T[] }>(),
      'GetAllByTwoKeyValue items failure': emptyProps(),

      Update: props<{ endpoint: string; id: number; newItemsData: T }>(),
      'Updated successfully': props<{ updatedItem: T }>(),
      'Update failure': emptyProps(),

      Delete: props<{ endpoint: string; id: number }>(),
      'Deleted successfully': props<{ id: number }>(),
      'Delete failure': emptyProps(),

      Sort: props<{ sortKey: string; sortDirection: 'asc' | 'desc' }>(),
      'Sort success': props<{ sortedItemsList: T[] }>(),
      'Sort failure': emptyProps(),
    },
  });
}

// export interface ICrudActions<T extends BaseEntity> {
//   create: ActionCreator<
//     string,
//     (props: { entity: T }) => { entity: T } & { type: string }
//   >;
//   createSuccess: ActionCreator<
//     string,
//     (props: { entity: T }) => { entity: T } & { type: string }
//   >;
//   createFailure: ActionCreator<
//     string,
//     (props: { error: any }) => { error: any } & { type: string }
//   >;
//
//   read: ActionCreator<string, (props: { id: number }) => { id: number }>;
//   readSuccess: ActionCreator<
//     string,
//     (props: { entity: T }) => { entity: T } & { type: string }
//   >;
//   readFailure: ActionCreator<
//     string,
//     (props: { error: any }) => { error: any } & { type: string }
//   >;
//
//   update: ActionCreator<
//     string,
//     (props: { entity: Partial<T> & BaseEntity }) => {
//       entity: Partial<T> & BaseEntity;
//     }
//   >;
//   updateSuccess: ActionCreator<
//     string,
//     (props: { entity: T }) => { entity: T } & { type: string }
//   >;
//   updateFailure: ActionCreator<
//     string,
//     (props: { error: any }) => { error: any } & { type: string }
//   >;
//
//   delete: ActionCreator<string, (props: BaseEntity) => BaseEntity>;
//   deleteSuccess: ActionCreator<
//     string,
//     (props: { id: number }) => { id: number } & {
//       type: string;
//     }
//   >;
//   deleteFailure: ActionCreator<
//     string,
//     (props: { error: any }) => { error: any } & { type: string }
//   >;
// }

//
// export function crudAction<T extends BaseEntity>(
//   entity: string,
// ): ICrudActions<T> {
//   const upperEntity = entity.charAt(0).toUpperCase() + entity.slice(1);
//
//   return {
//     create: createAction(`[${upperEntity}] Create`, props<{ entity: T }>()),
//     createSuccess: createAction(
//       `[${upperEntity}] Create Success`,
//       props<{ entity: T }>(),
//     ),
//     createFailure: createAction(
//       `[${upperEntity}] Create Failure`,
//       props<{ error: any }>(),
//     ),
//
//     read: createAction(`[${upperEntity}] Read`, props<{ id: number }>()),
//     readSuccess: createAction(
//       `[${upperEntity}] Read Success`,
//       props<{ entity: T }>(),
//     ),
//     readFailure: createAction(
//       `[${upperEntity}] Read Failure`,
//       props<{ error: any }>(),
//     ),
//
//     update: createAction(
//       `[${upperEntity}] Update`,
//       props<{ entity: Partial<T> & BaseEntity }>(),
//     ),
//     updateSuccess: createAction(
//       `[${upperEntity}] Update Success`,
//       props<{ entity: T }>(),
//     ),
//     updateFailure: createAction(
//       `[${upperEntity}] Update Failure`,
//       props<{ error: any }>(),
//     ),
//
//     delete: createAction(`[${upperEntity}] Delete`, props<BaseEntity>()),
//     deleteSuccess: createAction(
//       `[${upperEntity}] Delete Success`,
//       props<{ id: number }>(),
//     ),
//     deleteFailure: createAction(
//       `[${upperEntity}] Delete Failure`,
//       props<{ error: any }>(),
//     ),
//   };
// }
