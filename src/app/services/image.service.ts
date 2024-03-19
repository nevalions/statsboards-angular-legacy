import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  handleError(event: Event) {
    let image = event.target as HTMLImageElement;

    if (!image.dataset['alreadyErrored']) {
      image.dataset['alreadyErrored'] = 'true';
      image.src = '/assets/blank2.png';
    }
  }
}
