import { Injectable } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../services/error.service';
import {
  ISponsor,
  ISponsorLine,
  ISponsorLineConnection,
  ISponsorLineFullData,
} from '../../type/sponsor.type';
import { map, Observable } from 'rxjs';
import { ITeam } from '../../type/team.type';
import { tap } from 'rxjs/operators';
import { SortService } from '../../services/sort.service';

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
        tap((data) => console.log(`SPONSORS from LINE ID: ${id}`, data)),
        map((data: ISponsorLineFullData) => {
          data.sponsors = SortService.sort(data.sponsors, 'position');
          return data;
        }),
      );
  }
}
