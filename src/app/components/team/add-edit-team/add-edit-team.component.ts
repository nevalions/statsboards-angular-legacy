import { TuiTextareaModule, TuiInputModule, TuiInputNumberModule } from "@taiga-ui/legacy";
import { TuiAutoFocus } from "@taiga-ui/cdk";
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
import { ITeam } from '../../../type/team.type';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { TuiError, TuiDialog, TuiButton } from '@taiga-ui/core';
import { TuiFileLike, TuiFieldErrorPipe, TuiFieldErrorContentPipe, TuiFiles } from '@taiga-ui/kit';
import { CreateButtonInFormComponent } from '../../../shared/ui/buttons/create-button-in-form/create-button-in-form.component';
import { CancelButtonInFormComponent } from '../../../shared/ui/buttons/cancel-button-in-form/cancel-button-in-form.component';
import { Team } from '../team';
import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ImageService } from '../../../services/image.service';
import { UploadProgressService } from '../../../services/upload-progress.service';
import { environment } from '../../../../environments/environment';
import { DialogService } from '../../../services/dialog.service';
import { ISponsor, ISponsorLine } from '../../../type/sponsor.type';
import { SelectFromListComponent } from '../../../shared/ui/select/select-from-list/select-from-list.component';
import { stringifyTitle } from '../../../base/helpers';
import { UploadResizeImageResponse } from '../../../type/base.type';

@Component({
  selector: 'app-add-edit-team',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiAutoFocus,
    TuiButton,
    TuiDialog,
    TuiError,
    TuiFieldErrorPipe,
    TuiFieldErrorContentPipe,
    TuiInputModule,
    TuiTextareaModule,
    TuiInputNumberModule,
    CreateButtonInFormComponent,
    CancelButtonInFormComponent,
    TuiFiles,
    NgOptimizedImage,
    SelectFromListComponent
],
  templateUrl: './add-edit-team.component.html',
  styleUrl: './add-edit-team.component.less',
})
export class AddEditTeamComponent implements OnInit, OnDestroy, OnChanges {
  private dialogSubscription: Subscription | undefined;

  @Input() action: string = 'add';
  @Input() dialogId: string = 'addDialog';
  @Input() new_team: ITeam = {} as ITeam;
  @Input() sportId!: number;
  @Input() allSponsors: ISponsor[] | null = [];
  @Input() allSponsorLines: ISponsorLine[] | null = [];

  @Output() addEvent = new EventEmitter<any>();
  @Output() editEvent = new EventEmitter<any>();
  backendUrl = environment.backendUrl;

  loadingFiles$ = this.uploadProgressService.loadingFiles$;
  rejectedFiles$ = this.uploadProgressService.rejectedFiles$;

  constructor(
    private team: Team,
    private imageService: ImageService,
    private uploadProgressService: UploadProgressService,
    private dialogService: DialogService,
  ) {}

  teamForm = new FormGroup({
    id: new FormControl<number | null | undefined>(undefined),
    teamTitle: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    teamCity: new FormControl(''),
    teamDescription: new FormControl(''),
    teamLogoUrl: new FormControl(''),
    teamLogoIconUrl: new FormControl(''),
    teamLogoWebUrl: new FormControl(''),
    teamEeslId: new FormControl<number | null | undefined>(undefined),
    teamColor: new FormControl<string>(''),
    teamMainSponsor: new FormControl<ISponsor | null>(null),
    teamSponsorLine: new FormControl<ISponsorLine | null>(null),
  });

  public teamLogoForm = new FormControl();

  open: boolean = false;

  showDialog(open: boolean): void {
    this.open = open;
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
      return this.imageService
        .uploadResizeImage(file, 'teams/upload_resize_logo')
        .pipe(
          map((response: UploadResizeImageResponse) => {
            {
              this.teamForm.controls.teamLogoUrl.setValue(response.original);
              this.teamForm.controls.teamLogoIconUrl.setValue(response.icon);
              this.teamForm.controls.teamLogoWebUrl.setValue(response.webview);
            }
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

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['new_team'] &&
      this.action === 'edit' &&
      this.new_team &&
      this.allSponsors &&
      this.allSponsorLines
    ) {
      console.log('TEAM TO UPDATE', this.new_team);
      const item: ITeam = this.new_team;

      const mainSponsor: ISponsor | undefined | null = this.allSponsors.find(
        (sponsor: ISponsor) => sponsor.id === item.main_sponsor_id,
      );

      const tournamentSponsorLine: ISponsorLine | undefined | null =
        this.allSponsorLines.find(
          (sponsorLine: ISponsorLine) =>
            sponsorLine.id === item.sponsor_line_id,
        );

      this.teamForm.setValue({
        id: item.id,
        teamTitle: item.title,
        teamCity: item.city ?? null,
        teamDescription: item.description ?? null,
        teamLogoUrl: item.team_logo_url ?? null,
        teamLogoIconUrl: item.team_logo_icon_url ?? null,
        teamLogoWebUrl: item.team_logo_web_url ?? null,
        teamEeslId: item.team_eesl_id ?? null,
        teamColor: item.team_color ?? '#6a6a6a',
        teamMainSponsor: mainSponsor ?? null,
        teamSponsorLine: tournamentSponsorLine ?? null,
      });
    }
  }

  ngOnInit(): void {
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
    if (this.teamForm.valid) {
      const formValue = this.teamForm.getRawValue();

      const data: ITeam = {
        id: this.teamForm.get('id')?.value,
        title: formValue.teamTitle!,
        city: formValue.teamCity!,
        description: formValue.teamDescription!,
        team_logo_url: formValue.teamLogoUrl!,
        team_logo_icon_url: formValue.teamLogoIconUrl!,
        team_logo_web_url: formValue.teamLogoWebUrl!,
        team_eesl_id: formValue.teamEeslId,
        sport_id: this.sportId,
        team_color: formValue.teamColor!,
        sponsor_line_id: formValue.teamMainSponsor?.id ?? null,
        main_sponsor_id: formValue.teamSponsorLine?.id ?? null,
      };

      // console.log(data);
      // console.log(formValue.teamTitle, data.sport_id);

      if (this.action === 'add') {
        // console.log(data);
        this.team.createTeam(data);
        this.teamForm.reset();
      } else if (this.action === 'edit') {
        // console.log(this.action);
        // console.log(data);
        this.team.updateTeam(data);
        // this.tournamentForm.reset();
      }
    }
  }

  protected readonly stringifyTitle = stringifyTitle;
}
