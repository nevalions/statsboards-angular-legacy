import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../services/base.api.service';
import { ErrorHandlingService } from '../../services/error.service';
import { ISport } from '../../type/sport.type';

@Injectable({
  providedIn: 'root',
})
export class SportService extends BaseApiService<ISport> {
  constructor(
    http: HttpClient,
    private router: Router,
    errorHandlingService: ErrorHandlingService,
  ) {
    super('sports', http, errorHandlingService);
  }

  findSportByMatchIdFullData(matchId: number): Observable<ISport> {
    return this.findByFirstKeyValue('matches', 'id', matchId, 'sport')
      .pipe
      // tap((players) =>
      //   console.log(`PLAYERS from MATCH ID: ${id}`, players),
      // ),
      ();
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
//           store: {
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
