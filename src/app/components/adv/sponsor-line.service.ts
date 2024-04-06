import { Injectable } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../services/error.service';
import { ISponsor, ISponsorLine } from '../../type/sponsor.type';

@Injectable({
  providedIn: 'root',
})
export class SponsorLineService extends BaseApiService<ISponsorLine> {
  constructor(http: HttpClient, errorHandlingService: ErrorHandlingService) {
    super('sponsor_lines', http, errorHandlingService);
  }
}
