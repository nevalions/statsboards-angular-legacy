import { Injectable, inject } from '@angular/core';

import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../services/error.service';
import { IPerson } from '../../type/person.type';

@Injectable({
  providedIn: 'root',
})
export class PersonService extends BaseApiService<IPerson> {
  constructor() {
    const http = inject(HttpClient);
    const errorHandlingService = inject(ErrorHandlingService);

    super('persons', http, errorHandlingService);
  }
}
