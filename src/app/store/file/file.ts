import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../appstate';
import {
  selectFilePathUrl,
  selectIsFileLoading,
  selectTeamLogoUrl,
  selectUploadedTeamLogo,
} from './file.reducers';
import { fileActions } from './file.actions';

@Injectable({
  providedIn: 'root',
})
export class UploadFile {
  isFileLoading: Observable<boolean>;
  uploadedTeamLogo: Observable<File | null>;
  filePathUrl: Observable<string>;
  teamLogoUrl: Observable<string>;

  constructor(private store: Store<AppState>) {
    this.isFileLoading = this.store.select(selectIsFileLoading);
    this.filePathUrl = this.store.select(selectFilePathUrl);
    this.teamLogoUrl = this.store.select(selectTeamLogoUrl);
    this.uploadedTeamLogo = this.store.select(selectUploadedTeamLogo);
  }

  uploadTeamLogo(file: File) {
    if (file) {
      this.store.dispatch(fileActions.uploadTeamLogo({ file: file }));
    }
    console.log('No File!');
    return of(null);
  }

  uploadFile(file: File) {
    if (file) {
      this.store.dispatch(fileActions.uploadFile({ file: file }));
    }
    console.log('No File!');
    return of(null);
  }
}
