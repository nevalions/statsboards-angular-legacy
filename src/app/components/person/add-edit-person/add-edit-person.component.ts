import { TuiInputModule, TuiInputDateTimeModule, TuiInputNumberModule } from "@taiga-ui/legacy";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ImageService } from '../../../services/image.service';
import { UploadProgressService } from '../../../services/upload-progress.service';
import { DialogService } from '../../../services/dialog.service';
import { Person } from '../person';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { TuiFileLike, TuiFiles, TuiFieldErrorPipe, TuiFieldErrorContentPipe } from '@taiga-ui/kit';
import { DateTimeService } from '../../../services/date-time.service';
import { IPerson } from '../../../type/person.type';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import { AsyncPipe, NgIf } from '@angular/common';
import { TuiError, TuiDialog } from '@taiga-ui/core';
import { CancelButtonInFormComponent } from '../../../shared/ui/buttons/cancel-button-in-form/cancel-button-in-form.component';
import { CreateButtonInFormComponent } from '../../../shared/ui/buttons/create-button-in-form/create-button-in-form.component';
import { UploadResizeImageResponse } from '../../../type/base.type';

@Component({
  selector: 'app-add-edit-person',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiDialog,
    TuiError,
    TuiFieldErrorPipe, TuiFieldErrorContentPipe,
    TuiInputDateTimeModule,
    TuiInputNumberModule,
    TuiInputModule,
    NgIf,
    TuiFiles,
    CancelButtonInFormComponent,
    CreateButtonInFormComponent,
  ],
  templateUrl: './add-edit-person.component.html',
  styleUrl: './add-edit-person.component.less',
})
export class AddEditPersonComponent implements OnInit, OnDestroy, OnChanges {
  private dialogSubscription: Subscription | undefined;

  @Input() action: string = 'add';
  @Input() dialogId: string = 'addDialog';
  @Input() personToUpdate: IPerson = {} as IPerson;

  @Output() addEvent = new EventEmitter<any>();
  @Output() editEvent = new EventEmitter<any>();

  backendUrl = environment.backendUrl;

  loadingFiles$ = this.uploadProgressService.loadingFiles$;
  rejectedFiles$ = this.uploadProgressService.rejectedFiles$;

  constructor(
    private person: Person,
    private imageService: ImageService,
    private uploadProgressService: UploadProgressService,
    private dialogService: DialogService,
    private dateTimeService: DateTimeService,
  ) {}

  personForm = new FormGroup({
    id: new FormControl<number | null | undefined>(undefined),
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    secondName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    personDob: new FormControl<(TuiDay | TuiTime)[] | null>(null),
    personPhotoUrl: new FormControl(''),
    personPhotoIconUrl: new FormControl(''),
    personPhotoWebUrl: new FormControl(''),
    personEeslId: new FormControl<number | null>(null),
  });

  public personPhotoForm = new FormControl();

