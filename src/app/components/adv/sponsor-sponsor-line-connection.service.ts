import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseApiService } from '../../services/base.api.service';
import { ErrorHandlingService } from '../../services/error.service';
import { SortService } from '../../services/sort.service';
import {
  ISponsorLineConnection,
  ISponsorLineFullData,
} from '../../type/sponsor.type';

@Injectable({
  providedIn: 'root',
})
export class SponsorSponsorLineConnectionService extends BaseApiService<ISponsorLineConnection> {
  constructor(http: HttpClient, errorHandlingService: ErrorHandlingService) {
    super('sponsor_in_sponsor_line', http, errorHandlingService);
  }

  fetchSponsorLineFullDataByLineId(
    id: number,
  ): Observable<ISponsorLineFullData> {
    return this.http
      .get<ISponsorLineFullData>(
        `sponsor_in_sponsor_line/sponsor_line/id/${id}/sponsors`,
      )
      .pipe(
        // tap((data) => console.log(`SPONSORS from LINE ID: ${id}`, data)),
        map((data: ISponsorLineFullData) => {
          data.sponsors = SortService.sort(data.sponsors, 'position');
          return data;
        }),
      );
  }

  findMatchSponsorMatchFullData(
    matchId: number,
  ): Observable<ISponsorLineFullData> {
    return this.findByFirstKeyValue(
      'matches',
      'id',
      matchId,
      'sponsor_line',
    ).pipe();
  }
}
