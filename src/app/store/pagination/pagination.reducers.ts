import { createFeature, createReducer, on } from '@ngrx/store';
import { paginationActions } from './pagination.actions';

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number | 'All';

  currentPagePlayersInTeamTable: number;
  itemsPerPagePlayersInTeamTable: number | 'All';
}

export const initialPaginationState: PaginationState = {
  currentPage: 1,
  itemsPerPage: 5,
  currentPagePlayersInTeamTable: 1,
  itemsPerPagePlayersInTeamTable: 10,
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

    on(
      paginationActions.updatePlayersInTeamTableCurrentPage,
      (state, { currentPage }) => {
        return {
          ...state,
          currentPagePlayersInTeamTable: currentPage,
        };
      },
    ),
    on(
      paginationActions.updatePlayersInTeamTablePerPage,
      (state, { itemsPerPage }) => {
        return {
          ...state,
          itemsPerPagePlayersInTeamTable: itemsPerPage,
        };
      },
    ),
  ),
});

export const {
  name: paginationFeatureKey,
  reducer: paginationReducer,
  selectPaginationState,
  selectCurrentPage,
  selectItemsPerPage,
  selectCurrentPagePlayersInTeamTable,
  selectItemsPerPagePlayersInTeamTable,
} = paginationFeature;
