import { Injectable } from '@angular/core';

import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../services/error.service';
import { IPosition } from '../../type/position.type';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IPlayerInTeamTournament } from '../../type/player.type';

@Injectable({
  providedIn: 'root',
})
export class PlayerTeamTournamentService extends BaseApiService<IPlayerInTeamTournament> {
  constructor(http: HttpClient, errorHandlingService: ErrorHandlingService) {
    super('positions', http, errorHandlingService);
  }

  // findIPlayersInTeamTournamentByTeamIdTournament(id: number): Observable<IPosition[]> {
  //   return this.findByFirstKeyValue('sports', 'id', id, 'positions').pipe(
  //     tap((teams) => console.log(`PLAYERS from SPORT ID: ${id}`, teams)),
  //   );
  // }

  findIPlayersInTeamTournamentByTeamIdTournament(
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
    ).pipe(
      tap((players) => console.log(`PLAYERS from TEAM ID: ${teamId}`, players)),
    );
  }
}
