import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { playerActions } from './store/actions';
import { Observable } from 'rxjs';
import { IPlayer, IPlayerInSport } from '../../type/player.type';
import { AppState } from '../../store/appstate';
import {
  selectCurrentPlayerWithPerson,
  selectAllPlayersWithPersons,
  selectAllSportPlayersWithPersons,
} from './store/selectors';
import { selectAllPlayers } from './store/reducers';

@Injectable({
  providedIn: 'root',
})
export class Player {
  private store = inject<Store<AppState>>(Store);

  currentPlayer$: Observable<IPlayer | null | undefined>;
  currentPlayerWithPerson$: Observable<IPlayerInSport | null | undefined>;
  allPlayers$: Observable<IPlayer[]>;
  allSportPlayers$: Observable<IPlayer[]>;
  allPlayersWithPerson$: Observable<IPlayerInSport[]>;
  allSportPlayersWithPerson$: Observable<IPlayerInSport[]>;

  constructor() {
    const store = this.store;

    this.currentPlayer$ = store.select((state) => state.player.currentPlayer);
    this.currentPlayerWithPerson$ = store.select(selectCurrentPlayerWithPerson);
    this.allPlayers$ = store.select(selectAllPlayers);
    this.allPlayersWithPerson$ = store.select(selectAllPlayersWithPersons);
    this.allSportPlayers$ = store.select(
      (state) => state.player.allSportPlayers,
    );
    this.allSportPlayersWithPerson$ = store.select(
      selectAllSportPlayersWithPersons,
    );
  }

  createPlayer(player: IPlayer) {
    this.store.dispatch(playerActions.create({ request: player }));
  }

  updatePlayer(player: IPlayer) {
    this.store.dispatch(
      playerActions.update({ id: player.id!, newPlayerData: player }),
    );
  }

  loadCurrentPlayer() {
    this.store.dispatch(playerActions.getId());
  }

  loadAllPlayers() {
    this.store.dispatch(playerActions.getAll());
  }

  loadAllPlayersBySportId() {
    this.store.dispatch(playerActions.getAllPlayersBySportId());
  }

  deletePlayer() {
    this.store.dispatch(playerActions.delete());
  }
}
