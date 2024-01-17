import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {Observable, throwError} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ErrorHandlingService {
  constructor(private router: Router) {}

  handleError(error: any): Observable<never> {
    // Logic for logging error to a logging service

    // Handle the error based on its type or error status code
    if (error.status === 404) {
      this.router.navigateByUrl("/error404", {
        state: { errorStatus: error.status, errorStatusText: error.statusText }
      });
      console.log("Redirected to Error page");
    }
    // Other error handling logic...

    return throwError(() => error);
  }
}
