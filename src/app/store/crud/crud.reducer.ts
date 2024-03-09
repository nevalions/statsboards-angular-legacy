import { crudStoreInterface } from '../../type/store.intarface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { BaseEntity, crudActions } from './crud.actions';
import { IBaseID } from '../../type/base.type';
//
// const initialState: crudStoreInterface<BaseEntity> = {
//   isSubmitting: false,
//   isLoading: false,
//   itemsList: [],
//   currentItem: undefined,
//   errors: null,
// };
//
// // const actions = crudActions<BaseEntity>();
//
// export function crudState<T extends IBaseID>() {
//   const initialState: crudStoreInterface<T> = {
//     isSubmitting: false,
//     isLoading: false,
//     itemsList: [],
//     currentItem: undefined,
//     errors: null,
//   };
//
//   const actions = crudActions<T>();
//
//   const crudFeature = createFeature({
//     name: 'crud',
//     reducer: createReducer(
//       initialState,
//
//       // Create
//       on(actions.create, (state) => ({ ...state, isSubmitting: true })),
//       on(actions.createdSuccessfully, (state, action) => ({
//         ...state,
//         isSubmitting: false,
//         itemsList: [...state.itemsList, action.currentItem],
//       })),
//       on(actions.createFailure, (state, action) => ({
//         ...state,
//         isSubmitting: false,
//         errors: action,
//       })),
//
//       // Read
//       on(actions.get, (state) => ({
//         ...state,
//         isLoading: true,
//       })),
//       on(actions.getItemSuccess, (state, action) => ({
//         ...state,
//         isLoading: false,
//         currentItem: action.currentItem,
//       })),
//       on(actions.getItemFailure, (state, action) => ({
//         ...state,
//         isLoading: false,
//         errors: action,
//       })),
//
//       on(actions.getAll, (state) => ({
//         ...state,
//         isLoading: true,
//       })),
//       on(actions.getItemsSuccess, (state, action) => ({
//         ...state,
//         isLoading: false,
//         itemsList: action.itemsList,
//       })),
//       on(actions.getItemsFailure, (state, action) => ({
//         ...state,
//         isLoading: false,
//         errors: action,
//       })),
//
//       on(actions.getAllByTwoKeyValue, (state) => ({
//         ...state,
//         isLoading: true,
//       })),
//       on(actions.getAllByTwoKeyValueItemsSuccess, (state, action) => ({
//         ...state,
//         isLoading: false,
//         itemsList: action.itemsList,
//       })),
//       on(actions.getAllByTwoKeyValueItemsFailure, (state, action) => ({
//         ...state,
//         isLoading: false,
//         errors: action,
//       })),
//
//       // Update
//       on(actions.update, (state) => ({
//         ...state,
//         isSubmitting: true,
//       })),
//       on(actions.updatedSuccessfully, (state, action) => ({
//         ...state,
//         isSubmitting: false,
//         currentItem: action.updatedItem,
//         itemsList: state.itemsList.map((item) =>
//           item.id === action.updatedItem.id ? action.updatedItem : item,
//         ),
//         errors: null,
//       })),
//       on(actions.updateFailure, (state, action) => ({
//         ...state,
//         isSubmitting: false,
//         errors: action,
//       })),
//
//       // Delete
//       on(actions.delete, (state) => ({
//         ...state,
//         isSubmitting: true,
//       })),
//       on(actions.deletedSuccessfully, (state, action) => ({
//         ...state,
//         isSubmitting: false,
//         itemsList: (state.itemsList || []).filter(
//           (item) => item.id !== action.id,
//         ),
//         errors: null,
//       })),
//       on(actions.deleteFailure, (state, action) => ({
//         ...state,
//         isSubmitting: false,
//         errors: action,
//       })),
//       on(actions.sort, (state, action) => ({
//         ...state,
//         isLoading: true,
//       })),
//       on(actions.sortSuccess, (state, action) => ({
//         ...state,
//         isLoading: false,
//         itemsList: action.sortedItemsList,
//       })),
//     ),
//   });
//
//   return {
//     name: 'crud',
//     reducer: crudFeature.reducer,
//     selectIsSubmitting: crudFeature.selectIsSubmitting,
//     selectIsLoading: crudFeature.selectIsLoading,
//     selectCurrentItem: crudFeature.selectCurrentItem,
//     selectItemsList: crudFeature.selectItemsList,
//   };
// }

