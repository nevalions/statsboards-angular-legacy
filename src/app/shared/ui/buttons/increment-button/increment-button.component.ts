import { TuiButton } from "@taiga-ui/core";
import { Component, Input, inject } from '@angular/core';
import { IMatchData } from '../../../../type/matchdata.type';
import { MatchData } from '../../../../components/match/matchdata';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { AddSignPipe } from '../../../../pipes/add-sign.pipe';
import { TeamNamePipe } from '../../../../pipes/team-name.pipe';
import { Websocket } from '../../../../store/websocket/websocket';

@Component({
  selector: 'app-increment-button',
  standalone: true,
  imports: [TuiButton, AddSignPipe, TeamNamePipe],
  templateUrl: './increment-button.component.html',
  styleUrl: './increment-button.component.less',
})
export class IncrementButtonComponent {
  private matchData = inject(MatchData);
  private websocket = inject(Websocket);

  @Input() score!: number;
  @Input() team!: 'a' | 'b';
  @Input() disabled: boolean = false;
  @Input() data!: IMatchFullDataWithScoreboard;

  adjustScore(team: 'a' | 'b', amount: number, matchData: IMatchData) {
    if (!matchData) return;
    this.websocket.checkConnection();

    const currentScoreKey = team === 'a' ? 'score_team_a' : 'score_team_b';
    let currentScore = matchData[currentScoreKey];
    if (currentScore != null) {
      currentScore = Math.max(0, currentScore + amount);
      // const newMatchData = { ...matchData, [currentScoreKey]: currentScore };
      // this.matchData.updateMatchData(newMatchData);
      this.matchData.updateMatchDataKeyValue(matchData.id!, {
        [currentScoreKey]: currentScore,
      });
    }
  }
}
