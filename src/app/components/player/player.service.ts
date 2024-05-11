import { Injectable } from '@angular/core';

import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../services/error.service';
import { IPlayer } from '../../type/player.type';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlayerService extends BaseApiService<IPlayer> {
  constructor(http: HttpClient, errorHandlingService: ErrorHandlingService) {
    super('players', http, errorHandlingService);
  }

  findPlayersBySportId(id: number): Observable<IPlayer[]> {
    return this.findByFirstKeyValue('sports', 'id', id, 'players')
      .pipe
      // tap((teams) => console.log(`PLAYERS from SPORT ID: ${id}`, teams)),
      ();
  }
}
