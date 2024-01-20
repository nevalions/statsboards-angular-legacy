import {Injectable} from "@angular/core";
import { BaseApiService } from "./base.api.service";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {ErrorHandlingService} from "./error.service";
import {ITeam} from "../type/team.type";

@Injectable({
  providedIn: 'root'
})
export class TeamService extends BaseApiService<ITeam> {
  itemSig: Subject<ITeam> = new Subject<ITeam>();
  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService
  ) {
    super(
      'teams',
      http,
      errorHandlingService
      );
  }
}
