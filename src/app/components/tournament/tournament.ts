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
  allSeasonSportTournaments$: Observable<ITournament[]>;

  constructor(private store: Store<AppState>) {
    this.allSeasonSportTournaments$ = store.select(
      (state) => state.tournament.allSeasonSportTournaments,
    );
  }

  loadSeasonSportTournaments() {
    this.store.dispatch(tournamentActions.getTournamentsBySportAndSeason());
  }
}
