import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../appstate';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { ITeam } from '../../type/team.type';
import { searchActions } from './search.actions';
import { selectAllTeamsInSport } from '../../components/team/store/reducers';
import { IPerson } from '../../type/person.type';
import { IPlayer, IPlayerInSport } from '../../type/player.type';

@Injectable({
  providedIn: 'root',
})
export class Search {
  private store = inject<Store<AppState>>(Store);

  personSearchTerm$: Observable<string | null>;
  personSearchResults$: Observable<IPerson[]>;

  playerSearchTerm$: Observable<string | null>;
  playerInSportSearchResults$: Observable<IPlayerInSport[]>;

  teamInSportSearchTerm$: Observable<string | null>;
  teamInSportSearchResults$: Observable<ITeam[]>;

  constructor() {
    this.personSearchTerm$ = this.store.select(
      (state) => state.search.personSearchTerm,
    );
    this.personSearchResults$ = this.store.select(
      (state) => state.search.personSearchResults,
    );

    this.playerSearchTerm$ = this.store.select(
      (state) => state.search.playerInSportSearchTerm,
    );

    this.playerInSportSearchResults$ = this.store.select(
      (state) => state.search.playerInSportSearchResults,
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

  searchPlayerInSport(term: string | null) {
    this.store.dispatch(searchActions.updatePlayerInSportSearchTerm({ term }));
  }

  searchTeamInSport(term: string | null) {
    this.store.dispatch(searchActions.updateTeamInSportSearchTerm({ term }));
  }

  searchMatch(term: string | null) {
    this.store.dispatch(searchActions.updateMatchSearchTerm({ term }));
  }

  searchMatchByWeek(week: string | null) {
    // console.log('week', week);
    this.store.dispatch(searchActions.updateMatchSearchWeek({ week }));
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
