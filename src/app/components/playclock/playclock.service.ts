import { Injectable, inject } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { IMatchData } from '../../type/matchdata.type';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorHandlingService } from '../../services/error.service';
import { IPlayclock } from '../../type/playclock.type';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlayclockService extends BaseApiService<IPlayclock> {
  private router = inject(Router);

  constructor() {
    const http = inject(HttpClient);
    const errorHandlingService = inject(ErrorHandlingService);

    super('playclock', http, errorHandlingService);
  }

  getPlayclockByMatchId(matchId: number): Observable<IPlayclock> {
    return this.findByFirstKeyValue(
      'matches',
      'id',
      matchId,
      'playclock/',
    ).pipe(
      tap((data) => {
        // console.log(data);
      }),
    );
  }

  editPlayclock(id: number | string, data: IPlayclock): Observable<IPlayclock> {
    return this.editItem(id, data).pipe(
      tap((data) => {
        console.log(data);
      }),
    );
  }
}
