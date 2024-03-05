import { createFeature, createReducer, on } from '@ngrx/store';
import { Breadcrumb } from '../type/base.type';
import { breadcrumbActions } from './breadcrumbs.actions';

export interface BreadcrumbState {
  breadcrumbs: Breadcrumb[];
  currentBreadcrumb: Breadcrumb | null;
}

const initialState: BreadcrumbState = {
  breadcrumbs: [],
  currentBreadcrumb: null,
};

const breadcrumbFeature = createFeature({
  name: 'breadcrumb',
  reducer: createReducer(
    initialState,
    // on(breadcrumbActions.setBreadcrumb, (state, { breadcrumb }) => {
    //   // Find the index of breadcrumb with the same level. If none, index will be -1
    //   let index = state.breadcrumbs.findIndex(
    //     (bc) => bc.level === breadcrumb.level,
    //   );
    //
    //   // If a breadcrumb with the same level exists, replace it
    //   if (index !== -1) {
    //     let updatedBreadcrumbs = [...state.breadcrumbs];
    //     updatedBreadcrumbs[index] = breadcrumb;
    //     return { ...state, breadcrumbs: updatedBreadcrumbs };
    //   }
    //
    //   // If a breadcrumb with the same level does not exist, just append it
    //   else {
    //     return { ...state, breadcrumbs: [...state.breadcrumbs, breadcrumb] };
    //   }
    // }),
    on(breadcrumbActions.breadcrumbsUpdated, (state, action) => {
      let updatedBreadcrumbs = [...state.breadcrumbs];
      action.breadcrumbs.forEach((newBreadcrumb) => {
        const index = updatedBreadcrumbs.findIndex(
          (bc) => bc.level === newBreadcrumb.level,
        );
        if (index !== -1) {
          // Update the breadcrumb at the same level
          updatedBreadcrumbs[index] = newBreadcrumb;
          // Remove breadcrumbs with a higher level
          updatedBreadcrumbs = updatedBreadcrumbs.filter(
            (bc) => bc.level! <= newBreadcrumb.level!,
          );
        } else {
          // If the breadcrumb doesn't exist in the state, just add it
          updatedBreadcrumbs.push(newBreadcrumb);
        }
      });
      return { ...state, breadcrumbs: updatedBreadcrumbs };
    }),
    on(breadcrumbActions.clearBreadcrumb, (state) => ({
      ...state,
      breadcrumbs: [],
    })),
    on(breadcrumbActions.setCurrentBreadcrumb, (state, { breadcrumb }) => ({
      ...state,
      currentBreadcrumb: breadcrumb,
    })),
    on(breadcrumbActions.clearCurrentBreadcrumb, (state) => ({
      ...state,
      currentBreadcrumb: null,
    })),
    on(breadcrumbActions.clearBreadcrumbsAfterIndex, (state, { index }) => {
      return { ...state, breadcrumbs: state.breadcrumbs.slice(0, index) };
    }),
    // on(breadcrumbActions.clearBreadcrumbsFromLevel, (state, { level }) => {
    //   return {
    //     ...state,
    //     breadcrumbs: state.breadcrumbs.filter((bc) => bc.level! < level),
    //   };
    // }),
  ),
});

export const {
  name: breadcrumbFeatureKey,
  reducer: breadcrumbReducer,
  selectCurrentBreadcrumb,
  selectBreadcrumbs,
} = breadcrumbFeature;
