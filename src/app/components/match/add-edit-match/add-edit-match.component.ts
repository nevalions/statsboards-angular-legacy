import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  TuiButtonModule,
  TuiDialogModule,
  TuiErrorModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiAutoFocusModule,
  TuiDay,
  TuiLetModule,
  TuiTime,
} from '@taiga-ui/cdk';
import {
  TuiAvatarModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputDateModule,
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiInputNumberModule,
  tuiItemsHandlersProvider,
  TuiSelectModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';
import { ITournament } from '../../../type/tournament.type';
import { IMatch, IMatchFullData } from '../../../type/match.type';
import { TournamentService } from '../../tournament/tournament.service';
import {
  combineLatest,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { ITeam, ITeamTournament } from '../../../type/team.type';
import { DateTimeService } from '../../../services/date-time.service';
import { SelectTeamComponent } from '../../../shared/ui/forms/select-team/select-team.component';
import { CreateButtonInFormComponent } from '../../../shared/ui/buttons/create-button-in-form/create-button-in-form.component';
import { CancelButtonInFormComponent } from '../../../shared/ui/buttons/cancel-button-in-form/cancel-button-in-form.component';
import { DialogService } from '../../../services/dialog.service';
import { MatchService } from '../match.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-add-edit-match',
  standalone: true,
  imports: [
    TuiButtonModule,
    AsyncPipe,
    ReactiveFormsModule,
    TuiAutoFocusModule,
    TuiDialogModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputModule,
    TuiTextareaModule,
    TuiInputNumberModule,
    TuiInputDateModule,
    TuiTextfieldControllerModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiLoaderModule,
    TuiLetModule,
    TuiAvatarModule,
    FormsModule,
    TuiInputDateTimeModule,
    SelectTeamComponent,
    CreateButtonInFormComponent,
    CancelButtonInFormComponent,
  ],
  templateUrl: './add-edit-match.component.html',
  styleUrl: './add-edit-match.component.less',
  providers: [
    tuiItemsHandlersProvider({
      stringify: (item: ITeam) => `${item.title}`,
    }),
  ],
})
export class AddEditMatchComponent implements OnInit, OnDestroy {
  dateTimeService = inject(DateTimeService);
  dialogService = inject(DialogService);
  private dialogSubscription: Subscription | undefined;

  @Input() action: string = 'add';
  @Input() dialogId: string = 'addDialog';

  @Input() editMatch: IMatch = {} as IMatch;
  @Input() match$: Observable<IMatchFullData> = of({} as IMatchFullData);

  @Input() tournamentId!: number;
  @Input() teams$: Observable<ITeam[]> = of([]);

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
  });

  open: boolean = false;

  showDialog(open: boolean): void {
    this.open = open;
  }

  private initForm(): void {
    this.match$
      .pipe(
        switchMap((match) =>
          this.teams$.pipe(
            take(1),
            tap((teams) => console.log('Teams Data Form: ', teams)), // log the teams data
            map((teams) => ({ match, teams })), // combine match and teams into a single object
          ),
        ),
      )
      .subscribe(({ match, teams }) => {
        if (this.action === 'edit' && match) {
          let team_a = teams.find((team) => team.id === match.match.team_a_id);
          let team_b = teams.find((team) => team.id === match.match.team_b_id);

          if (team_a && team_b) {
            console.log('Setting form values');
            this.matchForm.setValue({
              id: match.match.id,
              match_date: this.dateTimeService.convertJsDateTime(
                new Date(match.match.match_date),
              ),
              week: match.match.week,
              team_a: team_a,
              team_b: team_b,
              match_eesl_id: match.match.match_eesl_id,
            });
          }
        }
      });
  }

  ngOnInit(): void {
    console.log(this.dialogId);
    console.log(this.action);
    this.initForm();

    this.matchForm.valueChanges.subscribe((value) => console.log(value));

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
          };

          if (this.action === 'add') {
            console.log(data);
            this.addEvent.emit(data);
          } else if (this.action === 'edit') {
            this.editEvent.emit(data);
          }
        }
      }
    }
  }
}
