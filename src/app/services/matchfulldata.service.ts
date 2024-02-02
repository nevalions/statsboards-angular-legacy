import { Injectable } from '@angular/core';
import { BaseApiService } from './base.api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorHandlingService } from './error.service';
import { IMatchFullData } from '../type/match.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MatchFullDataService extends BaseApiService<IMatchFullData> {
  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService,
  ) {
    super('matches', http, errorHandlingService);
  }
}
