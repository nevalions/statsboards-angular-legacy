import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseApiService } from '../../services/base.api.service';
import { ErrorHandlingService } from '../../services/error.service';
import { IPlayclock } from '../../type/playclock.type';

@Injectable({
  providedIn: 'root',
})
export class GameClockService extends BaseApiService<IPlayclock> {
  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService,
  ) {
    super('gameclock', http, errorHandlingService);
  }

  getGameclockByMatchId(matchId: number): Observable<IPlayclock> {
    return this.findByFirstKeyValue(
      'matches',
      'id',
      matchId,
      'gameclock/',
    ).pipe(
      tap((data) => {
        // console.log(data);
      }),
    );
  }

  editGameclock(id: number | string, data: IPlayclock): Observable<IPlayclock> {
    return this.editItem(id, data).pipe(
      tap((data) => {
        console.log(data);
      }),
    );
  }
}
