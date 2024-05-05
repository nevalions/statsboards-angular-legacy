import { createSelector } from '@ngrx/store';
import { selectAllTeams } from '../../components/team/store/reducers';
import { selectPaginationState } from './pagination.reducers';
import { selectTeamInSportSearchResults } from '../search/search.reducers';

function isNumber(value: any): value is number {
  return typeof value === 'number' && isFinite(value);
}

export const selectPaginatedTeams = createSelector(
  selectAllTeams,
  selectPaginationState,
  (teams, pagination) => {
    if (
      pagination.itemsPerPage === 'All' ||
      !isNumber(pagination.itemsPerPage)
    ) {
      return teams; // Return all teams if 'All' is selected or itemsPerPage is not a number
    }
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;
    return teams.slice(start, end);
  },
);

export const selectPaginatedTeamInSportSearchResults = createSelector(
  selectTeamInSportSearchResults,
  selectPaginationState,
  (teamInSportSearchResults, pagination) => {
    if (
      pagination.itemsPerPage === 'All' ||
      !isNumber(pagination.itemsPerPage)
    ) {
      // If itemsPerPage is 'All' or not a number, return all results
      return teamInSportSearchResults;
    }

    // Compute start and end considering pagination.itemsPerPage is a number here
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;

    // console.log(`Current Page: ${pagination.currentPage}`);
    // console.log(`Items Per Page: ${pagination.itemsPerPage}`);
    // console.log(`Slice Start Index: ${start}`, `Slice End Index: ${end}`);
    // console.log('Total search results:', teamInSportSearchResults.length);
    // console.log(
    //   'Paginated search results:',
    //   teamInSportSearchResults.slice(start, end),
    // );

    return teamInSportSearchResults.slice(start, end);
  },
);

export const selectTeamInSportSearchItems = createSelector(
  selectTeamInSportSearchResults,
  (searchResults) => searchResults.length,
);

export const selectTotalTeamInSportSearchPages = createSelector(
  selectTeamInSportSearchItems,
  selectPaginationState,
  (totalItems, { itemsPerPage }) => {
    if (itemsPerPage === 'All') {
      return 1;
    }

    if (typeof itemsPerPage === 'number' && isFinite(itemsPerPage)) {
      return Math.ceil(totalItems / itemsPerPage);
    }

    return 1;
  },
);
