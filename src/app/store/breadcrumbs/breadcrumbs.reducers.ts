import { createFeature, createReducer, on } from '@ngrx/store';
import { Breadcrumb } from '../../type/base.type';
import { breadcrumbActions } from './breadcrumbs.actions';

export interface BreadcrumbState {
  breadcrumbs: Breadcrumb[];
  currentBreadcrumb: Breadcrumb | null;
}

let initialState: BreadcrumbState = {
  breadcrumbs: [],
  currentBreadcrumb: null,
};

const localStorageState = localStorage.getItem('breadcrumbs');

if (localStorageState) {
  try {
    initialState = {
      ...initialState,
      breadcrumbs: JSON.parse(localStorageState),
    };
  } catch (e) {
    console.error(`Error parsing breadcrumbs from local storage: ${e}`);
  }
}

const breadcrumbFeature = createFeature({
  name: 'breadcrumb',
  reducer: createReducer(
    initialState,
    on(breadcrumbActions.breadcrumbsUpdated, (state, action) => {
      let updatedBreadcrumbs = [...state.breadcrumbs];

      action.breadcrumbs.forEach((newBreadcrumb) => {
        // Remove breadcrumbs with a higher level
        updatedBreadcrumbs = updatedBreadcrumbs.filter(
          (bc) => (bc.level || 1) <= newBreadcrumb.level!,
        );
        // console.log('After filtering', updatedBreadcrumbs);

        // Find the index after filtering
        const index = updatedBreadcrumbs.findIndex(
          (bc) => bc.level === newBreadcrumb.level,
        );
        // console.log('Index', index);

        if (index !== -1) {
          // Update the breadcrumb at the same level
          updatedBreadcrumbs[index] = newBreadcrumb;
          // console.log('After updating breadcrumb', updatedBreadcrumbs);
        } else {
          // If the breadcrumb doesn't exist in the state, just add it
          updatedBreadcrumbs.push(newBreadcrumb);
          // console.log('After adding new breadcrumb', updatedBreadcrumbs);
        }
      });

      const newState = { ...state, breadcrumbs: updatedBreadcrumbs };
      try {
        localStorage.setItem('breadcrumbs', JSON.stringify(newState));
      } catch (e) {
        console.error('Error saving state to local storage:', e);
      }

      return newState;
    }),
    on(breadcrumbActions.loadStateFromLocalStorage, (state) => {
      const loadedState = localStorage.getItem('breadcrumbs');
      if (loadedState === null) {
        return state;
      }

      try {
        const stateFromStorage: BreadcrumbState = JSON.parse(loadedState);
        return { ...stateFromStorage };
      } catch (e) {
        console.error('Error parsing state from local storage:', e);
        return state;
      }
    }),
  ),
});

export const {
  name: breadcrumbFeatureKey,
  reducer: breadcrumbReducer,
  selectCurrentBreadcrumb,
  selectBreadcrumbs,
} = breadcrumbFeature;
