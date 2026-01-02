import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ITournament } from '../../type/tournament.type';
import { AppState } from '../../store/appstate';
import { tournamentActions } from './store/actions';
import { ISponsor, ISponsorLineFullData } from '../../type/sponsor.type';

@Injectable({
  providedIn: 'root',
})
export class Tournament {
  private store = inject<Store<AppState>>(Store);

  currentTournament$: Observable<ITournament | null | undefined>;
  currentTournamentMainSponsor$: Observable<ISponsor | null | undefined>;
  allSeasonSportTournaments$: Observable<ITournament[]>;
  mainTournamentSponsor$: Observable<ISponsor | null | undefined>;
  tournamentSponsorLine$: Observable<ISponsorLineFullData | null | undefined>;

  constructor() {
    const store = this.store;

    this.currentTournament$ = store.select(
      (state) => state.tournament.currentTournament,
    );
    this.allSeasonSportTournaments$ = store.select(
      (state) => state.tournament.allSeasonSportTournaments,
    );
    this.currentTournamentMainSponsor$ = store.select(
      (state) => state.tournament.currentTournamentMainSponsor,
    );
    this.mainTournamentSponsor$ = store.select(
      (state) => state.sponsor.currentSponsor,
    );
    this.tournamentSponsorLine$ = store.select(
      (state) => state.sponsorLine.currentSponsorLineWithFullData,
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

  updateTournament(tournament: ITournament) {
    this.store.dispatch(
      tournamentActions.update({
        id: tournament.id!,
        newTournamentData: tournament,
      }),
    );
  }

  deleteTournament() {
    this.store.dispatch(tournamentActions.delete());
  }
}
