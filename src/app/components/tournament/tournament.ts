import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ITournament } from '../../type/tournament.type';
import { AppState } from '../../store/appstate';
import { tournamentActions } from './store/actions';
import { ISponsor } from '../../type/sponsor.type';

@Injectable({
  providedIn: 'root',
})
export class Tournament {
  currentTournament$: Observable<ITournament | null | undefined>;
  currentTournamentMainSponsor$: Observable<ISponsor | null | undefined>;
  allSeasonSportTournaments$: Observable<ITournament[]>;

  constructor(private store: Store<AppState>) {
    this.currentTournament$ = store.select(
      (state) => state.tournament.currentTournament,
    );
    this.allSeasonSportTournaments$ = store.select(
      (state) => state.tournament.allSeasonSportTournaments,
    );
    this.currentTournamentMainSponsor$ = store.select(
      (state) => state.tournament.currentTournamentMainSponsor,
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
