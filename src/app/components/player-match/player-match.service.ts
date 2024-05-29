import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseApiService } from '../../services/base.api.service';
import { ErrorHandlingService } from '../../services/error.service';
import { SortService } from '../../services/sort.service';
import { IPlayerInMatch, IPlayerInMatchFullData } from '../../type/player.type';

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
      // tap((players) => console.log(`PLAYERS from MATCH ID: ${id}`, players)),
      ();
  }

  findCurrentPlayerInMatchFullData(
    id: number,
  ): Observable<IPlayerInMatchFullData> {
    return this.findByFirstKeyValue('players_match', 'id', id, 'full_data')
      .pipe
      // tap((players) => console.log(`PLAYERS from MATCH ID: ${id}`, players)),
      ();
  }

  ///players_match/id/1/full_data/

  findPlayersFullDataByMatchId(
    id: number,
  ): Observable<IPlayerInMatchFullData[]> {
    return this.findByFirstKeyValue(
      'matches',
      'id',
      id,
      'players_fulldata',
    ).pipe(
      tap((matches) =>
        console.log(`PLAYERS fulldata from MATCH ID: ${id}`, matches),
      ),
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
  parsPlayersFromMatchEESL(
    matchEESLId: number,
  ): Observable<IPlayerInMatchFullData[]> {
    return this.parsByFirstKeyValue(
      'players_match/pars_and_create',
      'match',
      matchEESLId,
    ).pipe(
      tap((players) =>
        console.log(`PLAYERS from MATCH EESL ID: ${matchEESLId}`, players),
      ),
    );
  }
}
