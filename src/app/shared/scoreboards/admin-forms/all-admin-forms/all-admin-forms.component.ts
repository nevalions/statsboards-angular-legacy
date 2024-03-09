import { Component, Input } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { IMatchData, IScoreboard } from '../../../../type/matchdata.type';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { MatchData } from '../../../../components/match/matchdata';
import { ScoreboardData } from '../../../../components/scoreboard-data/scoreboard-data';
import { ScoreFormsComponent } from '../score-forms/score-forms.component';
import { map, Observable } from 'rxjs';
import { Ui } from '../../../../store/ui/ui';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import { QtrFormsComponent } from '../qtr-forms/qtr-forms.component';
import { DownDistanceFormsComponent } from '../down-distance-forms/down-distance-forms.component';
import { TimeoutFormsComponent } from '../timeout-forms/timeout-forms.component';
import { TimeFormsComponent } from '../time-forms/time-forms.component';

@Component({
  selector: 'app-all-admin-forms',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    ScoreFormsComponent,
    ToggleVisibleButtonComponent,
    QtrFormsComponent,
    DownDistanceFormsComponent,
    TimeoutFormsComponent,
    TimeFormsComponent,
  ],
  templateUrl: './all-admin-forms.component.html',
  styleUrl: './all-admin-forms.component.less',
})
export class AllAdminFormsComponent {
  @Input() data!: IMatchFullDataWithScoreboard;
  isMatchDataSubmitting$ = this.matchData.matchDataIsSubmitting$;

  showHideAllButtonVisible$: Observable<boolean>;
  scoreInputsVisible$: Observable<boolean>;
  scoreButtonsVisible$: Observable<boolean>;
  qtrFormVisible$: Observable<boolean>;
  downAndDistanceFormVisible$: Observable<boolean>;
  timeoutBtnsVisible$: Observable<boolean>;
  timeFormsVisible$: Observable<boolean>;

  constructor(
    private matchData: MatchData,
    private scoreboardData: ScoreboardData,
    private ui: Ui,
  ) {
    this.showHideAllButtonVisible$ = this.ui.formVisibility$.pipe(
      map((formVisibility) => formVisibility['showHideAll']),
    );
    this.scoreInputsVisible$ = this.ui.formVisibility$.pipe(
      map((formVisibility) => formVisibility['scoreInputs']),
    );
    this.scoreButtonsVisible$ = this.ui.formVisibility$.pipe(
      map((formVisibility) => formVisibility['scoreButtons']),
    );
    this.qtrFormVisible$ = this.ui.formVisibility$.pipe(
      map((formVisibility) => formVisibility['qtrForm']),
    );
    this.downAndDistanceFormVisible$ = this.ui.formVisibility$.pipe(
      map((formVisibility) => formVisibility['downAndDistanceForm']),
    );
    this.timeoutBtnsVisible$ = this.ui.formVisibility$.pipe(
      map((formVisibility) => formVisibility['timeoutBtns']),
    );
    this.timeFormsVisible$ = this.ui.formVisibility$.pipe(
      map((formVisibility) => formVisibility['timeForms']),
    );
  }

  toggleAllFormsVisibility() {
    this.ui.toggleAllFormsVisibility();
  }

  formsVisibility: { [key: string]: boolean } = {
    showHideAll: true,
    scoreInputs: true,
    scoreButtons: true,
    qtrForm: true,
    downAndDistanceForm: true,
    timeoutBtns: true,
    timeForms: true,
    changeTeamsForms: true,
    changeScoreBoardForms: true,
  };

  toggleFormVisibility(formName: string) {
    this.formsVisibility[formName] = !this.formsVisibility[formName];
  }

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
