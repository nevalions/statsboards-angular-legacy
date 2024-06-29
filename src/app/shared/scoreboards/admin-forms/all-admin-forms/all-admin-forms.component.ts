import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TuiDropdownHostModule } from '@taiga-ui/cdk';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiArrowModule } from '@taiga-ui/kit';
import { map, Observable } from 'rxjs';
import { MatchData } from '../../../../components/match/matchdata';
import { Ui } from '../../../../store/ui/ui';
import { IGameclock } from '../../../../type/gameclock.type';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { IPlayclock } from '../../../../type/playclock.type';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import { ChangeTeamsFormsComponent } from '../change-teams-forms/change-teams-forms.component';
import { DownDistanceFormsComponent } from '../down-distance-forms/down-distance-forms.component';
import { MainSponsorFormsComponent } from '../main-sponsor-forms/main-sponsor-forms.component';
import { QtrFormsComponent } from '../qtr-forms/qtr-forms.component';
import { RosterFormsComponent } from '../roster-forms/roster-forms.component';
import { ScoreFormsComponent } from '../score-forms/score-forms.component';
import { ScoreboardDataFormsComponent } from '../scoreboard-data-forms/scoreboard-data-forms.component';
import { TimeFormsComponent } from '../time-forms/time-forms.component';
import { TimeoutFormsComponent } from '../timeout-forms/timeout-forms.component';
import { EventsFormsComponent } from '../events-forms/events-forms.component';
import { PlayerInMatch } from '../../../../components/player-match/player-match';
import { IPlayerInMatchFullData } from '../../../../type/player.type';

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
    ChangeTeamsFormsComponent,
    ScoreboardDataFormsComponent,
    RosterFormsComponent,
    TuiButtonModule,
    TuiArrowModule,
    TuiDropdownHostModule,
    MainSponsorFormsComponent,
    EventsFormsComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './all-admin-forms.component.html',
  styleUrl: './all-admin-forms.component.less',
})
export class AllAdminFormsComponent {
  @Input() data: IMatchFullDataWithScoreboard | undefined;
  @Input() playclock: IPlayclock | undefined;
  @Input() gameclock: IGameclock | undefined;
  isMatchDataSubmitting$ = this.matchData.matchDataIsSubmitting$;
  isMatchDataLoading$ = this.matchData.matchDataIsLoading$;
  //TODO is clock loading and submitting

  showHideAllButtonVisible$: Observable<boolean>;
  scoreInputsVisible$: Observable<boolean>;
  scoreButtonsVisible$: Observable<boolean>;
  qtrFormVisible$: Observable<boolean>;
  downAndDistanceFormVisible$: Observable<boolean>;
  timeoutBtnsVisible$: Observable<boolean>;
  timeFormsVisible$: Observable<boolean>;
  changeTeamsFormsVisible$: Observable<boolean>;
  changeScoreBoardFormsVisible$: Observable<boolean>;
  sponsorsFormsVisible$: Observable<boolean>;
  rostersFormsVisible$: Observable<boolean>;
  eventsFormsVisible$: Observable<boolean>;

  homePlayersInMatch$: Observable<IPlayerInMatchFullData[]> =
    this.playerInMatch.homeRoster$;
  awayPlayersInMatch$: Observable<IPlayerInMatchFullData[]> =
    this.playerInMatch.awayRoster$;

  constructor(
    private matchData: MatchData,
    private playerInMatch: PlayerInMatch,
    private ui: Ui,
  ) {
    playerInMatch.loadAllPlayersFullDataInMatch();

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
    this.changeTeamsFormsVisible$ = this.ui.formVisibility$.pipe(
      map((formVisibility) => formVisibility['changeTeamsForms']),
    );
    this.changeScoreBoardFormsVisible$ = this.ui.formVisibility$.pipe(
      map((formVisibility) => formVisibility['changeScoreBoardForms']),
    );
    this.sponsorsFormsVisible$ = this.ui.formVisibility$.pipe(
      map((formVisibility) => formVisibility['sponsorsForms']),
    );
    this.rostersFormsVisible$ = this.ui.formVisibility$.pipe(
      map((formVisibility) => formVisibility['rostersForms']),
    );
    this.eventsFormsVisible$ = this.ui.formVisibility$.pipe(
      map((formVisibility) => formVisibility['eventsForms']),
    );
  }

  toggleAllFormsVisibility() {
    this.ui.toggleAllFormsVisibility();
  }
}
