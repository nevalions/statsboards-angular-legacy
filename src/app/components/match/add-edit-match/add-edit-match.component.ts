import { Component, inject, Input, OnInit } from '@angular/core';
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
import { Observable, of } from 'rxjs';
import { ITeam } from '../../../type/team.type';
import { DateTimeService } from '../../../services/date-time.service';
import { SelectTeamComponent } from '../../../shared/ui/forms/select-team/select-team.component';

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
  ],
  templateUrl: './add-edit-match.component.html',
  styleUrl: './add-edit-match.component.less',
  providers: [
    tuiItemsHandlersProvider({
      stringify: (item: ITeam) => `${item.title}`,
    }),
  ],
})
export class AddEditMatchComponent implements OnInit {
  dateTimeService = inject(DateTimeService);
  @Input() addMatch!: (data: any) => void;
  @Input() tournamentId!: number;
  @Input() teams$: Observable<ITeam[]> = of([]);

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
    match_date: new FormControl(this.tui_current_date, [Validators.required]),
    week: new FormControl(1, [Validators.min(1), Validators.required]),
    team_a: new FormControl<ITeam | null>(null, [Validators.required]),
    team_b: new FormControl<ITeam | null>(null, [Validators.required]),
    match_eesl_id: new FormControl(undefined),
  });

  open: boolean = false;

  showDialog(): void {
    this.open = true;
  }

  ngOnInit() {}

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
          const data: IMatch = {
            match_date: js_date,
            week: formValue.week!,
            team_a_id: team_a_id,
            team_b_id: team_b_id,
            tournament_id: this.tournamentId,
            match_eesl_id: formValue.match_eesl_id!,
          };

          console.log(data);
          this.addMatch(data);
        }
      }
    }
  }
}
