import { Injectable } from '@angular/core';
import { ISeason } from '../type/season.type';
import { BaseApiService } from './base.api.service';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from './error.service';
import { Params } from '@angular/router';
import { BehaviorSubject, map, Observable, of, shareReplay } from 'rxjs';
import { IBaseIdElse } from '../type/base.type';
import { SortService } from './sort.service';
import { combineLatest } from 'rxjs/internal/operators/combineLatest';
import { ITournament } from '../type/tournament.type';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SeasonService extends BaseApiService<ISeason> {
  private seasonsSubject = new BehaviorSubject<ISeason[]>([]);
  public seasons$ = this.seasonsSubject.asObservable();

  private seasonSubject = new BehaviorSubject<ISeason>({} as ISeason);
  public season$ = this.seasonSubject.asObservable();

  constructor(http: HttpClient, errorHandlingService: ErrorHandlingService) {
    super('seasons', http, errorHandlingService);
  }

  getSeasonByYear(year: number): void {
    this.findByFirstKeyValue('seasons', 'year', year)
      .pipe(
        tap((season: ISeason) => {
          console.log(`SEASON BY ${year}`, season);
          this.seasonSubject.next(season);
        }),
      )
      .subscribe();
  }

  getSeasonsWithSportId(sport_id: number): Observable<ISeason[]> {
    return this.findAll().pipe(
      map((data) =>
        SortService.sort(data, '-year').map((season) => ({
          ...season,
          sport_id: sport_id,
        })),
      ),
    );
  }
}
