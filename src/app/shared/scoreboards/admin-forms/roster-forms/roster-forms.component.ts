import { TuiInputModule } from '@taiga-ui/legacy';
import { AsyncPipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ScoreboardData } from '../../../../components/scoreboard-data/scoreboard-data';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { IScoreboard } from '../../../../type/matchdata.type';
import { AdminDownButtonComponent } from '../../../ui/buttons/admin-down-button/admin-down-button.component';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';

import { SelectPlayerLowerComponent } from '../../../ui/select/select-player-lower/select-player-lower.component';
import {
  IPlayerInMatchFullData,
  IPlayerInMatchFullDataWithOffenceStats,
  IPlayerInMatchFullDataWithQbStats,
} from '../../../../type/player.type';
import { PlayerInMatch } from '../../../../components/player-match/player-match';
import { Websocket } from '../../../../store/websocket/websocket';
import { FootballEvent } from '../../../../components/match-event/football-event/football-event';
import { SelectQbWithStatsLowerComponent } from '../../../ui/select/select-qb-with-stats-lower/select-qb-with-stats-lower.component';
import { OnAirToggleComponent } from '../on-air-toggle/on-air-toggle.component';

@Component({
  selector: 'app-roster-forms',
  standalone: true,
  imports: [
    ToggleVisibleButtonComponent,
    AsyncPipe,
    AdminDownButtonComponent,
    TuiInputModule,
    ReactiveFormsModule,
    SelectPlayerLowerComponent,
    SelectQbWithStatsLowerComponent,
    OnAirToggleComponent,
  ],
  templateUrl: './roster-forms.component.html',
  styleUrl: './roster-forms.component.less',
})
export class RosterFormsComponent implements OnChanges, OnInit {
  private footballEvent = inject(FootballEvent);
  private scoreboardData = inject(ScoreboardData);
  private playerInMatch = inject(PlayerInMatch);
  private websocket = inject(Websocket);

  @Input() rosterFormsVisible$!: Observable<boolean>;
  @Input() data: IMatchFullDataWithScoreboard | undefined;
  @Input() homePlayersInMatch: IPlayerInMatchFullData[] | null = [];
  @Input() awayPlayersInMatch: IPlayerInMatchFullData[] | null = [];
  @Input() players: IPlayerInMatchFullData[] = [];
  @Input() isMatchDataSubmitting$?: Observable<boolean>;
  @Input() disabled: boolean = false;
  playerMatchSelected$ = this.playerInMatch.selectSelectedPlayerInMatchLower$;
  footballQbSelected$ =
    this.playerInMatch.selectSelectedFootballQbFullStatsInMatchLower$;
  homeFootballQbWithStats$ = this.footballEvent.allQuarterbacksTeamA$;
  awayFootballQbWithStats$ = this.footballEvent.allQuarterbacksTeamB$;

  constructor() {
    const playerInMatch = this.playerInMatch;

    playerInMatch.loadAllPlayersFullDataInMatch();
  }

  private loadLowerThirdsData(): void {
    if (this.data && this.data.scoreboard_data) {
      if (this.data.scoreboard_data.football_qb_full_stats_match_lower_id) {
        this.playerInMatch.setQbFullStatsId(
          this.data.scoreboard_data.football_qb_full_stats_match_lower_id,
        );
        this.playerInMatch.getQbFullStatsLowerSelect(
          this.data.scoreboard_data.football_qb_full_stats_match_lower_id,
        );
      }
      if (this.data.scoreboard_data.player_match_lower_id) {
        this.playerInMatch.setPlayerIdSelect(
          this.data.scoreboard_data.player_match_lower_id,
        );
        this.playerInMatch.getPlayerLowerSelect(
          this.data.scoreboard_data.player_match_lower_id,
        );
      }
    }
  }

  ngOnInit() {
    this.loadLowerThirdsData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.loadLowerThirdsData();
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
  }

  toggleFootballQbFullStatsLowerVisibility(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();
    this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
      is_football_qb_full_stats_lower:
        !scoreboardData.is_football_qb_full_stats_lower,
      is_home_match_team_lower: false,
      is_away_match_team_lower: false,
      is_match_player_lower: false,
    });
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

  getFullName(
    player:
      | IPlayerInMatchFullData
      | IPlayerInMatchFullDataWithQbStats
      | IPlayerInMatchFullDataWithOffenceStats
      | null
      | undefined,
  ): string {
    if (player) {
      return `${player.person?.first_name || ''} ${player.person?.second_name || ''}`;
    }
    return '';
  }
}
