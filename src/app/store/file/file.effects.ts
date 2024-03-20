import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { fileActions } from './file.actions';
import { ImageService } from '../../services/image.service';

@Injectable()
export class FileEffects {
  uploadTeamLogo$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fileActions.uploadTeamLogo),
        mergeMap((action) =>
          this.imageService.uploadImage(action.file, 'teams/upload_logo').pipe(
            map((filePathUrl) =>
              fileActions.uploadTeamLogoSuccess(filePathUrl),
            ),
            catchError(() => of(fileActions.uploadTeamLogoFailure)),
          ),
        ),
      );
    },
    { functional: true },
  );

  constructor(
    private actions$: Actions,
    private imageService: ImageService,
  ) {}
}
