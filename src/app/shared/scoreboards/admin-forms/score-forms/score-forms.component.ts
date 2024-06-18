import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { IMatchData } from '../../../../type/matchdata.type';
import { MatchData } from '../../../../components/match/matchdata';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputNumberModule,
  tuiInputNumberOptionsProvider,
} from '@taiga-ui/kit';
import { IncrementButtonComponent } from '../../../ui/buttons/increment-button/increment-button.component';
import { AdminSubmitButtonComponent } from '../../../ui/buttons/admin-submit-button/admin-submit-button.component';
import { Websocket } from '../../../../store/websocket/websocket';

@Component({
  selector: 'app-score-forms',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    ToggleVisibleButtonComponent,
    TuiButtonModule,
    ReactiveFormsModule,
    TuiInputNumberModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiTextfieldControllerModule,
    IncrementButtonComponent,
    AdminSubmitButtonComponent,
    TuiInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiInputNumberOptionsProvider({
      decimal: 'never',
      step: 1,
      min: 0,
    }),
  ],
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
}
