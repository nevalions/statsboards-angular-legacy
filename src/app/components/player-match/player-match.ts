import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/appstate';
import { IPlayerInMatch, IPlayerInMatchFullData } from '../../type/player.type';
import { playerInMatchActions } from './store/actions';
import {
  selectAllPlayersInMatch,
  selectAllPlayersInMatchFullData,
  selectCurrentPlayerInMatch,
  selectPlayerInMatchIsLoading,
} from './store/reducers';
import {
  selectAwayFootballDefense,
  selectAwayFootballOffense,
  selectAwayFootballStartDefense,
  selectAwayFootballStartOffense,
  selectAwayTeamRoster,
  selectHomeFootballDefense,
  selectHomeFootballOffense,
  selectHomeFootballStartDefense,
  selectHomeFootballStartOffense,
  selectHomeTeamRoster,
} from './store/selectors';

@Injectable({
  providedIn: 'root',
})
export class PlayerInMatch {
  playerInMatchIsLoading$: Observable<boolean>;
  currentPlayerInMatch$: Observable<IPlayerInMatch | null | undefined>;
  allPlayersInMatch$: Observable<IPlayerInMatch[]>;
  allPlayersFullDataInMatch$: Observable<IPlayerInMatchFullData[]>;
  homeRoster$: Observable<IPlayerInMatchFullData[]>;
  awayRoster$: Observable<IPlayerInMatchFullData[]>;
  homeFootballOffense$: Observable<IPlayerInMatchFullData[]>;
  awayFootballOffense$: Observable<IPlayerInMatchFullData[]>;
  homeFootballDefense$: Observable<IPlayerInMatchFullData[]>;
  awayFootballDefense$: Observable<IPlayerInMatchFullData[]>;
  homeFootballStartOffense$: Observable<IPlayerInMatchFullData[]>;
  awayFootballStartOffense$: Observable<IPlayerInMatchFullData[]>;
  homeFootballStartDefense$: Observable<IPlayerInMatchFullData[]>;
  awayFootballStartDefense$: Observable<IPlayerInMatchFullData[]>;

  constructor(private store: Store<AppState>) {
    this.playerInMatchIsLoading$ = this.store.select(
      selectPlayerInMatchIsLoading,
    );
    this.currentPlayerInMatch$ = this.store.select(selectCurrentPlayerInMatch);
    this.allPlayersInMatch$ = this.store.select(selectAllPlayersInMatch);
    this.allPlayersFullDataInMatch$ = this.store.select(
      selectAllPlayersInMatchFullData,
    );
    this.homeRoster$ = this.store.select(selectHomeTeamRoster);
    this.awayRoster$ = this.store.select(selectAwayTeamRoster);
    this.homeFootballOffense$ = this.store.select(selectHomeFootballOffense);
    this.awayFootballOffense$ = this.store.select(selectAwayFootballOffense);
    this.homeFootballDefense$ = this.store.select(selectHomeFootballDefense);
    this.awayFootballDefense$ = this.store.select(selectAwayFootballDefense);
    this.homeFootballStartOffense$ = this.store.select(
      selectHomeFootballStartOffense,
    );
    this.awayFootballStartOffense$ = this.store.select(
      selectAwayFootballStartOffense,
    );
    this.homeFootballStartDefense$ = this.store.select(
      selectHomeFootballStartDefense,
    );
    this.awayFootballStartDefense$ = this.store.select(
      selectAwayFootballStartDefense,
    );
  }

  createPlayerInMatch(playerInMatch: IPlayerInMatch) {
    this.store.dispatch(
      playerInMatchActions.create({ request: playerInMatch }),
    );
  }

  loadAllPlayersInMatch() {
    this.store.dispatch(playerInMatchActions.getAllPlayersInMatch());
  }

  loadAllPlayersFullDataInMatch() {
    this.store.dispatch(
      playerInMatchActions.getAllPlayersWithFullDataInMatch(),
    );
  }

  deletePlayerInMatchWithId(id: number) {
    console.log('delete', id);

    this.store.dispatch(playerInMatchActions.deleteById({ id }));
  }
}
