import { Injectable } from "@angular/core";
import { ISeason } from "../type/season.type";
import { BaseApiService } from "./base.api.service";
import {HttpClient} from "@angular/common/http";
import {ErrorHandlingService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class SeasonService extends BaseApiService<ISeason> {
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
}
