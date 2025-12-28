import { TuiInputModule } from "@taiga-ui/legacy";
import { AsyncPipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ScoreboardData } from '../../../../components/scoreboard-data/scoreboard-data';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { IScoreboard } from '../../../../type/matchdata.type';
import { AdminDownButtonComponent } from '../../../ui/buttons/admin-down-button/admin-down-button.component';
import { AdminSubmitButtonComponent } from '../../../ui/buttons/admin-submit-button/admin-submit-button.component';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import { DownDistanceFormsComponent } from '../down-distance-forms/down-distance-forms.component';
import { Websocket } from '../../../../store/websocket/websocket';

@Component({
  selector: 'app-scoreboard-data-forms',
  standalone: true,
  imports: [
    ToggleVisibleButtonComponent,
    AsyncPipe,
    DownDistanceFormsComponent,
    AdminDownButtonComponent,
    AdminSubmitButtonComponent,
    TuiInputModule,
    ReactiveFormsModule
],
  templateUrl: './scoreboard-data-forms.component.html',
  styleUrl: './scoreboard-data-forms.component.less',
})
export class ScoreboardDataFormsComponent implements OnChanges {
  @Input() changeScoreBoardFormsVisible$!: Observable<boolean>;
  @Input() data: IMatchFullDataWithScoreboard | undefined;
  @Input() isMatchDataSubmitting$?: Observable<boolean>;
  @Input() disabled: boolean = false;

  teamColorForm: FormGroup;

  constructor(
    private scoreboardData: ScoreboardData,
    private websocket: Websocket,
  ) {
    this.teamColorForm = this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.teamColorForm = this.initForm();
    }
    if (changes['disabled']) {
      if (this.disabled) {
        this.teamColorForm.disable();
      } else {
        this.teamColorForm.enable();
      }
    }
  }

  private initForm(): FormGroup {
    return new FormGroup({
      colorTeamA: new FormControl<string | null | undefined>(
        this.data?.scoreboard_data?.team_a_game_color,
      ),
      colorTeamB: new FormControl<string | null | undefined>(
        this.data?.scoreboard_data?.team_b_game_color,
      ),
    });
  }

  toggleQuarterVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();
    // const updatedScoreboardData = {
    //   ...scoreboardData,
    //   is_qtr: !scoreboardData.is_qtr,
    // };
    // this.scoreboardData.updateScoreboardData(updatedScoreboardData);
    this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
      is_qtr: !scoreboardData.is_qtr,
    });
  }

  togglePlayClockVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();
    // const updatedScoreboardData = {
    //   ...scoreboardData,
    //   is_playclock: !scoreboardData.is_playclock,
    // };
    // this.scoreboardData.updateScoreboardData(updatedScoreboardData);
    this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
      is_playclock: !scoreboardData.is_playclock,
    });
  }

  toggleGameClockVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();
    // const updatedScoreboardData = {
    //   ...scoreboardData,
    //   is_time: !scoreboardData.is_time,
    // };
    // this.scoreboardData.updateScoreboardData(updatedScoreboardData);
    this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
      is_time: !scoreboardData.is_time,
    });
  }

  toggleDownAndDistanceVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();
    // const updatedScoreboardData = {
    //   ...scoreboardData,
    //   is_downdistance: !scoreboardData.is_downdistance,
    // };
    // this.scoreboardData.updateScoreboardData(updatedScoreboardData);
    this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
      is_downdistance: !scoreboardData.is_downdistance,
    });
  }

  updateTeamColor(team: 'a' | 'b', scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();
    // console.log(scoreboardData);

    if (this.teamColorForm.valid) {
      const formValue = this.teamColorForm.getRawValue();
      const colorTeamA = formValue.colorTeamA;
      const colorTeamB = formValue.colorTeamB;

      if (colorTeamA && team === 'a') {
        // console.log(inputValue);
        const colorKey = 'team_a_game_color';
        // const updatedScoreboardData = {
        //   ...scoreboardData,
        //   [colorKey]: colorTeamA,
        // };
        // console.log(updatedScoreboardData);
        // this.scoreboardData.updateScoreboardData(updatedScoreboardData);
        this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
          [colorKey]: colorTeamA,
        });
      }

      if (colorTeamB && team === 'b') {
        // console.log(inputValue);
        const colorKey = 'team_b_game_color';
        // const updatedScoreboardData = {
        //   ...scoreboardData,
        //   [colorKey]: colorTeamB,
        // };
        // console.log(updatedScoreboardData);
        // this.scoreboardData.updateScoreboardData(updatedScoreboardData);
        this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
          [colorKey]: colorTeamB,
        });
      }
    }
  }
}
