import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService<T> {
  private data: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  data$: Observable<T[]> = this.data.asObservable();

  protected constructor(
    private endpoint: string,
    private readonly http: HttpClient,
  ) { }

  findAll(): Observable<T[]> {
    return this.http.get<T[]>(this.endpoint)
      .pipe(
        tap((items: T[]) => {
          console.log(`Received /API/${this.endpoint.toUpperCase()} \ndata:`, items);
          this.data.next(items);
        })
      );
  }
}
