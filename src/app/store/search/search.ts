import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../appstate';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { ITeam } from '../../type/team.type';
import { searchActions } from './search.actions';
import { selectAllTeamsInSport } from '../../components/team/store/reducers';

@Injectable({
  providedIn: 'root',
})
export class Search {
  teamInSportSearchTerm$: Observable<string | null>;
  teamInSportSearchResults$: Observable<ITeam[]>;

  constructor(private store: Store<AppState>) {
    this.teamInSportSearchTerm$ = this.store.select(
      (state) => state.search.teamInSportSearchTerm,
    );
    this.teamInSportSearchResults$ = this.store.select(
      (state) => state.search.teamInSportSearchResults,
    );
  }

  searchTeamInSport(term: string | null) {
    this.store.dispatch(searchActions.updateTeamInSportSearchTerm({ term }));
  }

  getFilteredOrFullTeamsInSportList(): Observable<ITeam[]> {
    return combineLatest([
      this.teamInSportSearchTerm$.pipe(startWith('')),
      this.store.select(selectAllTeamsInSport),
      this.teamInSportSearchResults$.pipe(startWith(null)),
    ]).pipe(
      map(([searchTerm, allTeams, searchResults]) => {
        return searchTerm === '' || searchResults === null
          ? allTeams
          : searchResults;
      }),
    );
  }
}
