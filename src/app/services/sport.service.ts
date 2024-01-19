import {Injectable} from "@angular/core";
import { ISport } from "../type/sport.type";
import { BaseApiService } from "./base.api.service";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {ErrorHandlingService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class SportService extends BaseApiService<ISport> {
  itemSig: Subject<ISport> = new Subject<ISport>();
  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService
  ) {
    super(
      'sports',
      http,
      errorHandlingService
      );
  }
}
  // findById(id: number) {
  //   return this.http.get<ISport>(`${this.endpoint}/id/${id}`)
  //     .pipe(
  //       tap((sport: ISport) => {
  //         this.itemSig.next(sport)
  //       }),
  //       catchError((error) => {
  //         // console.error.type.ts('Error occurred:', error.type.ts);
  //         this.router.navigateByUrl('/error404', {
  //           state: {
  //             errorStatus: error.status,
  //             errorStatusText: error.statusText
  //           }
  //           }
  //         ).then(success => {
  //           if (success){
  //             console.log('Redirected to Error page')
  //           }
  //         });
  //         return throwError(() => error);
  //       })
  //     )
  // };


