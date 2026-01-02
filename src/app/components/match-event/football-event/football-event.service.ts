import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IFootballEvent } from '../../../type/football-event.type';
import { BaseApiService } from '../../../services/base.api.service';
import { ErrorHandlingService } from '../../../services/error.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FootballEventService extends BaseApiService<IFootballEvent> {
  private router = inject(Router);

  constructor() {
    const http = inject(HttpClient);
    const errorHandlingService = inject(ErrorHandlingService);

    super('football_event', http, errorHandlingService);
  }

  getFootballEventsByMatchId(matchId: number): Observable<IFootballEvent[]> {
    return this.findByFirstKeyValue('football_event', 'match_id', matchId).pipe(
      tap((data) => {
        // console.log(data);
      }),
    );
  }

  editFootballEventKeyValue(
    id: number | string,
    data: any,
  ): Observable<IFootballEvent> {
    // console.log(data);
    return this.editItemKeyValue(id, data).pipe(
      tap((data) => {
        // console.log(data);
      }),
    );
  }
}
