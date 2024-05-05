import { createFeature, createReducer, on } from '@ngrx/store';
import { paginationActions } from './pagination.actions';

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number | 'All';
}

export const initialPaginationState: PaginationState = {
  currentPage: 1,
  itemsPerPage: 4,
};

export const paginationFeature = createFeature({
  name: 'pagination',
  reducer: createReducer(
    initialPaginationState,
    on(paginationActions.updateCurrentPage, (state, { currentPage }) => ({
      ...state,
      currentPage,
    })),
    on(paginationActions.updateItemsPerPage, (state, { itemsPerPage }) => ({
      ...state,
      itemsPerPage,
    })),
  ),
});

export const {
  name: paginationFeatureKey,
  reducer: paginationReducer,
  selectPaginationState,
  selectCurrentPage,
  selectItemsPerPage,
} = paginationFeature;
