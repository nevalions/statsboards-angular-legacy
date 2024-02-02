import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ErrorHandlingService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseApiService<T> {
  private data: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  data$: Observable<T[]> = this.data.asObservable();

  protected constructor(
    protected endpoint: string,
    protected readonly http: HttpClient,
    private errorHandlingService: ErrorHandlingService,
  ) {}

  findAll(postValue?: string): Observable<T[]> {
    const finalEndpoint = postValue
      ? `${this.endpoint}/${postValue}`
      : this.endpoint;
    return this.http.get<T[]>(finalEndpoint).pipe(
      tap((items: T[]) => {
        console.log(
          `Received /API/${finalEndpoint.toUpperCase()} \ndata:`,
          items,
        );
      }),
      catchError((error) => {
        return this.errorHandlingService.handleError(error);
      }),
    );
  }

  findById(id: number): Observable<T> {
    return this.http.get<T>(`${this.endpoint}/id/${id}`).pipe(
      tap((item) =>
        console.log(
          `Received /API/${this.endpoint.toUpperCase()}/id/${id} \ndata:`,
          item,
        ),
      ),
      catchError((error) => {
        return this.errorHandlingService.handleError(error); // Call handleError of ErrorHandlingService
      }),
    );
  }

  findByFirstKeyValue(
    firstItem: string,
    firstKey: string,
    firstValue: any,
    optionalValue?: any,
  ): Observable<any> {
    return this.http
      .get<any>(`${firstItem}/${firstKey}/${firstValue}/${optionalValue}`)
      .pipe(
        tap((items) =>
          console.log(
            `Received  /API/
          ${firstItem}/${firstKey}/${firstValue}/${optionalValue}
          \ndata:`,
            items,
          ),
        ),
        catchError(this.errorHandlingService.handleError),
      );
  }

  findByFirstItemKeyValueAndSecondItemSecondKeyValue(
    firstItem: string,
    firstKey: string,
    firstValue: any,
    secondItem: string,
    secondKey: string,
    secondValue: number,
    optionalValue?: any,
  ): Observable<T[]> {
    return this.http
      .get<
        T[]
      >(`${firstItem}/${firstKey}/${firstValue}/${secondItem}/${secondKey}/${secondValue}/${optionalValue}`)
      .pipe(
        tap((items) =>
          console.log(
            `Received Sport Year TOURNAMENTS /API/
          ${firstItem}/${firstKey}/${firstValue}/${secondItem}/${secondKey}/${secondValue}/${optionalValue}
          \ndata:`,
            items,
          ),
        ),
        catchError(this.errorHandlingService.handleError),
      );
  }
}
