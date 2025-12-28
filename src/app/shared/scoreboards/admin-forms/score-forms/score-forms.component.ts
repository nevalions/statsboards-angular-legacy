import { TuiTextfieldControllerModule, TuiInputModule, TuiInputNumberModule } from "@taiga-ui/legacy";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IMatchData } from '../../../../type/matchdata.type';
import { MatchData } from '../../../../components/match/matchdata';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import { TuiError, TuiButton } from '@taiga-ui/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiFieldErrorPipe, TuiFieldErrorContentPipe } from '@taiga-ui/kit';
import { IncrementButtonComponent } from '../../../ui/buttons/increment-button/increment-button.component';
import { AdminSubmitButtonComponent } from '../../../ui/buttons/admin-submit-button/admin-submit-button.component';
import { Websocket } from '../../../../store/websocket/websocket';
import {
  eventBallOnKey,
  eventQtrKey,
  getEventBallOn,
} from '../../../../components/match-event/football-event/football-event-helpers';
import { InputNumberWithButtonsComponent } from '../input-number-with-buttons/input-number-with-buttons.component';
import {
  incrementNumberInFormGroup,
  incrementBallPositionRelativeCenter,
  onBallOnChange,
} from '../../../../components/match-event/football-event/football-event-on-change-helpers';
import { getFormControl, getFormDataByKey } from '../../../../base/formHelpers';
import { SimpleInputWithButtonsComponent } from '../simple-input-with-buttons/simple-input-with-buttons.component';

@Component({
  selector: 'app-score-forms',
  standalone: true,
  imports: [
    AsyncPipe,
    ToggleVisibleButtonComponent,
    TuiButton,
    ReactiveFormsModule,
    TuiInputNumberModule,
    TuiError,
    TuiFieldErrorPipe,
    TuiFieldErrorContentPipe,
    TuiTextfieldControllerModule,
    IncrementButtonComponent,
    AdminSubmitButtonComponent,
    TuiInputModule,
    InputNumberWithButtonsComponent,
    UpperCasePipe,
    SimpleInputWithButtonsComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // providers: [
  //   tuiInputNumberOptionsProvider({
  //     decimal: 'never',
  //     step: 1,
  //     min: 0,
  //   }),
  // ],
  templateUrl: './score-forms.component.html',
  styleUrl: './score-forms.component.less',
})
export class ScoreFormsComponent implements OnChanges {
  @Input() scoreInputsVisible$!: Observable<boolean>;
  @Input() scoreButtonsVisible$!: Observable<boolean>;
  @Input() data: IMatchFullDataWithScoreboard | undefined;
  @Input() disabled: boolean = false;

  scoreForm: FormGroup;

  constructor(
    private websocket: Websocket,
    private matchData: MatchData,
  ) {
    this.scoreForm = this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.scoreForm = this.initForm();
    }
    if (changes['disabled']) {
      if (this.disabled) {
        this.scoreForm.disable();
      } else {
        this.scoreForm.enable();
      }
    }
  }

  private initForm(): FormGroup {
    return new FormGroup({
      scoreTeamA: new FormControl<number | null | undefined>(
        this.data?.match_data?.score_team_a,
        Validators.min(0),
      ),
      scoreTeamB: new FormControl<number | null | undefined>(
        this.data?.match_data?.score_team_b,
        Validators.min(0),
      ),
    });
  }

  updateScoreTeam(team: string, matchData: IMatchData) {
    if (!matchData) return;

    if (this.scoreForm.valid) {
      const formValue = this.scoreForm.getRawValue();
      const scoreA = Number(formValue.scoreTeamA);
      const scoreB = Number(formValue.scoreTeamB);
      this.websocket.checkConnection();

      if (scoreA >= 0 && team == 'a') {
        // const updatedMatchData = { ...matchData, score_team_a: scoreA };
        // this.matchData.updateMatchData(updatedMatchData);
        this.matchData.updateMatchDataKeyValue(matchData.id!, {
          score_team_a: scoreA,
        });
      }

      if (scoreB >= 0 && team == 'b') {
        // const updatedMatchData = { ...matchData, score_team_b: scoreB };
        // this.matchData.updateMatchData(updatedMatchData);
        this.matchData.updateMatchDataKeyValue(matchData.id!, {
          score_team_b: scoreB,
        });
      }
    }
  }

  protected readonly eventQtrKey = eventQtrKey;
  protected readonly getBallOn = getEventBallOn;
  protected readonly onBallOnChange = onBallOnChange;
  protected readonly incrementOnBall = incrementBallPositionRelativeCenter;
  protected readonly eventBallOnKey = eventBallOnKey;
  protected readonly getFormDataByKey = getFormDataByKey;
  protected readonly incrementNumberInFormGroup = incrementNumberInFormGroup;
  protected readonly getFormControl = getFormControl;
}
