import { Component, OnDestroy, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';

import { IMatchData } from '../../type/matchdata.type';

import { MatchData } from '../match/matchdata';
import { Match } from '../match/match';
import { AsyncPipe, NgIf } from '@angular/common';
import { IMatchFullDataWithScoreboard } from '../../type/match.type';
import { Websocket } from '../../store/websocket/websocket';
import { TuiLoaderModule } from '@taiga-ui/core';

@Component({
  selector: 'app-match-scoreboard-admin',
  standalone: true,
  imports: [AsyncPipe, TuiLoaderModule, NgIf],
  templateUrl: './match-scoreboard-admin.component.html',
  styleUrl: './match-scoreboard-admin.component.less',
})
export class MatchScoreboardAdminComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean> = this.Websocket.loading$;
  error$: Observable<any> = this.Websocket.error$;
  data$: Observable<IMatchFullDataWithScoreboard> = this.Websocket.data$;
  isMatchDataSubmitting$ = this.matchData.matchDataIsSubmitting$;

  downValue = '1st';
  distanceValue = ' & 10';

  constructor(
    private Websocket: Websocket,
    private match: Match,
    private matchData: MatchData,
  ) {
    match.loadCurrentMatch();
  }

  ngOnInit() {
    this.Websocket.connect();
  }

  ngOnDestroy() {
    this.Websocket.disconnect();
  }

  adjustScore(team: 'a' | 'b', amount: number) {
    return (matchData: IMatchData) => {
      if (!matchData) return;

      const currentScoreKey = team === 'a' ? 'score_team_a' : 'score_team_b';
      let currentScore = matchData[currentScoreKey];
      if (currentScore != null) {
        currentScore = Math.max(0, currentScore + amount);
        const newMatchData = { ...matchData, [currentScoreKey]: currentScore };
        this.matchData.updateMatchData(newMatchData);
      }
    };
  }

  updateScore(team: 'a' | 'b', inputValue: string) {
    return (matchData: IMatchData) => {
      if (!matchData) return;

      const score = Number(inputValue);
      if (score) {
        const scoreKey = team === 'a' ? 'score_team_a' : 'score_team_b';
        const updatedMatchData = { ...matchData, [scoreKey]: score };
        this.matchData.updateMatchData(updatedMatchData);
      }
    };
  }

  updateQuarter(matchData: IMatchData, selectedQuarter: string) {
    if (!matchData) return;

    const updatedMatchData = { ...matchData, qtr: selectedQuarter };
    this.matchData.updateMatchData(updatedMatchData);
  }

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

  toggleQuarterVisibility(matchData: IMatchFullDataWithScoreboard) {
    if (!matchData) return;
    const updatedMatchData = {
      ...matchData,
      is_qtr: !matchData.scoreboard_data?.is_qtr,
    };
    this.matchData.updateMatchData(updatedMatchData);
  }

  togglePlayClockVisibility(matchData: IMatchFullDataWithScoreboard) {
    if (!matchData) return;
    const updatedMatchData = {
      ...matchData,
      is_playclock: !matchData.scoreboard_data?.is_playclock,
    };
    this.matchData.updateMatchData(updatedMatchData);
  }

  toggleGameClockVisibility(matchData: IMatchFullDataWithScoreboard) {
    if (!matchData) return;
    const updatedMatchData = {
      ...matchData,
      is_time: !matchData.scoreboard_data?.is_time,
    };
    this.matchData.updateMatchData(updatedMatchData);
  }

  toggleDownAndDistanceVisibility(matchData: IMatchFullDataWithScoreboard) {
    if (!matchData) return;
    const updatedMatchData = {
      ...matchData,
      is_downdistance: !matchData.scoreboard_data?.is_downdistance,
    };
    this.matchData.updateMatchData(updatedMatchData);
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

  toggleAllFormsVisibility() {
    const allVisible = Object.values(this.formsVisibility).every(
      (value) => value,
    );
    Object.keys(this.formsVisibility).forEach(
      (formName) => (this.formsVisibility[formName] = !allVisible),
    );
  }
}
