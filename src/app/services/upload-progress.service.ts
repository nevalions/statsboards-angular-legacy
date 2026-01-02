import { of, Subject } from 'rxjs';
import { TuiFileLike } from '@taiga-ui/kit';
import { ImageService } from './image.service';
import { Injectable, inject } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UploadProgressService {
  private imageService = inject(ImageService);

  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(teamLogoForm: FormControl): void {
    teamLogoForm.setValue(null);
  }

  clearRejected(teamLogoForm: FormControl): void {
    this.removeFile(teamLogoForm);
    this.rejectedFiles$.next(null);
  }
}
