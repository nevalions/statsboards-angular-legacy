import {Injectable} from "@angular/core";
import { BaseApiService } from "./base.api.service";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {ErrorHandlingService} from "./error.service";
import {ITournament} from "../type/tournament.type";
import {IMatch} from "../type/match.type";

@Injectable({
  providedIn: 'root'
})
export class MatchService extends BaseApiService<IMatch> {
  itemSig: Subject<IMatch> = new Subject<IMatch>();
  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService
  ) {
    super(
      'matches',
      http,
      errorHandlingService
    );
  }
}
