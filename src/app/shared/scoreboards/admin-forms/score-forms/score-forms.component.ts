import { Component, Input } from '@angular/core';
import { IMatchData } from '../../../../type/matchdata.type';
import { MatchData } from '../../../../components/match/matchdata';
import { AsyncPipe, NgIf } from '@angular/common';
import { map, Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { Ui } from '../../../../store/ui/ui';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';

@Component({
  selector: 'app-score-forms',
  standalone: true,
  imports: [AsyncPipe, NgIf, ToggleVisibleButtonComponent],
  templateUrl: './score-forms.component.html',
  styleUrl: './score-forms.component.less',
})
export class ScoreFormsComponent {
  @Input() scoreInputsVisible$!: Observable<boolean>;
  @Input() scoreButtonsVisible$!: Observable<boolean>;
  // @Input() scoreInputsVisible: boolean = true;
  // @Input() scoreButtonsVisible: boolean = true;
  @Input() data!: IMatchFullDataWithScoreboard;
  isMatchDataSubmitting$?: Observable<boolean>;

  constructor(private matchData: MatchData) {}

  // toggleItemVisibility(formName: string) {
  //   this.ui.toggleFormVisibility(formName);
  // }
  //
  // toggleAllFormsVisibility() {
  //   this.ui.toggleAllFormsVisibility();
  // }

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
