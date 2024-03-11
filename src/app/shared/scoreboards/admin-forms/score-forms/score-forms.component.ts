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
  TuiInputNumberModule,
  tuiInputNumberOptionsProvider,
} from '@taiga-ui/kit';

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
  @Input() data!: IMatchFullDataWithScoreboard;
  @Input() disabled: boolean = false;

  scoreForm: FormGroup;

  constructor(private matchData: MatchData) {
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

  adjustScore(team: 'a' | 'b', amount: number) {
    return (matchData: IMatchData) => {
      if (!matchData) return;

      const currentScoreKey = team === 'a' ? 'score_team_a' : 'score_team_b';
      let currentScore = matchData[currentScoreKey];
      if (currentScore != null) {
        currentScore = Math.max(0, currentScore + amount);
        const newMatchData = { ...matchData, [currentScoreKey]: currentScore };
        this.matchData.updateMatchData(newMatchData);
      }
    };
  }

  updateScoreTeamA(matchData: IMatchData) {
    if (!matchData) return;

    if (this.scoreForm.valid) {
      const formValue = this.scoreForm.getRawValue();
      const score = Number(formValue.scoreTeamA);

      if (score >= 0) {
        const updatedMatchData = { ...matchData, score_team_a: score };
        this.matchData.updateMatchData(updatedMatchData);
      }
    }
  }

  updateScore(team: 'a' | 'b', inputValue: string) {
    return (matchData: IMatchData) => {
      if (!matchData) return;

      const score = Number(inputValue);
      if (score) {
        const scoreKey = team === 'a' ? 'score_team_a' : 'score_team_b';
        const updatedMatchData = { ...matchData, [scoreKey]: score };
        this.matchData.updateMatchData(updatedMatchData);
      }
    };
  }
}
