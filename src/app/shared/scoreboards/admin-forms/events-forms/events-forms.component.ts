import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { IFootballEventWithPlayers } from '../../../../type/football-event.type';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import {
  AsyncPipe,
  DecimalPipe,
  NgIf,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import { IPlayerInMatchFullData } from '../../../../type/player.type';
import { AddEditFootballEventTableComponent } from '../../../../components/match-event/football-event/add-edit-football-event-table/add-edit-football-event-table.component';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { AdminSubmitButtonComponent } from '../../../ui/buttons/admin-submit-button/admin-submit-button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiErrorModule } from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiInputNumberModule } from '@taiga-ui/kit';
import { IMatchData } from '../../../../type/matchdata.type';
import { Websocket } from '../../../../store/websocket/websocket';
import { MatchData } from '../../../../components/match/matchdata';
import { FootballEvent } from '../../../../components/match-event/football-event/football-event';
import { SimpleInputWithButtonsComponent } from '../simple-input-with-buttons/simple-input-with-buttons.component';
import { getFormControl } from '../../../../base/formHelpers';
import { SimpleFootballMatchTeamStatsComponent } from '../../../ui/events/football-stats/simple-football-match-team-stats/simple-football-match-team-stats.component';
import { SimpleFootballQbStatsComponent } from '../../../ui/events/football-stats/simple-football-qb-stats/simple-football-qb-stats.component';
import { SimpleFootballOffenceStatsComponent } from '../../../ui/events/football-stats/simple-football-offence-stats/simple-football-offence-stats.component';

@Component({
  selector: 'app-events-forms',
  standalone: true,
  imports: [
    ToggleVisibleButtonComponent,
    AsyncPipe,
    NgIf,
    AddEditFootballEventTableComponent,
    AdminSubmitButtonComponent,
    ReactiveFormsModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputNumberModule,
    UpperCasePipe,
    TitleCasePipe,
    DecimalPipe,
    SimpleInputWithButtonsComponent,
    SimpleFootballMatchTeamStatsComponent,
    SimpleFootballQbStatsComponent,
    SimpleFootballOffenceStatsComponent,
  ],
  templateUrl: './events-forms.component.html',
  styleUrl: './events-forms.component.less',
})
export class EventsFormsComponent implements OnChanges {
  @Input() data: IMatchFullDataWithScoreboard | undefined;

  @Input() eventsFormsVisible$!: Observable<boolean>;
  @Input() events: IFootballEventWithPlayers[] | null = [];
  @Input() disabled: boolean = false;

  @Input() homePlayersInMatch: IPlayerInMatchFullData[] | null = [];
  @Input() awayPlayersInMatch: IPlayerInMatchFullData[] | null = [];

  runDistanceForTeamA$ = this.footballEvent.runDistanceForTeamA$;
  runDistanceForTeamB$ = this.footballEvent.runDistanceForTeamB$;
  passDistanceForTeamA$ = this.footballEvent.passDistanceForTeamA$;
  passDistanceForTeamB$ = this.footballEvent.passDistanceForTeamB$;
  offenceDistanceForTeamA$ = this.footballEvent.overallOffenceDistanceForTeamA$;
  offenceDistanceForTeamB$ = this.footballEvent.overallOffenceDistanceForTeamB$;
  flagYardsTeamA$ = this.footballEvent.flagYardsTeamA$;
  flagYardsTeamB$ = this.footballEvent.flagYardsTeamB$;
  allQuarterbacksTeamA$ = this.footballEvent.allQuarterbacksTeamA$;
  allQuarterbacksTeamB$ = this.footballEvent.allQuarterbacksTeamB$;
  allOffenceTeamA$ = this.footballEvent.allOffenceTeamA$;
  allOffenceTeamB$ = this.footballEvent.allOffenceTeamB$;

  fieldForm: FormGroup;

  constructor(
    private websocket: Websocket,
    private matchData: MatchData,
    private footballEvent: FootballEvent,
  ) {
    this.fieldForm = this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['events']) {
    }
    if (changes['data']) {
      this.fieldForm = this.initForm();
    }
    if (changes['disabled']) {
      if (this.disabled) {
        this.fieldForm.disable();
      } else {
        this.fieldForm.enable();
      }
    }
  }

  private initForm(): FormGroup {
    return new FormGroup({
      fieldLength: new FormControl<number | null | undefined>(
        this.data?.match_data?.field_length,
        Validators.min(80),
      ),
    });
  }

  updateFieldLength(matchData: IMatchData) {
    if (!matchData) return;

    if (this.fieldForm.valid) {
      const formValue = this.fieldForm.getRawValue();
      const fieldLength = Number(formValue.fieldLength);
      this.websocket.checkConnection();

      if (fieldLength) {
        this.matchData.updateMatchDataKeyValue(matchData.id!, {
          field_length: fieldLength,
        });
      }
    }
  }

  protected readonly getFormControl = getFormControl;
}
