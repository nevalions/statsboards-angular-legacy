import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseApiService } from '../../services/base.api.service';
import { ErrorHandlingService } from '../../services/error.service';
import { IPlayerInTeamTournamentFullData } from '../../type/player.type';

@Injectable({
  providedIn: 'root',
})
export class PlayerFullDataService extends BaseApiService<IPlayerInTeamTournamentFullData> {
  constructor(http: HttpClient, errorHandlingService: ErrorHandlingService) {
    super('players_team_tournament', http, errorHandlingService);
  }

  findPlayersInTeamTournamentByTeamIdTournamentWithPerson(
    teamId: number,
    tournamentId: number,
  ): Observable<IPlayerInTeamTournamentFullData[]> {
    return this.findByFirstItemKeyValueAndSecondItemSecondKeyValue(
      'teams',
      'id',
      teamId,
      'tournament',
      'id',
      tournamentId,
      'players_with_persons',
    ).pipe(
      tap((players) =>
        console.log(`PLAYERS FOR MATCH from TEAM ID: ${teamId}`, players),
      ),
    );
  }
}
