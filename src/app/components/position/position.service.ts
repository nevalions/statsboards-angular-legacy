import { Injectable } from '@angular/core';

import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../services/error.service';
import { IPosition } from '../../type/position.type';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PositionService extends BaseApiService<IPosition> {
  constructor(http: HttpClient, errorHandlingService: ErrorHandlingService) {
    super('positions', http, errorHandlingService);
  }

  findPositionsBySportId(id: number): Observable<IPosition[]> {
    return this.findByFirstKeyValue('sports', 'id', id, 'positions')
      .pipe
      // tap((teams) => console.log(`POSITIONS from SPORT ID: ${id}`, teams)),
      ();
  }
}
