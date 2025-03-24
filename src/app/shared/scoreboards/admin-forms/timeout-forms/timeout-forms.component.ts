import { TuiLabel } from "@taiga-ui/core";
import { TuiTextfieldControllerModule } from "@taiga-ui/legacy";
import { Component, Input } from '@angular/core';
import { IMatchData } from '../../../../type/matchdata.type';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { MatchData } from '../../../../components/match/matchdata';
import { AsyncPipe, NgIf } from '@angular/common';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import { AdminTimeoutButtonComponent } from '../../../ui/buttons/admin-timeout-button/admin-timeout-button.component';
import { Websocket } from '../../../../store/websocket/websocket';

@Component({
  selector: 'app-timeout-forms',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    ToggleVisibleButtonComponent,
    TuiLabel,
    TuiTextfieldControllerModule,
    AdminTimeoutButtonComponent,
  ],
  templateUrl: './timeout-forms.component.html',
  styleUrl: './timeout-forms.component.less',
})
export class TimeoutFormsComponent {
  @Input() timeoutBtnsVisible$!: Observable<boolean>;
  @Input() data: IMatchFullDataWithScoreboard | undefined;
  @Input() disabled: boolean = false;

  constructor(
    private matchData: MatchData,
    private websocket: Websocket,
  ) {}

  updateTeamTimeout(team: 'a' | 'b', inputValue: string) {
    return (matchData: IMatchData) => {
      if (!matchData) return;
      this.websocket.checkConnection();

      if (inputValue) {
        const timeoutKey = team === 'a' ? 'timeout_team_a' : 'timeout_team_b';
        // const updatedMatchData = { ...matchData, [timeoutKey]: inputValue };
        // this.matchData.updateMatchData(updatedMatchData);
        this.matchData.updateMatchDataKeyValue(matchData.id!, {
          [timeoutKey]: inputValue,
        });
      }
    };
  }
}
