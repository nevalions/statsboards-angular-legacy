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
import { Sport } from '../../sport/sport';
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
import { ISponsor, ISponsorLine } from '../../../type/sponsor.type';
import { switchMap } from 'rxjs/operators';
import {
  TuiFieldErrorPipeModule,
  TuiFileLike,
  TuiFilesModule,
  TuiInputDateTimeModule,
  TuiInputFilesModule,
  TuiInputModule,
  TuiInputNumberModule,
} from '@taiga-ui/kit';
import { DateTimeService } from '../../../services/date-time.service';
import { ITeam } from '../../../type/team.type';
import { IPerson } from '../../../type/person.type';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import { AsyncPipe, NgIf } from '@angular/common';
import { TuiDialogModule, TuiErrorModule } from '@taiga-ui/core';
import { CancelButtonInFormComponent } from '../../../shared/ui/buttons/cancel-button-in-form/cancel-button-in-form.component';
import { CreateButtonInFormComponent } from '../../../shared/ui/buttons/create-button-in-form/create-button-in-form.component';

@Component({
  selector: 'app-add-edit-person',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiDialogModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputDateTimeModule,
    TuiInputNumberModule,
    TuiInputModule,
    NgIf,
    TuiFilesModule,
    TuiInputFilesModule,
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
  @Input() sport_Id!: number;
  @Input() personToUpdate: IPerson = {} as IPerson;

  @Output() addEvent = new EventEmitter<any>();
  @Output() editEvent = new EventEmitter<any>();

  current_date = new Date();
  tui_current_date = [
    new TuiDay(
      this.current_date.getFullYear(),
      this.current_date.getMonth(),
      this.current_date.getDate(),
    ),
    new TuiTime(12, 0),
  ];

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

  uploadPersonPhoto(file: File): Observable<TuiFileLike | null> {
    this.loadingFiles$.next(file);

    if (file && file.name) {
      return this.imageService.uploadImage(file, 'persons/upload_photo').pipe(
        map((response: any) => {
          this.personForm.controls.personPhotoUrl.setValue(response.photoUrl);
          this.uploadedFiles$.next(file);

          return file;
        }),
        catchError((error) => {
          console.error('Error while uploading photo:', error);
          return of(null);
        }),
        finalize(() => {
          this.loadingFiles$.next(null);
        }),
      );
    }

    return of(null);
  }

  open: boolean = false;

  showDialog(open: boolean): void {
    this.open = open;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['personToUpdate'] &&
      this.action === 'edit' &&
      this.personToUpdate &&
      this.sport_Id
    ) {
      const p = this.personToUpdate;

      this.personForm.setValue({
        id: p.id,
        firstName: p.first_name,
        secondName: p.second_name,
        personPhotoUrl: p.person_photo_url ?? null,
        personEeslId: p.person_eesl_id ?? null,
        personDob: this.dateTimeService.convertJsDateTime(
          new Date(p.person_dob!) ?? null,
        ),
      });
    }
  }

  onSubmit(): void {
    if (this.personForm.valid) {
      const formValue = this.personForm.getRawValue();

      const personDob = formValue.personDob;
      const jsDate = this.dateTimeService.convertTuiDateTime(personDob);

      let data: IPerson = {
        id: this.personForm.get('id')?.value,
        first_name: formValue.firstName!,
        second_name: formValue.secondName!,
        person_photo_url: formValue.personPhotoUrl ?? '',
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
