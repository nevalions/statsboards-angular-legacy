import { Component, Input, ViewEncapsulation } from '@angular/core';
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
import { ChangeTeamsFormsComponent } from '../change-teams-forms/change-teams-forms.component';
import { ScoreboardDataFormsComponent } from '../scoreboard-data-forms/scoreboard-data-forms.component';
import { TuiButtonModule } from '@taiga-ui/core';
import { tuiArrayToggle, TuiDropdownHostModule } from '@taiga-ui/cdk';
import { TUI_ARROW, TuiArrowModule } from '@taiga-ui/kit';
import { IPlayclock } from '../../../../type/playclock.type';
import { IGameclock } from '../../../../type/gameclock.type';

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
    TuiButtonModule,
    TuiArrowModule,
    TuiDropdownHostModule,
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

  constructor(
    private matchData: MatchData,
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
    this.changeTeamsFormsVisible$ = this.ui.formVisibility$.pipe(
      map((formVisibility) => formVisibility['changeTeamsForms']),
    );
    this.changeScoreBoardFormsVisible$ = this.ui.formVisibility$.pipe(
      map((formVisibility) => formVisibility['changeScoreBoardForms']),
    );
  }

  toggleAllFormsVisibility() {
    this.ui.toggleAllFormsVisibility();
  }
}
