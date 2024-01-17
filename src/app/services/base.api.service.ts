import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {BehaviorSubject, catchError, Observable, throwError} from "rxjs";
import { tap } from 'rxjs/operators';
import {ErrorHandlingService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService<T> {
  private data: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  data$: Observable<T[]> = this.data.asObservable();

  protected constructor(
    protected endpoint: string,
    protected readonly http: HttpClient,
    private errorHandlingService: ErrorHandlingService,
  ) {
  }

  findAll(): Observable<T[]> {
    return this.http.get<T[]>(this.endpoint)
      .pipe(
        tap((items: T[]) => {
          console.log(`Received /API/${this.endpoint.toUpperCase()} \ndata:`, items);
          this.data.next(items);
        })
      );
  }

  findById(id: number): Observable<T> {
    return this.http.get<T>(`${this.endpoint}/id/${id}`)
      .pipe(
        tap(item => console.log(`Received /API/${this.endpoint.toUpperCase()}/id/${id} \ndata:`, item)),
        catchError(error => {
          return this.errorHandlingService.handleError(error); // Call handleError of ErrorHandlingService
        }),
      );
  }
}
