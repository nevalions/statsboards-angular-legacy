import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../appstate';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { ITeam } from '../../type/team.type';
import { searchActions } from './search.actions';
import { selectAllTeamsInSport } from '../../components/team/store/reducers';
import { IPerson } from '../../type/person.type';

@Injectable({
  providedIn: 'root',
})
export class Search {
  personSearchTerm$: Observable<string | null>;
  personSearchResults$: Observable<IPerson[]>;

  teamInSportSearchTerm$: Observable<string | null>;
  teamInSportSearchResults$: Observable<ITeam[]>;

  constructor(private store: Store<AppState>) {
    this.personSearchTerm$ = this.store.select(
      (state) => state.search.personSearchTerm,
    );
    this.personSearchResults$ = this.store.select(
      (state) => state.search.personSearchResults,
    );

    this.teamInSportSearchTerm$ = this.store.select(
      (state) => state.search.teamInSportSearchTerm,
    );
    this.teamInSportSearchResults$ = this.store.select(
      (state) => state.search.teamInSportSearchResults,
    );
  }

  searchPerson(term: string | null) {
    this.store.dispatch(searchActions.updatePersonSearchTerm({ term }));
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
