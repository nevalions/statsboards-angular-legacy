import { AsyncPipe, NgIf, UpperCasePipe } from '@angular/common';
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
import { SelectPlayerToMatchComponent } from '../../../ui/select/select-player-to-match/select-player-to-match.component';
import { SelectPlayerLowerComponent } from '../../../ui/select/select-player-lower/select-player-lower.component';
import { IPlayerInMatchFullData } from '../../../../type/player.type';
import { PlayerInMatch } from '../../../../components/player-match/player-match';
import { Websocket } from '../../../../store/websocket/websocket';

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
    SelectPlayerToMatchComponent,
    SelectPlayerLowerComponent,
    UpperCasePipe,
  ],
  templateUrl: './roster-forms.component.html',
  styleUrl: './roster-forms.component.less',
})
export class RosterFormsComponent implements OnChanges {
  @Input() rosterFormsVisible$!: Observable<boolean>;
  @Input() data: IMatchFullDataWithScoreboard | undefined;
  @Input() homePlayersInMatch: IPlayerInMatchFullData[] | null = [];
  @Input() awayPlayersInMatch: IPlayerInMatchFullData[] | null = [];
  @Input() players: IPlayerInMatchFullData[] = [];
  @Input() isMatchDataSubmitting$?: Observable<boolean>;
  @Input() disabled: boolean = false;
  playerMatchSelected$ = this.playerInMatch.selectSelectedPlayerInMatchLower$;

  // homePlayersInMatch$: Observable<IPlayerInMatchFullData[]> =
  //   this.playerInMatch.homeRoster$;
  // awayPlayersInMatch$: Observable<IPlayerInMatchFullData[]> =
  //   this.playerInMatch.awayRoster$;

  constructor(
    private scoreboardData: ScoreboardData,
    private playerInMatch: PlayerInMatch,
    private websocket: Websocket,
  ) {
    playerInMatch.loadAllPlayersFullDataInMatch();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
    }
    if (changes['disabled']) {
    }
  }

  toggleShowHomeOffenseRosterVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();
    this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
      is_team_a_start_offense: !scoreboardData.is_team_a_start_offense,
      is_team_b_start_offense: false,
      is_team_a_start_defense: false,
      is_team_b_start_defense: false,
    });
  }

  toggleShowAwayOffenseRosterVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();
    this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
      is_team_b_start_offense: !scoreboardData.is_team_b_start_offense,
      is_team_a_start_offense: false,
      is_team_a_start_defense: false,
      is_team_b_start_defense: false,
    });
  }

  toggleShowHomeDefenseRosterVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();
    this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
      is_team_a_start_defense: !scoreboardData.is_team_a_start_defense,
      is_team_b_start_offense: false,
      is_team_a_start_offense: false,
      is_team_b_start_defense: false,
    });
  }

  toggleShowAwayDefenseRosterVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();
    this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
      is_team_b_start_defense: !scoreboardData.is_team_b_start_defense,
      is_team_b_start_offense: false,
      is_team_a_start_offense: false,
      is_team_a_start_defense: false,
    });
  }

  toggleHomeTeamFootballLowerVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();
    this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
      is_home_match_team_lower:
        !scoreboardData.is_home_match_team_lower || false,
      is_away_match_team_lower: false,
      is_match_player_lower: false,
    });
  }

  toggleAwayTeamFootballLowerVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();
    this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
      is_away_match_team_lower:
        !scoreboardData.is_away_match_team_lower || false,
      is_home_match_team_lower: false,
      is_match_player_lower: false,
    });
  }

  toggleBothTeamFootballLowerVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();
    if (
      scoreboardData.is_home_match_team_lower &&
      scoreboardData.is_away_match_team_lower
    ) {
      this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
        is_home_match_team_lower: false,
        is_away_match_team_lower: false,
        is_match_player_lower: false,
      });
    } else if (
      !scoreboardData.is_home_match_team_lower &&
      scoreboardData.is_away_match_team_lower
    ) {
      this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
        is_home_match_team_lower: true,
        is_away_match_team_lower: true,
        is_match_player_lower: false,
      });
    } else if (
      scoreboardData.is_home_match_team_lower &&
      !scoreboardData.is_away_match_team_lower
    ) {
      this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
        is_home_match_team_lower: true,
        is_away_match_team_lower: true,
        is_match_player_lower: false,
      });
    } else if (
      !scoreboardData.is_home_match_team_lower &&
      !scoreboardData.is_away_match_team_lower
    ) {
      this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
        is_home_match_team_lower: true,
        is_away_match_team_lower: true,
        is_match_player_lower: false,
      });
    }

    // this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
    //   is_away_match_team_lower:
    //     !scoreboardData.is_away_match_team_lower || false,
    //   is_home_match_team_lower: false,
    //   is_match_player_lower: false,
    // });
  }

  toggleShowMatchPlayerLowerVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();
    this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
      is_match_player_lower: !scoreboardData.is_match_player_lower,
      is_home_match_team_lower: false,
      is_away_match_team_lower: false,
    });
  }
}
