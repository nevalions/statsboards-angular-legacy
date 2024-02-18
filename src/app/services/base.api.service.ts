import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  shareReplay,
} from 'rxjs';
import { tap } from 'rxjs/operators';
import { ErrorHandlingService } from './error.service';
import { BaseEntity } from '../shared/state/crud.actions';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseApiService<T> {
  private cache$: { [id: number]: Observable<T> } = {};
  private cache$ByFirstKeyValue: { [key: string]: Observable<any> } = {};

  protected constructor(
    protected endpoint: string,
    protected readonly http: HttpClient,
    protected errorHandlingService: ErrorHandlingService,
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

  addItem(postData: T, postValue?: string): Observable<T> {
    const finalEndpoint = postValue
      ? `${this.endpoint}/${postValue}`
      : this.endpoint;

    return this.http.post<T>(finalEndpoint, postData).pipe(
      tap((items: T) => {
        console.log(
          `POSTED /API/${finalEndpoint.toUpperCase()} \ndata:`,
          items,
        );
      }),
      map((response) => {
        console.log('Server response:', response);
        return response;
      }),
      catchError((error) => {
        return this.errorHandlingService.handleError(error);
      }),
    );
  }

  editItem(id: number | string, postData: T): Observable<T> {
    return this.http.put<T>(`${this.endpoint}/?item_id=${id}`, postData).pipe(
      tap((items: T) => {
        console.log(
          `PUT /API/${this.endpoint.toUpperCase()}/${id} \ndata:`,
          items,
        );
      }),
      map((response) => {
        console.log('Server response:', response);
        return response;
      }),
      catchError((error) => {
        return this.errorHandlingService.handleError(error);
      }),
    );
  }

  deleteItem(id: number): Observable<T> {
    return this.http.delete<T>(`${this.endpoint}/id/${id}`).pipe(
      tap(() => {
        console.log(`DELETED /API/${this.endpoint.toUpperCase()}/${id}`);
      }),
      catchError((error) => {
        return this.errorHandlingService.handleError(error);
      }),
    );
  }

  findById(id: number): Observable<T> {
    if (!this.cache$[id]) {
      this.cache$[id] = this.http.get<T>(`${this.endpoint}/id/${id}`).pipe(
        tap((item) =>
          console.log(
            `Received /API/${this.endpoint.toUpperCase()}/id/${id} \ndata:`,
            item,
          ),
        ),
        catchError((error) => {
          return this.errorHandlingService.handleError(error);
        }),
        shareReplay(1),
      );
    }
    return this.cache$[id];
  }

  addAnyItem(postData: any, postValue?: string): Observable<any> {
    const finalEndpoint = postValue
      ? `${this.endpoint}/${postValue}`
      : this.endpoint;
    return this.http.post<any>(finalEndpoint, postData).pipe(
      tap((items: any) => {
        console.log(
          `POSTED /API/${finalEndpoint.toUpperCase()} \ndata:`,
          items,
        );
      }),
      catchError((error) => {
        return this.errorHandlingService.handleError(error);
      }),
    );
  }

  deleteAnyItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.endpoint}/id/${id}`).pipe(
      tap(() => {
        console.log(`DELETED /API/${this.endpoint.toUpperCase()}/${id}`);
      }),
      catchError((error) => {
        return this.errorHandlingService.handleError(error);
      }),
    );
  }

  findByFirstKeyValue(
    firstItem: string,
    firstKey: string,
    firstValue: any,
    optionalValue?: any | undefined,
  ): Observable<any> {
    const cacheKey = `${firstItem}/${firstKey}/${firstValue}${optionalValue ? `/${optionalValue}` : ''}`;
    // console.log(cacheKey);

    if (!this.cache$ByFirstKeyValue[cacheKey]) {
      let finalEndpoint = `${firstItem}/${firstKey}/${firstValue}`;
      // console.log(finalEndpoint);

      if (optionalValue !== null && optionalValue !== undefined) {
        finalEndpoint += `/${optionalValue}`;
      }

      // console.log(finalEndpoint);

      this.cache$ByFirstKeyValue[cacheKey] = this.http
        .get<any>(finalEndpoint)
        .pipe(
          tap((items) =>
            console.log(
              `Received  /API/${firstItem}/${firstKey}/${firstValue}` +
                (optionalValue ? `/${optionalValue}` : '') +
                `\n data:`,
              items,
            ),
          ),
          catchError(this.errorHandlingService.handleError),
          shareReplay(1),
        );
    }

    return this.cache$ByFirstKeyValue[cacheKey];
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

export abstract class BaseApiServiceEndpoint<T> {
  protected constructor(
    protected readonly http: HttpClient,
    protected errorHandlingService: ErrorHandlingService,
  ) {}

  findAll(endpoint: string, postValue?: string): Observable<T[]> {
    const finalEndpoint = postValue ? `${endpoint}/${postValue}` : endpoint;
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

  addItem(endpoint: string, postData: T, postValue?: string): Observable<T> {
    const finalEndpoint = postValue ? `${endpoint}/${postValue}` : endpoint;
    return this.http.post<T>(finalEndpoint, postData).pipe(
      tap((items: T) => {
        console.log(
          `POSTED /API/${finalEndpoint.toUpperCase()} \ndata:`,
          items,
        );
      }),
      map((response) => {
        console.log('Server response:', response);
        return response;
      }),
      catchError((error) => {
        return this.errorHandlingService.handleError(error);
      }),
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

  addAnyItem(
    endpoint: string,
    postData: any,
    postValue?: string,
  ): Observable<any> {
    const finalEndpoint = postValue ? `${endpoint}/${postValue}` : endpoint;
    return this.http.post<any>(finalEndpoint, postData).pipe(
      tap((items: any) => {
        console.log(
          `POSTED /API/${finalEndpoint.toUpperCase()} \ndata:`,
          items,
        );
      }),
      catchError((error) => {
        return this.errorHandlingService.handleError(error);
      }),
    );
  }
}

@Injectable({ providedIn: 'root' })
export class RealApiService<T> extends BaseApiServiceEndpoint<T> {
  constructor(http: HttpClient, errorHandlingService: ErrorHandlingService) {
    super(http, errorHandlingService);
  }
}
