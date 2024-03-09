import { Component, Input } from '@angular/core';
import { IMatchData } from '../../../../type/matchdata.type';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { MatchData } from '../../../../components/match/matchdata';
import { AsyncPipe, NgIf } from '@angular/common';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';

@Component({
  selector: 'app-timeout-forms',
  standalone: true,
  imports: [AsyncPipe, NgIf, ToggleVisibleButtonComponent],
  templateUrl: './timeout-forms.component.html',
  styleUrl: './timeout-forms.component.less',
})
export class TimeoutFormsComponent {
  @Input() timeoutBtnsVisible$!: Observable<boolean>;
  @Input() data!: IMatchFullDataWithScoreboard;
  @Input() isMatchDataSubmitting$?: Observable<boolean>;

  constructor(private matchData: MatchData) {}

  updateTeamTimeout(team: 'a' | 'b', inputValue: string) {
    return (matchData: IMatchData) => {
      if (!matchData) return;

      if (inputValue) {
        const timeoutKey = team === 'a' ? 'timeout_team_a' : 'timeout_team_b';
        const updatedMatchData = { ...matchData, [timeoutKey]: inputValue };
        this.matchData.updateMatchData(updatedMatchData);
      }
    };
  }
}
