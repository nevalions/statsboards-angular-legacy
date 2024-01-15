import { Injectable } from "@angular/core";
import { ISeason } from "../type/season";
import { BaseApiService } from "./base.api.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SeasonService extends BaseApiService<ISeason> {
  constructor(http: HttpClient) {
    super('seasons', http);
  }
}
