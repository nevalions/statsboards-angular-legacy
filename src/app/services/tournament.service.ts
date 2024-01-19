import {Injectable} from "@angular/core";
import { BaseApiService } from "./base.api.service";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {ErrorHandlingService} from "./error.service";
import {ITournament} from "../type/tournament.type";
import {IMatch, IMatchFullData} from "../type/match.type";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TournamentService extends BaseApiService<ITournament> {
  itemSig: Subject<ITournament> = new Subject<ITournament>();
  matchesSig: Subject<IMatchFullData[]> = new Subject<IMatchFullData[]>();

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
  findMatchByTournamentId(id: number){
    return this.http.get<IMatchFullData[]>(`${this.endpoint}/id/${id}/matches/all/data`)
      .pipe(
        tap(
          (matches: IMatchFullData[]) =>{
            this.matchesSig.next(matches)
          }
        )
      )
  }
}
