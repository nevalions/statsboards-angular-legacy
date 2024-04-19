import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ITeam } from '../../../type/team.type';
import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDialogModule,
  TuiErrorModule,
} from '@taiga-ui/core';
import {
  TuiFieldErrorPipeModule,
  TuiFileLike,
  TuiInputFilesModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';
import { CreateButtonInFormComponent } from '../../../shared/ui/buttons/create-button-in-form/create-button-in-form.component';
import { CancelButtonInFormComponent } from '../../../shared/ui/buttons/cancel-button-in-form/cancel-button-in-form.component';
import { Team } from '../team';
import { catchError, finalize, map, Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ImageService } from '../../../services/image.service';
import { UploadProgressService } from '../../../services/upload-progress.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-edit-team',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiAutoFocusModule,
    TuiButtonModule,
    TuiDialogModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputModule,
    TuiTextareaModule,
    TuiInputNumberModule,
    CreateButtonInFormComponent,
    CancelButtonInFormComponent,
    TuiInputFilesModule,
    NgIf,
    NgOptimizedImage,
  ],
  templateUrl: './add-edit-team.component.html',
  styleUrl: './add-edit-team.component.less',
})
export class AddEditTeamComponent {
  @Input() sportId!: number;
  backendUrl = environment.backendUrl;

  loadingFiles$ = this.uploadProgressService.loadingFiles$;
  rejectedFiles$ = this.uploadProgressService.rejectedFiles$;

  constructor(
    private team: Team,
    private imageService: ImageService,
    private uploadProgressService: UploadProgressService,
  ) {}

  teamForm = new FormGroup({
    teamTitle: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    teamCity: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    teamDescription: new FormControl(''),
    teamLogoUrl: new FormControl(''),
    teamEeslId: new FormControl(undefined),
  });

  public teamLogoForm = new FormControl();

  open: boolean = false;

  showDialog(): void {
    this.open = true;
  }

  readonly loadedFiles$ = this.teamLogoForm.valueChanges.pipe(
    switchMap((file) => (file ? this.uploadTeamLogo(file) : of(null))),
  );
  public uploadedFiles$ = new Subject<TuiFileLike | null>();

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.uploadProgressService.onReject(file);
  }

  removeFile(): void {
    this.uploadProgressService.removeFile(this.teamLogoForm);
  }

  clearRejected(): void {
    this.uploadProgressService.clearRejected(this.teamLogoForm);
  }

  uploadTeamLogo(file: File): Observable<TuiFileLike | null> {
    this.loadingFiles$.next(file);

    if (file && file.name) {
      return this.imageService.uploadImage(file, 'teams/upload_logo').pipe(
        map((response: any) => {
          this.teamForm.controls.teamLogoUrl.setValue(response.logoUrl);
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
    if (this.teamForm.valid) {
      const formValue = this.teamForm.getRawValue();

      const data: ITeam = {
        title: formValue.teamTitle!,
        city: formValue.teamCity!,
        description: formValue.teamDescription!,
        team_logo_url: formValue.teamLogoUrl!,
        team_eesl_id: formValue.teamEeslId,
        sport_id: this.sportId,
      };

      // console.log(data);

      // console.log(formValue.teamTitle, data.sport_id);
      this.team.createTeam(data);
      this.teamForm.reset();
    }
  }
}
