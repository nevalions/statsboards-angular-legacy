import { Component, Input } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { IMatchData } from '../../../../type/matchdata.type';
import { MatchData } from '../../../../components/match/matchdata';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { AddSignPipe } from '../../../../pipes/add-sign.pipe';
import { TeamNamePipe } from '../../../../pipes/team-name.pipe';

@Component({
  selector: 'app-increment-button',
  standalone: true,
  imports: [TuiButtonModule, AddSignPipe, TeamNamePipe],
  templateUrl: './increment-button.component.html',
  styleUrl: './increment-button.component.less',
})
export class IncrementButtonComponent {
  @Input() score!: number;
  @Input() team!: 'a' | 'b';
  @Input() disabled: boolean = false;
  @Input() data!: IMatchFullDataWithScoreboard;

  constructor(private matchData: MatchData) {}

  adjustScore(team: 'a' | 'b', amount: number, matchData: IMatchData) {
    if (!matchData) return;

    const currentScoreKey = team === 'a' ? 'score_team_a' : 'score_team_b';
    let currentScore = matchData[currentScoreKey];
    if (currentScore != null) {
      currentScore = Math.max(0, currentScore + amount);
      const newMatchData = { ...matchData, [currentScoreKey]: currentScore };
      this.matchData.updateMatchData(newMatchData);
    }
  }
}
