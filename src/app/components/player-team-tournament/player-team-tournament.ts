import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { playerInTeamTournamentActions } from './store/actions';
import { Observable } from 'rxjs';
import { AppState } from '../../store/appstate';
import {
  IPlayerInSport,
  IPlayerInTeamTournament,
  IPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from '../../type/player.type';
import {
  selectAllPlayersInTeamTournamentWithPersonsWithPositions,
  selectAvailablePlayersForTeamTournament,
  selectCurrentPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from './store/selectors';
import { selectAllPlayersInTournament } from './store/reducers';

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
  allPlayerInTournament$: Observable<IPlayerInTeamTournament[]>;
  allPlayersInTeamTournamentFullData$: Observable<
    IPlayerInTeamTournamentWithPersonWithSportWithPosition[]
  >;
  allAvailablePlayersToAddInTeamTournament$: Observable<IPlayerInSport[]>;

  constructor(private store: Store<AppState>) {
    this.currentPlayerInTeamTournament$ = store.select(
      (state) => state.playerInTeamTournament.currentPlayerInTeamTournament,
    );
    this.allPlayersInTeamTournament$ = store.select(
      (state) => state.playerInTeamTournament.allPlayersInTeamTournament,
    );
    this.allPlayerInTournament$ = store.select(selectAllPlayersInTournament);
    this.currentPlayerInTeamTournamentFullData$ = store.select(
      selectCurrentPlayerInTeamTournamentWithPersonWithSportWithPosition,
    );
    this.allPlayersInTeamTournamentFullData$ = store.select(
      selectAllPlayersInTeamTournamentWithPersonsWithPositions,
    );

    this.allAvailablePlayersToAddInTeamTournament$ = store.select(
      selectAvailablePlayersForTeamTournament,
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

  loadAllPlayersInTournament() {
    this.store.dispatch(
      playerInTeamTournamentActions.getAllPlayersInTournamentByTournamentId(),
    );
  }

  deletePlayerInTeamTournament() {
    this.store.dispatch(playerInTeamTournamentActions.delete());
  }

  deletePlayerInTeamTournamentWithId(id: number) {
    this.store.dispatch(playerInTeamTournamentActions.deleteById({ id }));
  }
}
