import { Injectable } from "@angular/core";
import { ISeason } from "../type/season.type";
import { BaseApiService } from "./base.api.service";
import {HttpClient} from "@angular/common/http";
import {ErrorHandlingService} from "./error.service";
import {Params} from "@angular/router";
import {map, Observable, of, shareReplay} from "rxjs";
import {IBaseIdElse} from "../type/base.type";
import {SortService} from "./sort.service";
import {combineLatest} from "rxjs/internal/operators/combineLatest";

@Injectable({
  providedIn: 'root'
})
export class SeasonService extends BaseApiService<ISeason> {
  allSeasons$: Observable<ISeason[]> = this.findAll()
  allSeasonsWithSportId$: Observable<IBaseIdElse[]> = of([])

  constructor(
    http: HttpClient,
    errorHandlingService: ErrorHandlingService
  ) {
    super(
      'seasons',
      http,
      errorHandlingService
    );
  }

  getSeasonsWithSportId(sport_id: number) {
    return this.allSeasons$.pipe(
      map(
        data => SortService.sort(data, '-year'
        )
        .map(
          season => ({
            ...season, sport_id: sport_id
          })
        )
      )
    )
  }
}
