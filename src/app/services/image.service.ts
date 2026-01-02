import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { UploadResizeImageResponse } from '../type/base.type';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private http = inject(HttpClient);


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

  uploadResizeImage(
    file: File,
    apiPath: string,
  ): Observable<UploadResizeImageResponse> {
    if (file && file.name) {
      const formData = new FormData();
      formData.append('file', file, file.name);

      return this.http.post<UploadResizeImageResponse>(apiPath, formData).pipe(
        map((response) => response), // This map is optional as the response is already of the right type.
        catchError((error) => {
          console.error('Error while uploading image:', error);
          return of({
            original: '',
            icon: '',
            webview: '',
          } as UploadResizeImageResponse); // Provide default values in case of an error
        }),
      );
    }

    return of({
      original: '',
      icon: '',
      webview: '',
    } as UploadResizeImageResponse); // Provide default values if file conditions are not met
  }
}
