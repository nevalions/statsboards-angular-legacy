import { createSelector } from '@ngrx/store';
import { selectPaginationState } from './pagination.reducers';
import {
  selectPersonSearchResults,
  selectTeamInSportSearchResults,
} from '../search/search.reducers';

function isNumber(value: any): value is number {
  return typeof value === 'number' && isFinite(value);
}

function getTotalPages(totalItems: number, itemsPerPage: number | 'All') {
  if (itemsPerPage === 'All') {
    return 1;
  }
  if (isFinite(itemsPerPage)) {
    return Math.ceil(totalItems / itemsPerPage);
  }
  return 1;
}

function getPaginatedResults(
  searchResults: any[],
  currentPage: number,
  itemsPerPage: number | 'All',
) {
  if (itemsPerPage === 'All' || !isNumber(itemsPerPage)) {
    return searchResults;
  }
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return searchResults.slice(start, end);
}

// Search Items Selectors
export const selectPersonSearchItems = createSelector(
  selectPersonSearchResults,
  (results) => results.length,
);
export const selectTeamInSportSearchItems = createSelector(
  selectTeamInSportSearchResults,
  (results) => results.length,
);

// Total Pages Selectors
export const selectTotalPersonSearchPages = createSelector(
  selectPersonSearchItems,
  selectPaginationState,
  (totalItems, pagination) =>
    getTotalPages(totalItems, pagination.itemsPerPage),
);

export const selectTotalTeamInSportSearchPages = createSelector(
  selectTeamInSportSearchItems,
  selectPaginationState,
  (totalItems, pagination) =>
    getTotalPages(totalItems, pagination.itemsPerPage),
);

// Paginated Results Selectors
export const selectPaginatedPersonSearchResults = createSelector(
  selectPersonSearchResults,
  selectPaginationState,
  (personSearchResults, pagination) =>
    getPaginatedResults(
      personSearchResults,
      pagination.currentPage,
      pagination.itemsPerPage,
    ),
);

export const selectPaginatedTeamInSportSearchResults = createSelector(
  selectTeamInSportSearchResults,
  selectPaginationState,
  (teamInSportSearchResults, pagination) =>
    getPaginatedResults(
      teamInSportSearchResults,
      pagination.currentPage,
      pagination.itemsPerPage,
    ),
);
