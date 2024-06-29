import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { MatchData } from '../../../../components/match/matchdata';
import { IMatchData, IScoreboard } from '../../../../type/matchdata.type';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdminSubmitButtonComponent } from '../../../ui/buttons/admin-submit-button/admin-submit-button.component';
import { TuiDataListWrapperModule, TuiSelectModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { ScoreboardData } from '../../../../components/scoreboard-data/scoreboard-data';
import { Websocket } from '../../../../store/websocket/websocket';

@Component({
  selector: 'app-qtr-forms',
  standalone: true,
  imports: [
    NgIf,
    ToggleVisibleButtonComponent,
    AsyncPipe,
    AdminSubmitButtonComponent,
    ReactiveFormsModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiButtonModule,
  ],
  templateUrl: './qtr-forms.component.html',
  styleUrl: './qtr-forms.component.less',
})
export class QtrFormsComponent implements OnChanges {
  @Input() qtrFormsVisible$!: Observable<boolean>;
  @Input() data: IMatchFullDataWithScoreboard | undefined;
  @Input() disabled: boolean = false;

  qtrForm: FormGroup;
  isGoalForm: FormGroup;
  isTimeoutForm: FormGroup;

  // items: string[] = ['1st', '2nd', 'HT', '3rd', '4th', 'Final', 'OT'];
  items: string[] = ['1', '2', '', '3', '4', '', 'ОТ'];

  constructor(
    private matchData: MatchData,
    private scoreboardData: ScoreboardData,
    private websocket: Websocket,
  ) {
    this.qtrForm = this.initQtrForm();
    this.isGoalForm = this.initGoalForm();
    this.isTimeoutForm = this.initTimeoutForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.qtrForm = this.initQtrForm();
      this.isGoalForm = this.initGoalForm();
      this.isTimeoutForm = this.initTimeoutForm();
    }
    if (changes['disabled']) {
      if (this.disabled) {
        this.qtrForm.disable();
      } else {
        this.qtrForm.enable();
      }
    }
  }

  private initQtrForm(): FormGroup {
    return new FormGroup({
      qtrSelect: new FormControl<string | null | undefined>(
        this.data?.match_data?.qtr,
      ),
    });
  }

  private initGoalForm(): FormGroup {
    return new FormGroup({
      // isFlag: new FormControl<boolean | null | undefined>(
      //   this.data?.scoreboard_data?.is_flag,
      // ),
      isTouchdownTeamA: new FormControl<boolean | null | undefined>(
        this.data?.scoreboard_data?.is_goal_team_a,
      ),
      isTouchdownTeamB: new FormControl<boolean | null | undefined>(
        this.data?.scoreboard_data?.is_goal_team_b,
      ),
    });
  }

  private initTimeoutForm(): FormGroup {
    return new FormGroup({
      isTimeoutTeamA: new FormControl<boolean | null | undefined>(
        this.data?.scoreboard_data?.is_timeout_team_a,
      ),
      isTimeoutTeamB: new FormControl<boolean | null | undefined>(
        this.data?.scoreboard_data?.is_timeout_team_b,
      ),
    });
  }

  toggleTouchdownTeamA(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;

    if (this.isGoalForm.valid) {
      const formValue = this.isGoalForm.getRawValue();
      const isTouchdownTeamA = formValue.isTouchdownTeamA;
      this.websocket.checkConnection();
      // console.log('TD', !isTouchdownTeamA);
      if (isTouchdownTeamA === true || isTouchdownTeamA === false) {
        if (this.data?.scoreboard_data?.is_goal_team_a) {
          this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
            is_goal_team_a: false,
            is_timeout_team_a: false,
          });
        } else {
          this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
            is_goal_team_a: true,
            is_timeout_team_a: false,
          });
        }
      } else {
        this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
          is_goal_team_a: false,
        });
      }
    }
  }

  toggleTouchdownTeamB(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;

    if (this.isGoalForm.valid) {
      const formValue = this.isGoalForm.getRawValue();
      const isTouchdownTeamB = formValue.isTouchdownTeamB;
      this.websocket.checkConnection();

      // console.log('TD', !isTouchdownTeamB);
      if (isTouchdownTeamB === true || isTouchdownTeamB === false) {
        if (this.data?.scoreboard_data?.is_goal_team_b) {
          this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
            is_goal_team_b: false,
            is_timeout_team_b: false,
          });
        } else {
          this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
            is_goal_team_b: true,
            is_timeout_team_b: false,
          });
        }
      } else {
        this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
          is_goal_team_b: false,
        });
      }
    }
  }

  toggleTimeoutTeamA(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;

    if (this.isTimeoutForm.valid) {
      const formValue = this.isTimeoutForm.getRawValue();
      const isTimoutTeamA = formValue.isTimeoutTeamA;
      this.websocket.checkConnection();

      // console.log('Timeout S', isTimoutTeamA);
      if (isTimoutTeamA === true || isTimoutTeamA === false) {
        if (this.data?.scoreboard_data?.is_timeout_team_a === true) {
          this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
            is_timeout_team_a: false,
            is_goal_team_a: false,
          });
        } else {
          this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
            is_timeout_team_a: true,
            is_goal_team_a: false,
          });
        }
      } else {
        this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
          is_timeout_team_a: false,
        });
      }
    }
  }

  toggleTimeoutTeamB(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;

    if (this.isTimeoutForm.valid) {
      const formValue = this.isTimeoutForm.getRawValue();
      const isTimoutTeamB = formValue.isTimeoutTeamB;
      this.websocket.checkConnection();

      // console.log('Timeout B', isTimoutTeamB);
      if (isTimoutTeamB === true || isTimoutTeamB === false) {
        if (this.data?.scoreboard_data?.is_timeout_team_b) {
          this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
            is_timeout_team_b: false,
            is_goal_team_b: false,
          });
        } else {
          this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
            is_timeout_team_b: true,
            is_goal_team_b: false,
          });
        }
      } else {
        this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
          is_timeout_team_b: false,
        });
      }
    }
  }

  updateQuarter(matchData: IMatchData) {
    if (!matchData) return;

    if (this.qtrForm.valid) {
      const formValue = this.qtrForm.getRawValue();
      const qtr = formValue.qtrSelect;
      this.websocket.checkConnection();
      if (qtr) {
        // const updatedMatchData = { ...matchData, qtr: qtr };
        // this.matchData.updateMatchData(updatedMatchData);
        this.matchData.updateMatchDataKeyValue(matchData.id!, {
          qtr: qtr,
        });
      }
    }
  }
}
