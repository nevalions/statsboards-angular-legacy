import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}

  handleError(event: Event) {
    let image = event.target as HTMLImageElement;
    if (!image.dataset['alreadyErrored']) {
      image.dataset['alreadyErrored'] = 'true';
      image.src = '/assets/blank.png';
    }
  }

  uploadImage(
    file: File,
    apiPath: string,
  ): Observable<{ filePathUrl: string }> {
    if (file && file.name) {
      const formData = new FormData();
      formData.append('file', file, file.name);

      return this.http.post<{ filePathUrl: string }>(apiPath, formData).pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          console.error('Error while uploading logo:', error);
          return of({ filePathUrl: '' });
        }),
      );
    }

    return of({ filePathUrl: '' });
  }
}
