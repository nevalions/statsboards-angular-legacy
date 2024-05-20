import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IPlayerInMatch,
  IPlayerInMatchFullData,
  IPlayerInTeamTournament,
} from '../../type/player.type';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/appstate';
import {
  selectAllPlayersInMatch,
  selectAllPlayersInMatchFullData,
  selectCurrentPlayerInMatch,
  selectPlayerInMatchIsLoading,
} from './store/reducers';
import { playerInMatchActions } from './store/actions';

@Injectable({
  providedIn: 'root',
})
export class PlayerInMatch {
  playerInMatchIsLoading$: Observable<boolean>;
  currentPlayerInMatch$: Observable<IPlayerInMatch | null | undefined>;
  allPlayersInMatch$: Observable<IPlayerInMatch[]>;
  allPlayersFullDataInMatch$: Observable<IPlayerInMatchFullData[]>;

  constructor(private store: Store<AppState>) {
    this.playerInMatchIsLoading$ = this.store.select(
      selectPlayerInMatchIsLoading,
    );
    this.currentPlayerInMatch$ = this.store.select(selectCurrentPlayerInMatch);
    this.allPlayersInMatch$ = this.store.select(selectAllPlayersInMatch);
    this.allPlayersFullDataInMatch$ = this.store.select(
      selectAllPlayersInMatchFullData,
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
    this.store.dispatch(playerInMatchActions.deleteById({ id }));
  }
}
