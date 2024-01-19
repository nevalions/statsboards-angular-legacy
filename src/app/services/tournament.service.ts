import {Injectable} from "@angular/core";
import { BaseApiService } from "./base.api.service";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {ErrorHandlingService} from "./error.service";
import {ITournament} from "../type/tournament.type";

@Injectable({
  providedIn: 'root'
})
export class TournamentService extends BaseApiService<ITournament> {
  itemSig: Subject<ITournament> = new Subject<ITournament>();
  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService
  ) {
    super(
      'tournaments',
      http,
      errorHandlingService
    );
  }
}
