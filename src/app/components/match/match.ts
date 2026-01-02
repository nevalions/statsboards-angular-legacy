import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/appstate';
import { IMatch } from '../../type/match.type';
import { matchActions } from './store/actions';
import { ITournament } from '../../type/tournament.type';

@Injectable({
  providedIn: 'root',
})
export class Match {
  private store = inject<Store<AppState>>(Store);

  matchIsLoading$: Observable<boolean>;
  match$: Observable<IMatch | null | undefined>;
  matchesInSport$: Observable<IMatch[]>;
  matchesInTournament$: Observable<IMatch[]>;
  matchesInTournamentWithPagination$: Observable<IMatch[]>;
  matchTournament$: Observable<ITournament | null | undefined>;

  constructor() {
    const store = this.store;

    this.matchIsLoading$ = store.select((state) => state.match.matchIsLoading);
    this.match$ = store.select((state) => state.match.currentMatch);
    this.matchesInSport$ = store.select(
      (state) => state.match.allMatchesInSport,
    );
    this.matchesInTournament$ = store.select(
      (state) => state.match.allMatchesInTournament,
    );
    this.matchesInTournamentWithPagination$ = store.select(
      (state) => state.match.allMatchesInTournamentPaginated,
    );
    this.matchTournament$ = store.select(
      (state) => state.tournament.currentTournament,
    );
  }

  loadCurrentMatch() {
    this.store.dispatch(matchActions.getId());
  }

  loadAllMatchesInSport() {
    this.store.dispatch(matchActions.getMatchesBySportId());
  }

  loadAllMatchesInTournament() {
    this.store.dispatch(matchActions.getMatchesByTournamentId());
  }

  loadAllMatchesInTournamentWithPagination() {
    this.store.dispatch(matchActions.getMatchesByTournamentIdWithPagination());
  }

  createMatch(match: IMatch) {
    this.store.dispatch(matchActions.create({ request: match }));
  }

  updateMatch(match: IMatch) {
    // console.log(match, match.id);
    this.store.dispatch(
      matchActions.update({ id: match.id!, newMatchData: match }),
    );
  }

  deleteMatch() {
    this.store.dispatch(matchActions.delete());
    //   DELETE FULL DATA FROM REDUCER
  }

  parsMatchesInTournamentEESL() {
    this.store.dispatch(matchActions.parsMatchesFromTournamentEESL());
  }
}
