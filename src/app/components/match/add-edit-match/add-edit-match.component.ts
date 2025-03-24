import { TuiTextfieldControllerModule, TuiTextareaModule, TuiInputModule, TuiInputDateModule, TuiInputDateTimeModule, TuiInputNumberModule, TuiSelectModule } from "@taiga-ui/legacy";
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiDay, TuiTime, TuiLet } from '@taiga-ui/cdk';
import { TuiError, TuiLoader, TuiDialog, TuiButton } from '@taiga-ui/core';
import { tuiItemsHandlersProvider, TuiDataListWrapper, TuiFieldErrorPipe, TuiFieldErrorContentPipe, TuiAvatar } from '@taiga-ui/kit';

import { IMatch, IMatchWithFullData } from '../../../type/match.type';

import { Subscription } from 'rxjs';
import { DateTimeService } from '../../../services/date-time.service';
import { DialogService } from '../../../services/dialog.service';
import { CancelButtonInFormComponent } from '../../../shared/ui/buttons/cancel-button-in-form/cancel-button-in-form.component';
import { CreateButtonInFormComponent } from '../../../shared/ui/buttons/create-button-in-form/create-button-in-form.component';
import { SelectTeamComponent } from '../../../shared/ui/forms/select-team/select-team.component';
import { ITeam } from '../../../type/team.type';

import { stringifyTitle } from '../../../base/helpers';
import { SelectFromListComponent } from '../../../shared/ui/select/select-from-list/select-from-list.component';
import { ISponsor, ISponsorLine } from '../../../type/sponsor.type';
import { Match } from '../match';

@Component({
  selector: 'app-add-edit-match',
  standalone: true,
  imports: [
    TuiButton,
    AsyncPipe,
    ReactiveFormsModule,
    TuiDialog,
    TuiError,
    TuiFieldErrorPipe, TuiFieldErrorContentPipe,
    TuiInputModule,
    TuiTextareaModule,
    TuiInputNumberModule,
    TuiInputDateModule,
    TuiTextfieldControllerModule,
    TuiSelectModule,
    TuiDataListWrapper,
    TuiLoader,
    TuiLet,
    TuiAvatar,
    FormsModule,
    TuiInputDateTimeModule,
    SelectTeamComponent,
    CreateButtonInFormComponent,
    CancelButtonInFormComponent,
    TitleCasePipe,
    SelectFromListComponent,
  ],
  templateUrl: './add-edit-match.component.html',
  styleUrl: './add-edit-match.component.less',
  providers: [
    tuiItemsHandlersProvider({
      stringify: (item: ITeam) => `${item.title}`,
    }),
  ],
})
export class AddEditMatchComponent implements OnInit, OnChanges, OnDestroy {
  constructor(private match: Match) {}

  dateTimeService = inject(DateTimeService);
  dialogService = inject(DialogService);
  private dialogSubscription: Subscription | undefined;

  @Input() action: string = 'add';
  @Input() dialogId: string = 'addDialog';
  @Input() matchWithFullData: IMatchWithFullData = {} as IMatchWithFullData;
  @Input() tournamentId!: number;
  @Input() teams: ITeam[] = [];
  @Input() allSponsors: ISponsor[] | null = [];
  @Input() allSponsorLines: ISponsorLine[] | null = [];

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

  matchForm = new FormGroup({
    id: new FormControl<number | null | undefined>(undefined),
    match_date: new FormControl(this.tui_current_date, [Validators.required]),
    week: new FormControl(1, [Validators.min(1), Validators.required]),
    team_a: new FormControl<ITeam | null>(null, [Validators.required]),
    team_b: new FormControl<ITeam | null>(null, [Validators.required]),
    match_eesl_id: new FormControl<number | undefined>(undefined),
    matchMainSponsor: new FormControl<ISponsor | null>(null),
    matchSponsorLine: new FormControl<ISponsorLine | null>(null),
  });

  open: boolean = false;

  showDialog(open: boolean): void {
    this.open = open;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['matchWithFullData'] &&
      this.action === 'edit' &&
      this.matchWithFullData &&
      this.allSponsors &&
      this.allSponsorLines &&
      this.teams.length > 0
    ) {
      const item: IMatchWithFullData = this.matchWithFullData;

      const { match } = this.matchWithFullData;
      const team_a: ITeam | undefined = this.teams.find(
        (team) => team.id === match.team_a_id,
      );
      const team_b: ITeam | undefined = this.teams.find(
        (team) => team.id === match.team_b_id,
      );

      const matchSponsor: ISponsor | undefined = this.allSponsors.find(
        (sponsor: ISponsor) => sponsor.id === item.match.main_sponsor_id,
      );

      const matchSponsorLine: ISponsorLine | undefined =
        this.allSponsorLines.find(
          (sponsorLine: ISponsorLine) =>
            sponsorLine.id === item.match.sponsor_line_id,
        );

      if (team_a && team_b) {
        this.matchForm.setValue({
          id: match.id,
          match_date: this.dateTimeService.convertJsDateTime(
            new Date(match.match_date),
          ),
          week: match.week,
          team_a: team_a,
          team_b: team_b,
          match_eesl_id: match.match_eesl_id,
          matchMainSponsor: matchSponsor || null,
          matchSponsorLine: matchSponsorLine || null,
        });
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

  onSubmit(): void {
    if (this.matchForm.valid) {
      const formValue = this.matchForm.getRawValue();

      const tui_date = formValue.match_date!;
      const js_date = this.dateTimeService.convertTuiDateTime(tui_date);

      if (js_date) {
        let team_a_id = null;
        let team_b_id = null;

        if (formValue.team_a && !isNaN(formValue.team_a.id!)) {
          team_a_id = formValue.team_a.id;
        }

        if (formValue.team_b && !isNaN(formValue.team_b.id!)) {
          team_b_id = formValue.team_b.id;
        }

        if (team_a_id && team_b_id) {
          let data: IMatch = {
            id: this.matchForm.get('id')?.value,
            match_date: js_date,
            week: formValue.week!,
            team_a_id: team_a_id,
            team_b_id: team_b_id,
            tournament_id: this.tournamentId,
            match_eesl_id: formValue.match_eesl_id!,
            main_sponsor_id: formValue.matchMainSponsor?.id ?? null,
            sponsor_line_id: formValue.matchSponsorLine?.id ?? null,
          };

          if (this.action === 'add') {
            console.log('ADDDDD', data);
            this.match.createMatch(data);
            this.matchForm.reset();
          } else if (this.action === 'edit') {
            console.log(this.action);
            console.log('EDITTTTTTT', data);
            this.match.updateMatch(data);
          }
        }
      }
    }
  }

  protected readonly stringifyTitle = stringifyTitle;
}
