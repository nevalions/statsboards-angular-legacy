import { Injectable } from '@angular/core';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../services/error.service';
import { ISponsor } from '../../type/sponsor.type';

@Injectable({
  providedIn: 'root',
})
export class SponsorService extends BaseApiService<ISponsor> {
  constructor(http: HttpClient, errorHandlingService: ErrorHandlingService) {
    super('sponsors', http, errorHandlingService);
  }
}
