import { Injectable } from "@angular/core";
import { ISport } from "../type/sport";
import { BaseApiService } from "./base.api.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SportService extends BaseApiService<ISport> {
  constructor(http: HttpClient) {
    super('sports', http);
  }
}
