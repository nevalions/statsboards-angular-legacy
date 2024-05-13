import { Injectable } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../services/error.service';
import { Observable } from 'rxjs';
import { IPlayerInTeamTournament } from '../../type/player.type';

@Injectable({
  providedIn: 'root',
})
export class PlayerTeamTournamentService extends BaseApiService<IPlayerInTeamTournament> {
  constructor(http: HttpClient, errorHandlingService: ErrorHandlingService) {
    super('players_team_tournament', http, errorHandlingService);
  }

  findPlayersInTournamentByTournamentId(
    id: number,
  ): Observable<IPlayerInTeamTournament[]> {
    return this.findByFirstKeyValue('tournaments', 'id', id, 'players')
      .pipe
      // tap((players) =>
      //   console.log(`PLAYERS from TOURNAMENT ID: ${id}`, players),
      // ),
      ();
  }

  findPlayersInTeamTournamentByTeamIdTournament(
    teamId: number,
    tournamentId: number,
  ): Observable<IPlayerInTeamTournament[]> {
    return this.findByFirstItemKeyValueAndSecondItemSecondKeyValue(
      'teams',
      'id',
      teamId,
      'tournament',
      'id',
      tournamentId,
      'players',
    )
      .pipe
      // tap((players) => console.log(`PLAYERS from TEAM ID: ${teamId}`, players)),
      ();
  }

  parsPlayersFromTeamEESL(
    teamId: number,
    tournamentId: number,
  ): Observable<IPlayerInTeamTournament[]> {
    return this.parsByFirstItemKeyValueAndSecondItemSecondKeyValue(
      'players_team_tournament/pars_and_create',
      'tournament',
      tournamentId,
      'team',
      'id',
      teamId,
      'players',
    )
      .pipe
      // tap((players) => console.log(`PLAYERS from TEAM ID: ${teamId}`, players)),
      ();
  }
}