  readonly loadedFiles$ = this.personPhotoForm.valueChanges.pipe(
    switchMap((file) => (file ? this.uploadPersonPhoto(file) : of(null))),
  );
  public uploadedFiles$ = new Subject<TuiFileLike | null>();

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.uploadProgressService.onReject(file);
  }

  removeFile(): void {
    this.uploadProgressService.removeFile(this.personPhotoForm);
  }

  clearRejected(): void {
    this.uploadProgressService.clearRejected(this.personPhotoForm);
  }

  // uploadPersonPhoto(file: File): Observable<TuiFileLike | null> {
  //   this.loadingFiles$.next(file);
  //
  //   if (file && file.name) {
  //     return this.imageService.uploadImage(file, 'persons/upload_photo').pipe(
  //       map((response: any) => {
  //         this.personForm.controls.personPhotoUrl.setValue(response.photoUrl);
  //         this.uploadedFiles$.next(file);
  //
  //         return file;
  //       }),
  //       catchError((error) => {
  //         console.error('Error while uploading photo:', error);
  //         return of(null);
  //       }),
  //       finalize(() => {
  //         this.loadingFiles$.next(null);
  //       }),
  //     );
  //   }
  //
  //   return of(null);
  // }

  uploadPersonPhoto(file: File): Observable<TuiFileLike | null> {
    this.loadingFiles$.next(file);

    if (file && file.name) {
      return this.imageService
        .uploadResizeImage(file, 'persons/upload_resize_photo')
        .pipe(
          map((response: UploadResizeImageResponse) => {
            {
              this.personForm.controls.personPhotoUrl.setValue(
                response.original,
              );
              this.personForm.controls.personPhotoIconUrl.setValue(
                response.icon,
              );
              this.personForm.controls.personPhotoWebUrl.setValue(
                response.webview,
              );
            }
            this.uploadedFiles$.next(file);

            return file; // Return the file as a TuiFileLike object if needed, or adapt as required
          }),
          catchError((error) => {
            console.error('Error while uploading photo:', error);
            return of(null); // Return null to indicate the upload failed
          }),
          finalize(() => {
            this.loadingFiles$.next(null); // Indicate that loading has finished
          }),
        );
    }

    return of(null); // Return null immediately if there's no file selected
  }

  open: boolean = false;

  showDialog(open: boolean): void {
    this.open = open;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['personToUpdate'] &&
      this.action === 'edit' &&
      this.personToUpdate
    ) {
      const p = this.personToUpdate;

      if (p.person_dob) {
        this.personForm.setValue({
          id: p.id,
          firstName: p.first_name!,
          secondName: p.second_name!,
          personPhotoUrl: p.person_photo_url ?? null,
          personPhotoIconUrl: p.person_photo_icon_url ?? null,
          personPhotoWebUrl: p.person_photo_web_url ?? null,
          personEeslId: p.person_eesl_id ?? null,
          personDob: this.dateTimeService.convertJsDateTime(
            new Date(p.person_dob!) ?? null,
          ),
        });
      }

      if (!p.person_dob) {
        this.personForm.setValue({
          id: p.id,
          firstName: p.first_name!,
          secondName: p.second_name!,
          personPhotoUrl: p.person_photo_url ?? null,
          personPhotoIconUrl: p.person_photo_icon_url ?? null,
          personPhotoWebUrl: p.person_photo_web_url ?? null,
          personEeslId: p.person_eesl_id ?? null,
          personDob: null,
        });
      }
    }
  }

  onSubmit(): void {
    if (this.personForm.valid) {
      const formValue = this.personForm.getRawValue();

      const personDob = formValue.personDob;
      if (personDob) {
        const jsDate = this.dateTimeService.convertTuiDateTime(personDob);

        let data: IPerson = {
          id: this.personForm.get('id')?.value,
          first_name: formValue.firstName!,
          second_name: formValue.secondName!,
          person_photo_url: formValue.personPhotoUrl ?? '',
          person_photo_icon_url: formValue.personPhotoIconUrl ?? '',
          person_photo_web_url: formValue.personPhotoWebUrl ?? '',
          person_eesl_id: formValue.personEeslId,
          person_dob: jsDate,
        };

        if (this.action === 'add') {
          this.person.createPerson(data);
        } else if (this.action === 'edit') {
          console.log(this.action);
          console.log(data);
          this.person.updatePerson(data);
        }
      }
      if (!personDob) {
        let data: IPerson = {
          id: this.personForm.get('id')?.value,
          first_name: formValue.firstName!,
          second_name: formValue.secondName!,
          person_photo_url: formValue.personPhotoUrl ?? '',
          person_photo_icon_url: formValue.personPhotoIconUrl ?? '',
          person_photo_web_url: formValue.personPhotoWebUrl ?? '',
          person_eesl_id: formValue.personEeslId,
          person_dob: null,
        };

        if (this.action === 'add') {
          this.person.createPerson(data);
        } else if (this.action === 'edit') {
          console.log(this.action);
          console.log(data);
          this.person.updatePerson(data);
        }
      }
    }
  }

  ngOnInit(): void {
    // console.log(this.dialogId);
    // console.log(this.action);

    this.dialogSubscription = this.dialogService
      .getDialogEvent(this.dialogId)
      .subscribe(() => {
        this.showDialog(true);
      });
  }

  ngOnDestroy(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }
}
