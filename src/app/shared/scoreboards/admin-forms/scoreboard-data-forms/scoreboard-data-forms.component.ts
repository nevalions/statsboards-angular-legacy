import { Component, Input } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { MatchData } from '../../../../components/match/matchdata';
import { IScoreboard } from '../../../../type/matchdata.type';
import { ScoreboardData } from '../../../../components/scoreboard-data/scoreboard-data';

@Component({
  selector: 'app-scoreboard-data-forms',
  standalone: true,
  imports: [NgIf, ToggleVisibleButtonComponent, AsyncPipe],
  templateUrl: './scoreboard-data-forms.component.html',
  styleUrl: './scoreboard-data-forms.component.less',
})
export class ScoreboardDataFormsComponent {
  @Input() changeScoreBoardFormsVisible$!: Observable<boolean>;
  @Input() data!: IMatchFullDataWithScoreboard;
  @Input() isMatchDataSubmitting$?: Observable<boolean>;

  constructor(private scoreboardData: ScoreboardData) {}

  toggleQuarterVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    const updatedScoreboardData = {
      ...scoreboardData,
      is_qtr: !scoreboardData.is_qtr,
    };
    this.scoreboardData.updateScoreboardData(updatedScoreboardData);
  }

  togglePlayClockVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    const updatedScoreboardData = {
      ...scoreboardData,
      is_playclock: !scoreboardData.is_playclock,
    };
    this.scoreboardData.updateScoreboardData(updatedScoreboardData);
  }

  toggleGameClockVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    const updatedScoreboardData = {
      ...scoreboardData,
      is_time: !scoreboardData.is_time,
    };
    this.scoreboardData.updateScoreboardData(updatedScoreboardData);
  }

  toggleDownAndDistanceVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    const updatedScoreboardData = {
      ...scoreboardData,
      is_downdistance: !scoreboardData.is_downdistance,
    };
    this.scoreboardData.updateScoreboardData(updatedScoreboardData);
  }

  updateTeamColor(team: 'a' | 'b', inputValue: string) {
    return (scoreboardData: IScoreboard) => {
      if (!scoreboardData) return;
      console.log(scoreboardData);

      if (inputValue) {
        console.log(inputValue);
        const colortKey = team === 'a' ? 'team_a_color' : 'team_b_color';
        const updatedScoreboardData = {
          ...scoreboardData,
          [colortKey]: inputValue,
        };
        console.log(updatedScoreboardData);
        this.scoreboardData.updateScoreboardData(updatedScoreboardData);
      }
    };
  }
}
