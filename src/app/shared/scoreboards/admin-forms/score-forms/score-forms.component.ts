import { Component, Input } from '@angular/core';
import { IMatchData } from '../../../../type/matchdata.type';
import { MatchData } from '../../../../components/match/matchdata';
import { AsyncPipe, NgIf } from '@angular/common';
import { map, Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { Ui } from '../../../../store/ui/ui';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import { TuiButtonModule } from '@taiga-ui/core';

@Component({
  selector: 'app-score-forms',
  standalone: true,
  imports: [AsyncPipe, NgIf, ToggleVisibleButtonComponent, TuiButtonModule],
  templateUrl: './score-forms.component.html',
  styleUrl: './score-forms.component.less',
})
export class ScoreFormsComponent {
  @Input() scoreInputsVisible$!: Observable<boolean>;
  @Input() scoreButtonsVisible$!: Observable<boolean>;
  @Input() data!: IMatchFullDataWithScoreboard;
  @Input() disabled: boolean = false;

  constructor(private matchData: MatchData) {}

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
