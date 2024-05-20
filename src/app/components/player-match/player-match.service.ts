import { Injectable } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../services/error.service';
import { map, Observable } from 'rxjs';
import {
  IPlayer,
  IPlayerInMatch,
  IPlayerInMatchFullData,
} from '../../type/player.type';
import { tap } from 'rxjs/operators';
import { SortService } from '../../services/sort.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerMatchService extends BaseApiService<IPlayerInMatch> {
  constructor(http: HttpClient, errorHandlingService: ErrorHandlingService) {
    super('players_match', http, errorHandlingService);
  }

  findPlayersInMatchByMatchId(id: number): Observable<IPlayerInMatch[]> {
    return this.findByFirstKeyValue('matches', 'id', id, 'players')
      .pipe
      // tap((players) =>
      //   console.log(`PLAYERS from MATCH ID: ${id}`, players),
      // ),
      ();
  }

  findPlayersFullDataByMatchId(
    id: number,
  ): Observable<IPlayerInMatchFullData[]> {
    return this.findByFirstKeyValue(
      'matches',
      'id',
      id,
      'players_fulldata',
    ).pipe(
      tap((matches) => console.log(`PLAYERS from MATCH ID: ${id}`, matches)),
      map((data) => SortService.sort(data, 'match_player.match_number')),
    );
  }

  findPlayerInMatchFullData(
    playerId: number,
  ): Observable<IPlayerInMatchFullData> {
    return this.findByFirstKeyValue(
      'players_match',
      'id',
      playerId,
      'full_data',
    )
      .pipe
      // tap((players) =>
      //   console.log(`PLAYERS from MATCH ID: ${id}`, players),
      // ),
      ();
  }

  //
  // findPlayersInMatchByTeamIdMatch(
  //   teamId: number,
  //   tournamentId: number,
  // ): Observable<IPlayerInMatch[]> {
  //   return this.findByFirstItemKeyValueAndSecondItemSecondKeyValue(
  //     'teams',
  //     'id',
  //     teamId,
  //     'tournament',
  //     'id',
  //     tournamentId,
  //     'players',
  //   )
  //     .pipe
  //     // tap((players) => console.log(`PLAYERS from TEAM ID: ${teamId}`, players)),
  //     ();
  // }
  //
  // parsPlayersFromTeamEESL(
  //   teamId: number,
  //   tournamentId: number,
  // ): Observable<IPlayerInMatch[]> {
  //   return this.parsByFirstItemKeyValueAndSecondItemSecondKeyValue(
  //     'players_match/pars_and_create',
  //     'tournament',
  //     tournamentId,
  //     'team',
  //     'id',
  //     teamId,
  //     'players',
  //   )
  //     .pipe
  //     // tap((players) => console.log(`PLAYERS from TEAM ID: ${teamId}`, players)),
  //     ();
  // }
}
