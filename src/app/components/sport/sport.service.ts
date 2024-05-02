import { Injectable } from '@angular/core';
import { ISport } from '../../type/sport.type';
import { BaseApiService } from '../../services/base.api.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorHandlingService } from '../../services/error.service';
import { ITeam } from '../../type/team.type';
import { IPlayer } from '../../type/player.type';
import { SortService } from '../../services/sort.service';
import { tap } from 'rxjs/operators';

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
