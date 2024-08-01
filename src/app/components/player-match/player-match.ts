import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/appstate';
import {
  IPlayerInMatch,
  IPlayerInMatchFullData,
  IPlayerInMatchFullDataWithQbStats,
} from '../../type/player.type';
import { playerInMatchActions } from './store/actions';
import {
  selectAllPlayersInMatch,
  selectAllPlayersInMatchFullData,
  selectCurrentPlayerInMatch,
  selectPlayerInMatchIsLoading,
  selectSelectedPlayerInMatchLower,
} from './store/reducers';
import {
  selectAwayFootballDefense,
  selectAwayFootballOffense,
  selectAwayFootballStartBackfield,
  selectAwayFootballStartDB,
  selectAwayFootballStartDefense,
  selectAwayFootballStartDL,
  selectAwayFootballStartLB,
  selectAwayFootballStartOffense,
  selectAwayFootballStartOL,
  selectAwayFootballStartWR,
  selectAwayTeamRoster,
  selectHomeFootballDefense,
  selectHomeFootballOffense,
  selectHomeFootballStartBackfield,
  selectHomeFootballStartDB,
  selectHomeFootballStartDefense,
  selectHomeFootballStartDL,
  selectHomeFootballStartLB,
  selectHomeFootballStartOffense,
  selectHomeFootballStartOL,
  selectHomeFootballStartWR,
  selectHomeTeamRoster,
} from './store/selectors';
import { selectLowerSelectedFootballQbStats } from '../match-event/football-event/store/football-stats-qb-match-selector';

@Injectable({
  providedIn: 'root',
})
export class PlayerInMatch {
  playerInMatchIsLoading$: Observable<boolean>;
  currentPlayerInMatch$: Observable<IPlayerInMatch | null | undefined>;
  allPlayersInMatch$: Observable<IPlayerInMatch[]>;
  allPlayersFullDataInMatch$: Observable<IPlayerInMatchFullData[]>;
  // selectedPlayerInMatchId$: Observable<number | null | undefined>;
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

  selectSelectedPlayerInMatchLower$: Observable<
    IPlayerInMatchFullData | null | undefined
  >;

  selectSelectedFootballQbFullStatsInMatchLower$: Observable<
    IPlayerInMatchFullDataWithQbStats | null | undefined
  >;

  // selectLowerSelectedFootballQbStatsTeamA$: Observable<IPlayerInMatchFullDataWithQbStats> | null | undefined;

  constructor(private store: Store<AppState>) {
    this.playerInMatchIsLoading$ = this.store.select(
      selectPlayerInMatchIsLoading,
    );
    this.currentPlayerInMatch$ = this.store.select(selectCurrentPlayerInMatch);
    this.allPlayersInMatch$ = this.store.select(selectAllPlayersInMatch);
    this.allPlayersFullDataInMatch$ = this.store.select(
      selectAllPlayersInMatchFullData,
    );
    // this.selectedPlayerInMatchId$ = this.store.select(
    //   selectSelectedPlayerInMatchId,
    // );

    // rosters
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
    this.homeFootballStartWR$ = this.store.select(selectHomeFootballStartWR);
    this.awayFootballStartWR$ = this.store.select(selectAwayFootballStartWR);
    // defense
    this.homeFootballStartDL$ = this.store.select(selectHomeFootballStartDL);
    this.awayFootballStartDL$ = this.store.select(selectAwayFootballStartDL);
    this.homeFootballStartLB$ = this.store.select(selectHomeFootballStartLB);
    this.awayFootballStartLB$ = this.store.select(selectAwayFootballStartLB);
    this.homeFootballStartDB$ = this.store.select(selectHomeFootballStartDB);
    this.awayFootballStartDB$ = this.store.select(selectAwayFootballStartDB);

    // lower
    this.selectSelectedFootballQbFullStatsInMatchLower$ = this.store.select(
      selectLowerSelectedFootballQbStats,
    );
    this.selectSelectedPlayerInMatchLower$ = this.store.select(
      selectSelectedPlayerInMatchLower,
    );
  }

  createPlayerInMatch(playerInMatch: IPlayerInMatch) {
    this.store.dispatch(
      playerInMatchActions.create({ request: playerInMatch }),
    );
  }

  updatePlayerInMatch(playerInMatch: IPlayerInMatch) {
    this.store.dispatch(
      playerInMatchActions.update({
        id: playerInMatch.id!,
        newPlayerInMatchData: playerInMatch,
      }),
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
    // console.log('delete', id);
    this.store.dispatch(playerInMatchActions.deleteById({ id }));
  }

  setPlayerIdSelect(playerId: number): void {
    if (playerId) {
      this.store.dispatch(
        playerInMatchActions.setSelectedPlayerId({ id: playerId }),
      );
    } else {
      console.error('No player id');
    }
  }

  setQbFullStatsId(playerId: number): void {
    if (playerId) {
      this.store.dispatch(
        playerInMatchActions.setSelectedFootballQbId({ id: playerId }),
      );
    } else {
      console.error('No Qb id');
    }
  }

  onQbFullStatsLowerSelect(qb: IPlayerInMatchFullDataWithQbStats): void {
    this.store.dispatch(
      playerInMatchActions.setSelectedFootballQbLower({ qb }),
    );
  }

  getQbFullStatsLowerSelect(qbInMatchId: number): void {
    // console.log('qbInMatchId', qbInMatchId);
    this.store.dispatch(
      playerInMatchActions.getSelectedFootballQbLowerById({ qbInMatchId }),
    );
  }

  onPlayerLowerSelect(player: IPlayerInMatchFullData): void {
    this.store.dispatch(
      playerInMatchActions.setSelectedPlayerLower({ player }),
    );
  }

  getPlayerLowerSelect(playerInMatchId: number): void {
    this.store.dispatch(
      playerInMatchActions.getSelectedPlayerLowerById({ playerInMatchId }),
    );
  }

  parsPlayersFromEESL() {
    this.store.dispatch(playerInMatchActions.parsPlayersFromMatchEESL());
  }
}
