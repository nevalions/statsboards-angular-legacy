import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ITournament } from '../../type/tournament.type';
import { AppState } from '../../store/appstate';
import { tournamentActions } from './store/actions';

@Injectable({
  providedIn: 'root',
})
export class Tournament {
  currentTournament$: Observable<ITournament | null | undefined>;
  allSeasonSportTournaments$: Observable<ITournament[]>;

  constructor(private store: Store<AppState>) {
    this.currentTournament$ = store.select(
      (state) => state.tournament.currentTournament,
    );
    this.allSeasonSportTournaments$ = store.select(
      (state) => state.tournament.allSeasonSportTournaments,
    );
  }

  loadSeasonSportTournaments() {
    this.store.dispatch(tournamentActions.getTournamentsBySportAndSeason());
  }

  loadCurrentTournament() {
    this.store.dispatch(tournamentActions.getId());
  }

  createTournament(tournament: ITournament) {
    this.store.dispatch(tournamentActions.create({ request: tournament }));
  }

  deleteTournament() {
    this.store.dispatch(tournamentActions.delete());
  }
}
