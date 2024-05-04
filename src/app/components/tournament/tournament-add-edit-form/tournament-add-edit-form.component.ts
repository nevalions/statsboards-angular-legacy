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
  TuiAvatarModule,
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
import { Tournament } from '../tournament';
import { ImageService } from '../../../services/image.service';
import { UploadProgressService } from '../../../services/upload-progress.service';
import { switchMap } from 'rxjs/operators';
import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import { ISponsor, ISponsorLine } from '../../../type/sponsor.type';
import { SelectFromListComponent } from '../../../shared/ui/select/select-from-list/select-from-list.component';
import { environment } from '../../../../environments/environment';
import { DialogService } from '../../../services/dialog.service';
import { stringifyTitle } from '../../../base/helpers';

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
    TuiAvatarModule,
  ],
  templateUrl: './tournament-add-edit-form.component.html',
  styleUrl: './tournament-add-edit-form.component.less',
})
export class TournamentAddEditFormComponent
  implements OnInit, OnDestroy, OnChanges
{
  private dialogSubscription: Subscription | undefined;

  @Input() action: string = 'add';
  @Input() dialogId: string = 'addDialog';
  @Input() new_tournament: ITournament = {} as ITournament;
  @Input() allSponsors: ISponsor[] | null = [];
  @Input() allSponsorLines: ISponsorLine[] | null = [];
  @Input() sport_Id!: number;
  @Input() season_Id!: number;

  @Output() addEvent = new EventEmitter<any>();
  @Output() editEvent = new EventEmitter<any>();

  backendUrl = environment.backendUrl;

  loadingFiles$ = this.uploadProgressService.loadingFiles$;
  rejectedFiles$ = this.uploadProgressService.rejectedFiles$;

  constructor(
    private tournament: Tournament,
    private imageService: ImageService,
    private uploadProgressService: UploadProgressService,
    private dialogService: DialogService,
  ) {}

  tournamentForm = new FormGroup({
    id: new FormControl<number | null | undefined>(undefined),
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

  showDialog(open: boolean): void {
    this.open = open;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['new_tournament'] &&
      this.action === 'edit' &&
      this.new_tournament &&
      this.allSponsors &&
      this.allSponsorLines
    ) {
      // console.log(
      //   'TOURNAMENT TO UPDATE',
      //   this.new_tournament,
      //   this.allSponsors,
      //   this.allSponsorLines,
      // );
      const item: ITournament = this.new_tournament;
      const mainSponsor: ISponsor | undefined = this.allSponsors.find(
        (sponsor: ISponsor) => sponsor.id === item.main_sponsor_id,
      );

      const tournamentSponsorLine: ISponsorLine | undefined =
        this.allSponsorLines.find(
          (sponsorLine: ISponsorLine) =>
            sponsorLine.id === item.sponsor_line_id,
        );

      // console.log('TOURNAMENT VALUES', tournamentSponsorLine, mainSponsor);

      this.tournamentForm.setValue({
        id: item.id,
        tournamentTitle: item.title,
        tournamentDescription: item.description,
        tournamentLogoUrl: item.tournament_logo_url ?? null,
        tournamentMainSponsor: mainSponsor ?? null,
        tournamentSponsorLine: tournamentSponsorLine ?? null,
      });
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

  onSubmit(): void {
    if (this.tournamentForm.valid) {
      const formValue = this.tournamentForm.getRawValue();

      const data: ITournament = {
        id: this.tournamentForm.get('id')?.value,
        title: formValue.tournamentTitle!,
        description: formValue.tournamentDescription!,
        tournament_logo_url: formValue.tournamentLogoUrl!,
        main_sponsor_id: formValue.tournamentMainSponsor?.id ?? null,
        sponsor_line_id: formValue.tournamentSponsorLine?.id ?? null,
        season_id: this.season_Id,
        sport_id: this.sport_Id,
      };

      if (this.action === 'add') {
        // console.log(data);
        this.tournament.createTournament(data);
        this.tournamentForm.reset();
      } else if (this.action === 'edit') {
        // console.log(this.action);
        // console.log(data);
        this.tournament.updateTournament(data);
        // this.tournamentForm.reset();
      }
    }
  }

  protected readonly stringifyTitle = stringifyTitle;
}
