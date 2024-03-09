import { Component, Input } from '@angular/core';
import { IMatchData } from '../../../../type/matchdata.type';
import { MatchData } from '../../../../components/match/matchdata';
import { AsyncPipe, NgIf } from '@angular/common';
import { map, Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { Ui } from '../../../../store/ui/ui';

@Component({
  selector: 'app-score-forms',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  templateUrl: './score-forms.component.html',
  styleUrl: './score-forms.component.less',
})
export class ScoreFormsComponent {
  scoreInputsVisible$: Observable<boolean>;
  scoreButtonsVisible$: Observable<boolean>;
  @Input() data!: IMatchFullDataWithScoreboard;
  isMatchDataSubmitting$?: Observable<boolean>;

  constructor(
    private ui: Ui,
    private matchData: MatchData,
  ) {
    this.scoreInputsVisible$ = this.ui.formVisibility$.pipe(
      map((formVisibility) => formVisibility['scoreInputs']),
    );
    this.scoreButtonsVisible$ = this.ui.formVisibility$.pipe(
      map((formVisibility) => formVisibility['scoreButtons']),
    );
  }

  toggleItemVisibility(formName: string) {
    this.ui.toggleFormVisibility(formName);
  }

  toggleAllFormsVisibility() {
    this.ui.toggleAllFormsVisibility();
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
