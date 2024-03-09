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

@Component({
  selector: 'app-all-admin-forms',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    ScoreFormsComponent,
    ToggleVisibleButtonComponent,
    QtrFormsComponent,
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

  downValue = '1st';
  distanceValue = ' & 10';

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

  // updateQuarter(matchData: IMatchData, selectedQuarter: string) {
  //   if (!matchData) return;
  //
  //   const updatedMatchData = { ...matchData, qtr: selectedQuarter };
  //   this.matchData.updateMatchData(updatedMatchData);
  // }

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

  updateDownAndDistance(matchData: IMatchData, downAndDistance: string) {
    if (!matchData) return;

    let down = '';
    let distance = '';

    // Check if downAndDistance is one of the single-value options
    const singleValueOptions = ['1PT', '2PT', 'FG', 'KickOff'];
    if (singleValueOptions.includes(downAndDistance)) {
      distance = downAndDistance;
    } else {
      // The input is expected to have both down and distance
      [down, distance] = downAndDistance.split(' & ');

      if (distance && distance.startsWith(' & ')) {
        distance = distance.slice(3);
      }
    }

    const updatedMatchData = {
      ...matchData,
      down: down,
      distance: distance || '', // use an empty string if distance is undefined
    };

    this.matchData.updateMatchData(updatedMatchData);
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

  getMinutes(seconds: number): string {
    if (seconds === undefined) {
      return '--';
    } else {
      return Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
    }
  }

  getSeconds(seconds: number): string {
    if (seconds === undefined) {
      return '--';
    } else {
      return (seconds % 60).toString().padStart(2, '0');
    }
  }

  getPlayClockSeconds(seconds: number): string {
    if (seconds === undefined) {
      return '';
    } else {
      return (seconds % 60).toString().padStart(1, '0');
    }
  }
}
