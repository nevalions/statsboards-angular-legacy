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
  selectAwayFootballStartBackfield,
  selectAwayFootballStartDB,
  selectAwayFootballStartDL,
  selectAwayFootballStartDefense,
  selectAwayFootballStartLB,
  selectAwayFootballStartOL,
  selectAwayFootballStartOffense,
  selectAwayFootballStartWR,
  selectAwayTeamRoster,
  selectHomeFootballDefense,
  selectHomeFootballOffense,
  selectHomeFootballStartBackfield,
  selectHomeFootballStartDB,
  selectHomeFootballStartDL,
  selectHomeFootballStartDefense,
  selectHomeFootballStartLB,
  selectHomeFootballStartOL,
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
  //rosters
  homeRoster$: Observable<IPlayerInMatchFullData[]>;
  awayRoster$: Observable<IPlayerInMatchFullData[]>;
  homeFootballOffense$: Observable<IPlayerInMatchFullData[]>;
  awayFootballOffense$: Observable<IPlayerInMatchFullData[]>;
  homeFootballDefense$: Observable<IPlayerInMatchFullData[]>;
  awayFootballDefense$: Observable<IPlayerInMatchFullData[]>;
  //starts
  homeFootballStartOffense$: Observable<IPlayerInMatchFullData[]>;
  awayFootballStartOffense$: Observable<IPlayerInMatchFullData[]>;
  homeFootballStartDefense$: Observable<IPlayerInMatchFullData[]>;
  awayFootballStartDefense$: Observable<IPlayerInMatchFullData[]>;
  //positions
  //offense
  homeFootballStartOL$: Observable<IPlayerInMatchFullData[]>;
  awayFootballStartOL$: Observable<IPlayerInMatchFullData[]>;
  homeFootballStartBacks$: Observable<IPlayerInMatchFullData[]>;
  awayFootballStartBacks$: Observable<IPlayerInMatchFullData[]>;
  homeFootballStartWR$: Observable<IPlayerInMatchFullData[]>;
  awayFootballStartWR$: Observable<IPlayerInMatchFullData[]>;
  //defense
  homeFootballStartDL$: Observable<IPlayerInMatchFullData[]>;
  awayFootballStartDL$: Observable<IPlayerInMatchFullData[]>;
  homeFootballStartLB$: Observable<IPlayerInMatchFullData[]>;
  awayFootballStartLB$: Observable<IPlayerInMatchFullData[]>;
  homeFootballStartDB$: Observable<IPlayerInMatchFullData[]>;
  awayFootballStartDB$: Observable<IPlayerInMatchFullData[]>;

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
    // start
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
    // start positions
    // offense
    this.homeFootballStartOL$ = this.store.select(selectHomeFootballStartOL);
    this.awayFootballStartOL$ = this.store.select(selectAwayFootballStartOL);
    this.homeFootballStartBacks$ = this.store.select(
      selectHomeFootballStartBackfield,
    );
    this.awayFootballStartBacks$ = this.store.select(
      selectAwayFootballStartBackfield,
    );
    this.homeFootballStartWR$ = this.store.select(selectHomeFootballStartOL);
    this.awayFootballStartWR$ = this.store.select(selectAwayFootballStartWR);
    // defense
    this.homeFootballStartDL$ = this.store.select(selectHomeFootballStartDL);
    this.awayFootballStartDL$ = this.store.select(selectAwayFootballStartDL);
    this.homeFootballStartLB$ = this.store.select(selectHomeFootballStartLB);
    this.awayFootballStartLB$ = this.store.select(selectAwayFootballStartLB);
    this.homeFootballStartDB$ = this.store.select(selectHomeFootballStartDB);
    this.awayFootballStartDB$ = this.store.select(selectAwayFootballStartDB);
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
