import { Injectable } from '@angular/core';

import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../services/error.service';
import { IPerson } from '../../type/person.type';

@Injectable({
  providedIn: 'root',
})
export class PersonService extends BaseApiService<IPerson> {
  constructor(http: HttpClient, errorHandlingService: ErrorHandlingService) {
    super('persons', http, errorHandlingService);
  }
}
