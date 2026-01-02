import { Injectable, inject } from '@angular/core';
import { ISeason } from '../../type/season.type';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../services/error.service';
import { Params } from '@angular/router';
import { BehaviorSubject, map, Observable, of, shareReplay } from 'rxjs';
import { IBaseIdElse } from '../../type/base.type';
import { SortService } from '../../services/sort.service';
import { combineLatest } from 'rxjs/internal/operators/combineLatest';
import { ITournament } from '../../type/tournament.type';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SeasonService extends BaseApiService<ISeason> {
  private seasonsSubject = new BehaviorSubject<ISeason[]>([]);
  public seasons$ = this.seasonsSubject.asObservable();

  private seasonSubject = new BehaviorSubject<ISeason>({} as ISeason);
  public season$ = this.seasonSubject.asObservable();

  constructor() {
    const http = inject(HttpClient);
    const errorHandlingService = inject(ErrorHandlingService);

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

  getSeasonByYearReturn(year: number) {
    return this.findByFirstKeyValue('seasons', 'year', year).pipe(
      tap((season: ISeason) => {
        console.log(`SEASON BY ${year}`, season);
        this.seasonSubject.next(season);
      }),
    );
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
