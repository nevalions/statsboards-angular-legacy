import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/appstate';
import {
  IPlayerInSport,
  IPlayerInTeamTournament,
  IPlayerInTeamTournamentFullData,
  IPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from '../../type/player.type';
import {
  selectAvailableAwayPlayers,
  selectAvailableHomePlayers,
} from '../player-match/store/selectors';
import { playerInTeamTournamentActions } from './store/actions';
import {
  selectAllAwayPlayersInTeamTournamentWithPerson,
  selectAllHomePlayersInTeamTournamentWithPerson,
  selectAllPlayersInTournament,
} from './store/reducers';
import {
  selectAllPlayersInTeamTournamentWithPersonsWithPositions,
  selectAllPlayersInTournamentWithPersonsWithPositions,
  selectAvailablePlayersForTournament,
  selectAvailableSportPlayersForTeamTournament,
  selectAvailableTournamentPlayersForTeamTournament,
  selectCurrentPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from './store/selectors';

@Injectable({
  providedIn: 'root',
})
export class PlayerInTeamTournament {
  private store = inject<Store<AppState>>(Store);

  playerInTeamTournamentIsLoading$: Observable<boolean>;
  currentPlayerInTeamTournament$: Observable<
    IPlayerInTeamTournament | null | undefined
  >;
  currentPlayerInTeamTournamentFullData$: Observable<
    IPlayerInTeamTournamentWithPersonWithSportWithPosition | null | undefined
  >;
  allPlayersInTeamTournament$: Observable<IPlayerInTeamTournament[]>;
  allPlayerInTournament$: Observable<IPlayerInTeamTournament[]>;
  allPlayerInTournamentFullData$: Observable<
    IPlayerInTeamTournamentWithPersonWithSportWithPosition[]
  >;
  allPlayersInTeamTournamentFullData$: Observable<
    IPlayerInTeamTournamentWithPersonWithSportWithPosition[]
  >;

  allHomePlayersInTeamTournamentWithPerson$: Observable<
    IPlayerInTeamTournamentFullData[]
  >;
  allAwayPlayersInTeamTournamentWithPerson$: Observable<
    IPlayerInTeamTournamentFullData[]
  >;

  allAvailablePlayersToAddInTournament$: Observable<IPlayerInSport[]>;
  allAvailableSportPlayersToAddInTeamTournament$: Observable<IPlayerInSport[]>;
  allAvailableTournamentPlayersForTeamTournament$: Observable<
    IPlayerInTeamTournamentWithPersonWithSportWithPosition[]
  >;

  availableMatchHomePlayers$: Observable<IPlayerInTeamTournamentFullData[]>;
  availableMatchAwayPlayers$: Observable<IPlayerInTeamTournamentFullData[]>;

  constructor() {
    const store = this.store;

    this.playerInTeamTournamentIsLoading$ = this.store.select(
      (state) => state.playerInTeamTournament.playerInTeamTournamentIsLoading,
    );
    this.currentPlayerInTeamTournament$ = store.select(
      (state) => state.playerInTeamTournament.currentPlayerInTeamTournament,
    );
    this.allPlayersInTeamTournament$ = store.select(
      (state) => state.playerInTeamTournament.allPlayersInTeamTournament,
    );
    this.allPlayerInTournament$ = store.select(selectAllPlayersInTournament);
    this.allPlayerInTournamentFullData$ = store.select(
      selectAllPlayersInTournamentWithPersonsWithPositions,
    );
    this.currentPlayerInTeamTournamentFullData$ = store.select(
      selectCurrentPlayerInTeamTournamentWithPersonWithSportWithPosition,
    );
    this.allPlayersInTeamTournamentFullData$ = store.select(
      selectAllPlayersInTeamTournamentWithPersonsWithPositions,
    );

    this.allHomePlayersInTeamTournamentWithPerson$ = store.select(
      selectAllHomePlayersInTeamTournamentWithPerson,
    );
    this.allAwayPlayersInTeamTournamentWithPerson$ = store.select(
      selectAllAwayPlayersInTeamTournamentWithPerson,
    );

    this.allAvailableSportPlayersToAddInTeamTournament$ = store.select(
      selectAvailableSportPlayersForTeamTournament,
    );
    this.allAvailablePlayersToAddInTournament$ = store.select(
      selectAvailablePlayersForTournament,
    );
    this.allAvailableTournamentPlayersForTeamTournament$ = store.select(
      selectAvailableTournamentPlayersForTeamTournament,
    );
    this.availableMatchHomePlayers$ = store.select(selectAvailableHomePlayers);
    this.availableMatchAwayPlayers$ = store.select(selectAvailableAwayPlayers);
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

  addPlayerToTeam(playerId: number, player: IPlayerInTeamTournament) {
    this.store.dispatch(
      playerInTeamTournamentActions.addPlayerToTeam({ playerId, player }),
    );
  }

  removePlayerFromTeam(playerId: number) {
    this.store.dispatch(
      playerInTeamTournamentActions.removePlayerFromTeam({ playerId }),
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

  loadAllPlayersInTeamTournamentProps(teamId: number, tournamentId: number) {
    this.store.dispatch(
      playerInTeamTournamentActions.getAllPlayerInTeamTournamentsWithPersonProps(
        { teamId, tournamentId },
      ),
    );
  }

  loadAllPlayersForMatch() {
    this.store.dispatch(
      playerInTeamTournamentActions.getAllPlayersInTeamTournamentsForMatch(),
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

  parsPlayersFromEESL() {
    this.store.dispatch(
      playerInTeamTournamentActions.parsPlayersFromTeamEESL(),
    );
  }
}
