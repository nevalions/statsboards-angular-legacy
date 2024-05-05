import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../appstate';
import { Observable } from 'rxjs';
import {
  selectPaginatedTeamInSportSearchResults,
  selectTotalTeamInSportSearchPages,
} from './pagination.selectors';
import { ITeam } from '../../type/team.type';
import { paginationActions } from './pagination.actions';

@Injectable({
  providedIn: 'root',
})
export class Pagination {
  currentPage$: Observable<number>;
  itemsPerPage$: Observable<number | string>;
  paginatedTeamInSportSearchResults$: Observable<ITeam[]>;
  totalTeamInSportSearchPages$: Observable<number>;

  constructor(private store: Store<AppState>) {
    this.currentPage$ = store.select((state) => state.pagination.currentPage);
    this.itemsPerPage$ = store.select((state) => state.pagination.itemsPerPage);
    this.paginatedTeamInSportSearchResults$ = store.select(
      selectPaginatedTeamInSportSearchResults,
    );
    this.totalTeamInSportSearchPages$ = store.select(
      selectTotalTeamInSportSearchPages,
    );
  }

  resetCurrentPage() {
    this.store.dispatch(
      paginationActions.updateCurrentPage({ currentPage: 1 }),
    );
  }

  changePage(page: number) {
    this.store.dispatch(
      paginationActions.updateCurrentPage({ currentPage: page }),
    );
  }

  changeItemsPerPage(itemsPerPage: number | 'All') {
    this.store.dispatch(paginationActions.updateItemsPerPage({ itemsPerPage }));
  }
}
