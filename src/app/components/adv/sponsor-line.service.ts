import { Injectable, inject } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../services/error.service';
import { ISponsor, ISponsorLine } from '../../type/sponsor.type';

@Injectable({
  providedIn: 'root',
})
export class SponsorLineService extends BaseApiService<ISponsorLine> {
  constructor() {
    const http = inject(HttpClient);
    const errorHandlingService = inject(ErrorHandlingService);

    super('sponsor_lines', http, errorHandlingService);
  }
}
