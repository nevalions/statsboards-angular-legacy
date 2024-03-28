import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/appstate';
import { IMatch } from '../../type/match.type';
import { matchActions } from './store/actions';
import { selectCurrentMatchWithTeams } from './store/selectors';

@Injectable({
  providedIn: 'root',
})
export class Match {
  match$: Observable<IMatch | null | undefined>;
  matchesInSport$: Observable<IMatch[]>;
  matchesInTournament$: Observable<IMatch[]>;

  constructor(private store: Store<AppState>) {
    this.match$ = store.select((state) => state.match.currentMatch);
    this.matchesInSport$ = store.select(
      (state) => state.match.allMatchesInSport,
    );
    this.matchesInTournament$ = store.select(
      (state) => state.match.allMatchesInTournament,
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

  createMatch(match: IMatch) {
    this.store.dispatch(matchActions.create({ request: match }));
  }

  updateMatch(match: IMatch) {
    console.log(match, match.id);
    this.store.dispatch(
      matchActions.update({ id: match.id!, newMatchData: match }),
    );
  }

  deleteMatch() {
    this.store.dispatch(matchActions.delete());
    //   DELETE FULL DATA FROM REDUCER
  }
}