// const crudFeature = createFeature({
//   name: 'crud',
//   reducer: createReducer(
//     initialState,
//
//     // Create
//     on(actions.create, (store) => ({ ...store, isSubmitting: true })),
//     on(actions.createdSuccessfully, (store, action) => ({
//       ...store,
//       isSubmitting: false,
//       itemsList: [...store.itemsList, action.currentItem],
//     })),
//     on(actions.createFailure, (store, action) => ({
//       ...store,
//       isSubmitting: false,
//       errors: action,
//     })),
//
//     // Read
//     on(actions.get, (store) => ({
//       ...store,
//       isLoading: true,
//     })),
//     on(actions.getItemSuccess, (store, action) => ({
//       ...store,
//       isLoading: false,
//       currentItem: action.currentItem,
//     })),
//     on(actions.getItemFailure, (store, action) => ({
//       ...store,
//       isLoading: false,
//       errors: action,
//     })),
//
//     on(actions.getAll, (store) => ({
//       ...store,
//       isLoading: true,
//     })),
//     on(actions.getItemsSuccess, (store, action) => ({
//       ...store,
//       isLoading: false,
//       itemsList: action.itemsList,
//     })),
//     on(actions.getItemsFailure, (store, action) => ({
//       ...store,
//       isLoading: false,
//       errors: action,
//     })),
//
//     on(actions.getAllByTwoKeyValue, (store) => ({
//       ...store,
//       isLoading: true,
//     })),
//     on(actions.getAllByTwoKeyValueItemsSuccess, (store, action) => ({
//       ...store,
//       isLoading: false,
//       itemsList: action.itemsList,
//     })),
//     on(actions.getAllByTwoKeyValueItemsFailure, (store, action) => ({
//       ...store,
//       isLoading: false,
//       errors: action,
//     })),
//
//     // Update
//     on(actions.update, (store) => ({
//       ...store,
//       isSubmitting: true,
//     })),
//     on(actions.updatedSuccessfully, (store, action) => ({
//       ...store,
//       isSubmitting: false,
//       currentItem: action.updatedItem,
//       itemsList: store.itemsList.map((item) =>
//         item.id === action.updatedItem.id ? action.updatedItem : item,
//       ),
//       errors: null,
//     })),
//     on(actions.updateFailure, (store, action) => ({
//       ...store,
//       isSubmitting: false,
//       errors: action,
//     })),
//
//     // Delete
//     on(actions.delete, (store) => ({
//       ...store,
//       isSubmitting: true,
//     })),
//     on(actions.deletedSuccessfully, (store, action) => ({
//       ...store,
//       isSubmitting: false,
//       itemsList: (store.itemsList || []).filter(
//         (item) => item.id !== action.id,
//       ),
//       errors: null,
//     })),
//     on(actions.deleteFailure, (store, action) => ({
//       ...store,
//       isSubmitting: false,
//       errors: action,
//     })),
//
//     on(actions.sort, (store, action) => ({
//       ...store,
//       isLoading: true,
//     })),
//     on(actions.sortSuccess, (store, action) => ({
//       ...store,
//       isLoading: false,
//       itemsList: action.sortedItemsList,
//     })),
//   ),
// });
// export const {
//   name: crudFeatureKey,
//   reducer: crudReducer,
//   selectIsSubmitting,
//   selectIsLoading,
//   selectCurrentItem,
//   selectItemsList,
// } = crudFeature;
