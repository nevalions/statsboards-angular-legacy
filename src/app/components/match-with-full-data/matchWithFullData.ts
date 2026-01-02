import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/appstate';
import { matchWithFullDataActions } from './store/actions';
import { IMatchWithFullData } from '../../type/match.type';

@Injectable({
  providedIn: 'root',
})
export class MatchWithFullData {
  private store = inject<Store<AppState>>(Store);

  matchWithFullData$: Observable<IMatchWithFullData | null | undefined>;
  matchesWithFullDataInSport$: Observable<IMatchWithFullData[]>;
  matchesWithFullDataInTournament$: Observable<IMatchWithFullData[]>;

  constructor() {
    const store = this.store;

    this.matchWithFullData$ = store.select(
      (state) => state.matchWithFullData.currentMatchWithFullData,
    );
    this.matchesWithFullDataInSport$ = store.select(
      (state) => state.matchWithFullData.allMatchesWithFullDataInSport,
    );
    this.matchesWithFullDataInTournament$ = store.select(
      (state) => state.matchWithFullData.allMatchesWithFullDataInTournament,
    );
  }

  loadCurrentMatch() {
    this.store.dispatch(matchWithFullDataActions.getId());
  }

  loadAllMatchesInSport() {
    this.store.dispatch(
      matchWithFullDataActions.getMatchesWithFullDataBySportId(),
    );
  }

  loadAllMatchesInTournament() {
    this.store.dispatch(
      matchWithFullDataActions.getMatchesWithFullDataByTournamentId(),
    );
  }

  loadPaginatedMatchesInTournament() {
  }

  createMatch(match: IMatchWithFullData) {
    this.store.dispatch(matchWithFullDataActions.create({ request: match }));
  }

  deleteMatch(id: number) {
    this.store.dispatch(matchWithFullDataActions.delete({ id }));
  }
}
