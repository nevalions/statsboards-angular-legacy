import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { playerInTeamTournamentActions } from './store/actions';
import { Observable } from 'rxjs';
import { AppState } from '../../store/appstate';
import {
  IPlayerInTeamTournament,
  IPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from '../../type/player.type';
import {
  selectAllPlayersInTeamTournamentWithPersonsWithPositions,
  selectCurrentPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from './store/selectors';

@Injectable({
  providedIn: 'root',
})
export class PlayerInTeamTournament {
  currentPlayerInTeamTournament$: Observable<
    IPlayerInTeamTournament | null | undefined
  >;
  currentPlayerInTeamTournamentFullData$: Observable<
    IPlayerInTeamTournamentWithPersonWithSportWithPosition | null | undefined
  >;
  allPlayersInTeamTournament$: Observable<IPlayerInTeamTournament[]>;
  allPlayersInTeamTournamentFullData$: Observable<
    IPlayerInTeamTournamentWithPersonWithSportWithPosition[]
  >;

  constructor(private store: Store<AppState>) {
    this.currentPlayerInTeamTournament$ = store.select(
      (state) => state.playerInTeamTournament.currentPlayerInTeamTournament,
    );
    this.allPlayersInTeamTournament$ = store.select(
      (state) => state.playerInTeamTournament.allPlayersInTeamTournament,
    );
    this.currentPlayerInTeamTournamentFullData$ = store.select(
      selectCurrentPlayerInTeamTournamentWithPersonWithSportWithPosition,
    );
    this.allPlayersInTeamTournamentFullData$ = store.select(
      selectAllPlayersInTeamTournamentWithPersonsWithPositions,
    );
  }

  createPlayerInTeamTournament(
    playerInTeamTournament: IPlayerInTeamTournament,
  ) {
    this.store.dispatch(
      playerInTeamTournamentActions.create({ request: playerInTeamTournament }),
    );
  }

  updatePlayerInTeamTournament(
    playerInTeamTournament: IPlayerInTeamTournament,
  ) {
    this.store.dispatch(
      playerInTeamTournamentActions.update({
        id: playerInTeamTournament.id!,
        newPlayerInTeamTournamentData: playerInTeamTournament,
      }),
    );
  }

  loadCurrentPlayerInTeamTournament() {
    this.store.dispatch(playerInTeamTournamentActions.getId());
  }

  loadAllPlayersInTeamTournament() {
    this.store.dispatch(
      playerInTeamTournamentActions.getAllPlayerInTeamTournamentsByTeamIdTournamentId(),
    );
  }

  deletePlayerInTeamTournament() {
    this.store.dispatch(playerInTeamTournamentActions.delete());
  }

  deletePlayerInTeamTournamentWithId(id: number) {
    this.store.dispatch(playerInTeamTournamentActions.deleteById({ id }));
  }
}
