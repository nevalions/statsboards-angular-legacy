import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule } from '@taiga-ui/kit';
import { Observable } from 'rxjs';
import { ScoreboardData } from '../../../../components/scoreboard-data/scoreboard-data';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { IScoreboard } from '../../../../type/matchdata.type';
import { AdminDownButtonComponent } from '../../../ui/buttons/admin-down-button/admin-down-button.component';
import { AdminSubmitButtonComponent } from '../../../ui/buttons/admin-submit-button/admin-submit-button.component';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import { DownDistanceFormsComponent } from '../down-distance-forms/down-distance-forms.component';

@Component({
  selector: 'app-roster-forms',
  standalone: true,
  imports: [
    NgIf,
    ToggleVisibleButtonComponent,
    AsyncPipe,
    DownDistanceFormsComponent,
    AdminDownButtonComponent,
    AdminSubmitButtonComponent,
    TuiInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './roster-forms.component.html',
  styleUrl: './roster-forms.component.less',
})
export class RosterFormsComponent implements OnChanges {
  @Input() rosterFormsVisible$!: Observable<boolean>;
  @Input() data: IMatchFullDataWithScoreboard | undefined;
  @Input() isMatchDataSubmitting$?: Observable<boolean>;
  @Input() disabled: boolean = false;

  constructor(private scoreboardData: ScoreboardData) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
    }
    if (changes['disabled']) {
    }
  }

  toggleShowHomeOffenseRosterVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    const updatedScoreboardData = {
      ...scoreboardData,

      is_team_a_start_offense: !scoreboardData.is_team_a_start_offense,
    };
    this.scoreboardData.updateScoreboardData(updatedScoreboardData);
  }

  toggleShowAwayOffenseRosterVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    const updatedScoreboardData = {
      ...scoreboardData,

      is_team_b_start_offense: !scoreboardData.is_team_b_start_offense,
    };
    this.scoreboardData.updateScoreboardData(updatedScoreboardData);
  }

  toggleShowHomeDefenseRosterVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    const updatedScoreboardData = {
      ...scoreboardData,

      is_team_a_start_defense: !scoreboardData.is_team_a_start_defense,
    };
    this.scoreboardData.updateScoreboardData(updatedScoreboardData);
  }

  toggleShowAwayDefenseRosterVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    const updatedScoreboardData = {
      ...scoreboardData,

      is_team_b_start_defense: !scoreboardData.is_team_b_start_defense,
    };
    this.scoreboardData.updateScoreboardData(updatedScoreboardData);
  }
}
