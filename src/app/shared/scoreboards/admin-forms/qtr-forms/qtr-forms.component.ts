import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { MatchData } from '../../../../components/match/matchdata';
import { IMatchData, IScoreboard } from '../../../../type/matchdata.type';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminSubmitButtonComponent } from '../../../ui/buttons/admin-submit-button/admin-submit-button.component';
import { TuiDataListWrapperModule, TuiSelectModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { ScoreboardData } from '../../../../components/scoreboard-data/scoreboard-data';

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
  isFlagAndGoalForm: FormGroup;

  items: string[] = ['1st', '2nd', 'HT', '3rd', '4th', 'Final', 'OT'];

  constructor(
    private matchData: MatchData,
    private scoreboardData: ScoreboardData,
  ) {
    this.qtrForm = this.initQtrForm();
    this.isFlagAndGoalForm = this.initFlagGoalForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.qtrForm = this.initQtrForm();
      this.isFlagAndGoalForm = this.initFlagGoalForm();
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

  private initFlagGoalForm(): FormGroup {
    return new FormGroup({
      isFlag: new FormControl<boolean | null | undefined>(
        this.data?.scoreboard_data?.is_flag,
      ),
      isTouchdownTeamA: new FormControl<boolean | null | undefined>(
        this.data?.scoreboard_data?.is_goal_team_a,
      ),
      isTouchdownTeamB: new FormControl<boolean | null | undefined>(
        this.data?.scoreboard_data?.is_goal_team_b,
      ),
    });
  }

  toggleFlag(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;

    if (this.isFlagAndGoalForm.valid) {
      const formValue = this.isFlagAndGoalForm.getRawValue();
      const isFlagged = formValue.isFlag;
      // console.log('FLAGED', isFlagged);
      if (isFlagged === true || isFlagged === false) {
        const updatedScoreboardData = {
          ...scoreboardData,
          is_flag: !isFlagged,
        };
        this.scoreboardData.updateScoreboardData(updatedScoreboardData);
      } else {
        const updatedScoreboardData = {
          ...scoreboardData,
          is_flag: false,
        };
        this.scoreboardData.updateScoreboardData(updatedScoreboardData);
      }
    }
  }

  toggleTouchdownTeamA(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;

    if (this.isFlagAndGoalForm.valid) {
      const formValue = this.isFlagAndGoalForm.getRawValue();
      const isTouchdownTeamA = formValue.isTouchdownTeamA;

      // console.log('TD', !isTouchdownTeamA);
      if (isTouchdownTeamA === true || isTouchdownTeamA === false) {
        const updatedScoreboardData = {
          ...scoreboardData,
          is_goal_team_a: !isTouchdownTeamA,
        };
        this.scoreboardData.updateScoreboardData(updatedScoreboardData);
      } else {
        const updatedScoreboardData = {
          ...scoreboardData,
          is_goal_team_a: true,
        };
        this.scoreboardData.updateScoreboardData(updatedScoreboardData);
      }
    }
  }

  toggleTouchdownTeamB(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;

    if (this.isFlagAndGoalForm.valid) {
      const formValue = this.isFlagAndGoalForm.getRawValue();
      const isTouchdownTeamB = formValue.isTouchdownTeamB;

      console.log('TD', !isTouchdownTeamB);
      if (isTouchdownTeamB === true || isTouchdownTeamB === false) {
        const updatedScoreboardData = {
          ...scoreboardData,
          is_goal_team_b: !isTouchdownTeamB,
        };
        this.scoreboardData.updateScoreboardData(updatedScoreboardData);
      } else {
        const updatedScoreboardData = {
          ...scoreboardData,
          is_goal_team_b: true,
        };
        this.scoreboardData.updateScoreboardData(updatedScoreboardData);
      }
    }
  }

  updateQuarter(matchData: IMatchData) {
    if (!matchData) return;

    if (this.qtrForm.valid) {
      const formValue = this.qtrForm.getRawValue();
      const qtr = formValue.qtrSelect;
      if (qtr) {
        const updatedMatchData = { ...matchData, qtr: qtr };
        this.matchData.updateMatchData(updatedMatchData);
      }
    }
  }
}
