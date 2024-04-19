import { Component, inject, Input } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiButtonModule,
  TuiDialogModule,
  TuiErrorModule,
  TuiHintModule,
} from '@taiga-ui/core';
import {
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiFileLike,
  TuiInputFilesModule,
  TuiInputModule,
  TuiSelectModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';
import { TuiAutoFocusModule, TuiLetModule } from '@taiga-ui/cdk';
import { ITournament } from '../../../type/tournament.type';
import { AsyncPipe, NgIf, TitleCasePipe } from '@angular/common';
import { CreateButtonInFormComponent } from '../../../shared/ui/buttons/create-button-in-form/create-button-in-form.component';
import { CancelButtonInFormComponent } from '../../../shared/ui/buttons/cancel-button-in-form/cancel-button-in-form.component';
import { Store } from '@ngrx/store';
import { tournamentActions } from '../store/actions';
import { TournamentState } from '../store/reducers';
import { Tournament } from '../tournament';
import { ImageService } from '../../../services/image.service';
import { UploadProgressService } from '../../../services/upload-progress.service';
import { switchMap } from 'rxjs/operators';
import { catchError, finalize, map, Observable, of, Subject } from 'rxjs';
import { Sponsor } from '../../adv/sponsor/sponsor';
import { SponsorLine } from '../../adv/sponsor-line/sponsorLine';
import { ISponsor, ISponsorLine } from '../../../type/sponsor.type';
import { SelectFromListComponent } from '../../../shared/ui/select/select-from-list/select-from-list.component';

@Component({
  selector: 'app-tournament-add-edit-form',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiHintModule,
    TuiDialogModule,
    TuiInputModule,
    ReactiveFormsModule,
    TuiAutoFocusModule,
    TuiFieldErrorPipeModule,
    AsyncPipe,
    TuiErrorModule,
    TuiTextareaModule,
    CreateButtonInFormComponent,
    CancelButtonInFormComponent,
    NgIf,
    TuiInputFilesModule,
    TitleCasePipe,
    TuiDataListWrapperModule,
    TuiLetModule,
    TuiSelectModule,
    SelectFromListComponent,
  ],
  templateUrl: './tournament-add-edit-form.component.html',
  styleUrl: './tournament-add-edit-form.component.less',
})
export class TournamentAddEditFormComponent {
  @Input() sport_Id!: number;
  @Input() season_Id!: number;
  allSponsors$ = this.sponsor.allSponsors$;
  allSponsorLines$ = this.sponsorLine.allSponsorLines$;

  loadingFiles$ = this.uploadProgressService.loadingFiles$;
  rejectedFiles$ = this.uploadProgressService.rejectedFiles$;

  constructor(
    private tournament: Tournament,
    private imageService: ImageService,
    private uploadProgressService: UploadProgressService,
    private sponsor: Sponsor,
    private sponsorLine: SponsorLine,
  ) {
    sponsor.loadAllSponsors();
    sponsorLine.loadAllSponsorLines();
  }

  tournamentForm = new FormGroup({
    tournamentTitle: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    tournamentDescription: new FormControl(''),
    tournamentLogoUrl: new FormControl(''),
    tournamentMainSponsor: new FormControl<ISponsor | null>(null),
    tournamentSponsorLine: new FormControl<ISponsorLine | null>(null),
  });

  public tournamentLogoForm = new FormControl();

  open: boolean = false;

  showDialog(): void {
    this.open = true;
  }

  readonly loadedFiles$ = this.tournamentLogoForm.valueChanges.pipe(
    switchMap((file) => (file ? this.uploadTournamentLogo(file) : of(null))),
  );
  public uploadedFiles$ = new Subject<TuiFileLike | null>();

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.uploadProgressService.onReject(file);
  }

  removeFile(): void {
    this.uploadProgressService.removeFile(this.tournamentLogoForm);
  }

  clearRejected(): void {
    this.uploadProgressService.clearRejected(this.tournamentLogoForm);
  }

  uploadTournamentLogo(file: File): Observable<TuiFileLike | null> {
    this.loadingFiles$.next(file);

    if (file && file.name) {
      return this.imageService
        .uploadImage(file, 'tournaments/upload_logo')
        .pipe(
          map((response: any) => {
            this.tournamentForm.controls.tournamentLogoUrl.setValue(
              response.logoUrl,
            );
            this.uploadedFiles$.next(file);

            return file;
          }),
          catchError((error) => {
            console.error('Error while uploading logo:', error);
            return of(null);
          }),
          finalize(() => {
            this.loadingFiles$.next(null);
          }),
        );
    }

    return of(null);
  }

  onSubmit(): void {
    if (this.tournamentForm.valid) {
      const formValue = this.tournamentForm.getRawValue();

      const data: ITournament = {
        title: formValue.tournamentTitle!,
        description: formValue.tournamentDescription!,
        tournament_logo_url: formValue.tournamentLogoUrl!,
        main_sponsor_id: formValue.tournamentMainSponsor?.id ?? null,
        sponsor_line_id: formValue.tournamentSponsorLine?.id ?? null,
        season_id: this.season_Id,
        sport_id: this.sport_Id,
      };
      this.tournament.createTournament(data);
      this.tournamentForm.reset();
    }
  }
}
