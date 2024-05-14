import { createSelector } from '@ngrx/store';
import { selectPaginationState } from './pagination.reducers';
import {
  selectMatchSearchResults,
  selectMatchSearchTerm,
  selectMatchSearchWeek,
  selectMatchSearchWeekResults,
  selectPersonSearchResults,
  selectPlayerInSportSearchResults,
  selectTeamInSportSearchResults,
} from '../search/search.reducers';
import { IMatchWithFullData } from '../../type/match.type';

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
export const selectPlayerInSportSearchItems = createSelector(
  selectPlayerInSportSearchResults,
  (results) => results.length,
);
export const selectTeamInSportSearchItems = createSelector(
  selectTeamInSportSearchResults,
  (results) => results.length,
);
export const selectMatchInTournamentSearchItems = createSelector(
  selectMatchSearchResults,
  (results) => results.length,
);
export const selectMatchInTournamentWeekSearchItems = createSelector(
  selectMatchSearchWeekResults,
  (results) => results.length,
);

// Total Pages Selectors
export const selectTotalPersonSearchPages = createSelector(
  selectPersonSearchItems,
  selectPaginationState,
  (totalItems, pagination) =>
    getTotalPages(totalItems, pagination.itemsPerPage),
);
export const selectTotalPlayerInSportSearchPages = createSelector(
  selectPlayerInSportSearchItems,
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
export const selectTotalMatchesInTournamentSearchPages = createSelector(
  selectMatchInTournamentSearchItems,
  selectPaginationState,
  (totalItems, pagination) =>
    getTotalPages(totalItems, pagination.itemsPerPage),
);
export const selectTotalMatchesInTournamentWeekSearchPages = createSelector(
  selectMatchInTournamentWeekSearchItems,
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
export const selectPaginatedPlayerInSportSearchResults = createSelector(
  selectPlayerInSportSearchResults,
  selectPaginationState,
  (playerSearchResults, pagination) =>
    getPaginatedResults(
      playerSearchResults,
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
export const selectPaginatedMatchesInTournamentSearchResults = createSelector(
  selectMatchSearchResults,
  selectPaginationState,
  (matchInTournamentSearchResults, pagination) =>
    getPaginatedResults(
      matchInTournamentSearchResults,
      pagination.currentPage,
      pagination.itemsPerPage,
    ),
);

export const selectPaginatedMatchesInTournamentWeekSearchResults =
  createSelector(
    selectMatchSearchWeekResults,
    selectPaginationState,
    (matchInTournamentSearchResults, pagination) =>
      getPaginatedResults(
        matchInTournamentSearchResults,
        pagination.currentPage,
        pagination.itemsPerPage,
      ),
  );
/////////////////////////////////
///////////////////////////////
///////////////////////////////

// Selector to filter by team title
// export const selectMatchesByTeamTitle = createSelector(
//   selectMatchSearchResults,
//   (matches) => {
//     console.log('matches search', matches);
//     return matches;
//
//     // .filter((match) =>
//     // matches.filter(
//     //   (match: IMatchWithFullData) =>
//     //     match.teams_data?.team_a.title
//     //       .toLowerCase()
//     //       .startsWith(searchTerm.toLowerCase()) ||
//     //     match.teams_data?.team_b.title
//     //       .toLowerCase()
//     //       .startsWith(searchTerm.toLowerCase()),
//     // ),
//     // );
//   },
// );
//
// // Selector to filter by week
// export const selectMatchesByWeek = createSelector(
//   selectMatchSearchWeekResults,
//   (matches) =>
//     matches.filter(
//       (match) =>
//         match.match.week.toString().toLowerCase() ===
//         selectMatchSearchWeek.toString().toLowerCase(),
//     ),
// );

// Combined paginated search selector
export const selectSearchFilteredMatches = createSelector(
  selectMatchSearchResults,
  selectMatchSearchWeekResults,
  selectPaginationState,
  (matchesByTeam, matchesByWeek, pagination) => {
    // Find matches that appear in both filtered results
    console.log(matchesByTeam, matchesByWeek, pagination);
    const filteredMatches = matchesByTeam.filter((match) =>
      matchesByWeek.some((weekMatch) => weekMatch.id === match.id),
    );

    console.log('combined', filteredMatches);

    return filteredMatches;
  },
);

export const selectPaginatedFilteredMatches = createSelector(
  selectSearchFilteredMatches,
  selectPaginationState,
  (matches, pagination) => {
    const filtered = getPaginatedResults(
      matches,
      pagination.currentPage,
      pagination.itemsPerPage,
    );

    // console.log('filtered', filtered);

    return filtered;
  },
);

export const selectMatchCombinedSearchItems = createSelector(
  selectSearchFilteredMatches,
  (results) => results.length,
);

// Create a selector for total pages after filtering
export const selectTotalFilteredMatchesPages = createSelector(
  selectMatchCombinedSearchItems,
  selectPaginationState,
  (filteredMatches, pagination) =>
    getTotalPages(filteredMatches, pagination.itemsPerPage),
);
