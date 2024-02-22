import { crudActions } from './crud.actions';
import { Actions, createEffect, FunctionalEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { inject } from '@angular/core';

import { RealApiService } from '../services/base.api.service';

export function addCreateEffects<T>(): Record<string, FunctionalEffect> {
  const actions = crudActions<T>();

  // Return a record with a key and FunctionalEffect value
  return {
    crudEffect: createEffect(
      (actions$ = inject(Actions), service = inject(RealApiService)) => {
        return actions$.pipe(
          ofType(actions.create),
          switchMap(({ endpoint, request }) =>
            service.addItem(endpoint, request).pipe(
              map((item: T) => {
                return actions.createdSuccessfully({ currentItem: item });
              }),
              catchError(() => {
                return of(actions.createFailure());
              }),
            ),
          ),
        );
      },
      { functional: true },
    ),
  };
}

export function addGetAllEffects<T>(): Record<string, FunctionalEffect> {
  const actions = crudActions<T>();

  return {
    getAllEffect: createEffect(
      (actions$ = inject(Actions), service = inject(RealApiService<T>)) => {
        return actions$.pipe(
          ofType(actions.getAll),
          switchMap(({ endpoint }) =>
            service.findAll(endpoint).pipe(
              map((items: T[]) => {
                return actions.getItemsSuccess({ itemsList: items });
              }),
              catchError(() => of(actions.getItemsFailure())),
            ),
          ),
        );
      },
      { functional: true },
    ),
  };
}

export function addGetAllByTwoKeyValueEffects<T>(): Record<
  string,
  FunctionalEffect
> {
  const actions = crudActions<T>();

  return {
    getAllByTwoKeyValueEffect: createEffect(
      (actions$ = inject(Actions), service = inject(RealApiService<T>)) => {
        return actions$.pipe(
          ofType(actions.getAllByTwoKeyValue),
          switchMap(
            ({
              firstItem,
              firstKey,
              firstValue,
              secondItem,
              secondKey,
              secondValue,
              optionalValue,
            }) =>
              service
                .findByFirstItemKeyValueAndSecondItemSecondKeyValue(
                  firstItem,
                  firstKey,
                  firstValue,
                  secondItem,
                  secondKey,
                  secondValue,
                  optionalValue,
                )
                .pipe(
                  map((items: T[]) => {
                    return actions.getAllByTwoKeyValueItemsSuccess({
                      itemsList: items,
                    });
                  }),
                  catchError(() =>
                    of(actions.getAllByTwoKeyValueItemsFailure()),
                  ),
                ),
          ),
        );
      },
      { functional: true },
    ),
  };
}

// export const create$ = createEffect(
//   (actions$ = inject(Actions), service = inject(RealApiService)) => {
//     return actions$.pipe(
//       ofType(actions.create),
//       switchMap(({ endpoint, request }) =>
//         service.addAnyItem(endpoint, request).pipe(
//           map((item: any) => {
//             return actions.createdSuccessfully({ currentItem: item });
//           }),
//           catchError(() => {
//             return of(actions.createFailure());
//           }),
//         ),
//       ),
//     );
//   },
//   { functional: true },
// );

// export const getAll$ = createEffect(
//   (actions$ = inject(Actions), service = inject(RealApiService)) => {
//     return actions$.pipe(
//       ofType(actions.getAll),
//       switchMap(({ endpoint }) =>
//         service.findAll(endpoint).pipe(
//           map((items) => actions.getItemsSuccess({ itemsList: items })),
//           catchError((error: any) => of(actions.getItemsFailure())),
//         ),
//       ),
//     );
//   },
//   { functional: true },
// );

// @Injectable()
// export abstract class BaseCrudEffects<T extends BaseEntity> {
//   protected constructor(
//     private actions$: Actions,
//     private actions: ICrudActions<T>,
//     private service: BaseApiService<T>,
//   ) {}
//
//   create$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(this.actions.create),
//       switchMap(({ entity }) =>
//         this.service.addItem(entity).pipe(
//           map((newEntity: T) =>
//             this.actions.createSuccess({ entity: newEntity }),
//           ),
//           catchError((error: any) => of(this.actions.createFailure({ error }))),
//         ),
//       ),
//     ),
//   );
//
//   read$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(this.actions.read),
//       switchMap(({ id }) =>
//         this.service.findById(id).pipe(
//           map((entity: T) => this.actions.readSuccess({ entity })),
//           catchError((error: any) => of(this.actions.readFailure({ error }))),
//         ),
//       ),
//     ),
//   );
//
//   update$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(this.actions.update),
//       switchMap(({ entity }) =>
//         this.service.editItem(entity.id, entity as T).pipe(
//           map((updatedEntity: T) =>
//             this.actions.updateSuccess({ entity: updatedEntity }),
//           ),
//           catchError((error: any) => of(this.actions.updateFailure({ error }))),
//         ),
//       ),
//     ),
//   );
//
//   delete$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(this.actions.delete),
//       switchMap(({ id }) => {
//         // Ensure `id` is a number before passing to the service method
//         const _id = typeof id === 'string' ? Number(id) : id;
//
//         return this.service.deleteItem(_id).pipe(
//           map(() => this.actions.deleteSuccess({ id: _id })),
//           catchError((error: any) => of(this.actions.deleteFailure({ error }))),
//         );
//       }),
//     ),
//   );
// }
