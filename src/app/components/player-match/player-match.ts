import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPlayerInMatch } from '../../type/player.type';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/appstate';
import {
  selectAllPlayersInMatch,
  selectCurrentPlayerInMatch,
  selectPlayerInMatchIsLoading,
} from './store/reducers';

@Injectable({
  providedIn: 'root',
})
export class PlayerInMatch {
  playerInMatchIsLoading$: Observable<boolean>;
  currentPlayerInMatch$: Observable<IPlayerInMatch | null | undefined>;
  allPlayersInMatch$: Observable<IPlayerInMatch[]>;

  constructor(private store: Store<AppState>) {
    this.playerInMatchIsLoading$ = this.store.select(
      selectPlayerInMatchIsLoading,
    );
    this.currentPlayerInMatch$ = this.store.select(selectCurrentPlayerInMatch);
    this.allPlayersInMatch$ = this.store.select(selectAllPlayersInMatch);
  }
}
