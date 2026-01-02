import { TuiSelectModule } from "@taiga-ui/legacy";
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { IPlayerInMatchFullDataWithQbStats } from '../../../../type/player.type';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PlayerInMatch } from '../../../../components/player-match/player-match';
import { ScoreboardData } from '../../../../components/scoreboard-data/scoreboard-data';
import { TitleCasePipe } from '@angular/common';
import { TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { tuiItemsHandlersProvider } from '@taiga-ui/kit';
import { stringifyMatchPlayer } from '../../../../base/helpers';

@Component({
  selector: 'app-select-qb-with-stats-lower',
  standalone: true,
  imports: [
    TitleCasePipe,
    TuiDataList,
    TuiSelectModule,
    TuiDropdown,
    ReactiveFormsModule,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: stringifyMatchPlayer,
    }),
  ],
  templateUrl: './select-qb-with-stats-lower.component.html',
  styleUrl: './select-qb-with-stats-lower.component.less',
})
export class SelectQbWithStatsLowerComponent implements OnChanges {
  private playerInMatch = inject(PlayerInMatch);
  private scoreboardData = inject(ScoreboardData);

  @Input() qbPlayersWithStats: IPlayerInMatchFullDataWithQbStats[] = [];
  @Input() selectedPlayer:
    | IPlayerInMatchFullDataWithQbStats
    | undefined
    | null = null;
  @Input() scoreboardId: number | undefined | null = null;
  @Input() control: FormControl = new FormControl();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPlayer'] || changes['qbPlayersWithStats']) {
      // console.log('selected player', this.selectedPlayer);
      if (
        this.selectedPlayer &&
        this.isSelectedPlayerInMatch(this.selectedPlayer.match_player?.id)
      ) {
        this.control.setValue(this.selectedPlayer);
      } else {
        this.control.setValue(null);
      }
    }
  }

  isSelectedPlayerInMatch(
    selectedPlayerId: number | null | undefined,
  ): boolean {
    if (!selectedPlayerId) {
      return false;
    }
    // console.log('selectedPlayerId ', selectedPlayerId, this.qbPlayersWithStats);
    return this.qbPlayersWithStats.some(
      (player) => player.match_player?.id === selectedPlayerId,
    );
  }

  onSelect(player: IPlayerInMatchFullDataWithQbStats) {
    this.playerInMatch.onQbFullStatsLowerSelect(player);
    if (this.scoreboardId && player.match_player.id) {
      this.scoreboardData.updateScoreboardDataKeyValue(this.scoreboardId, {
        football_qb_full_stats_match_lower_id: player.match_player.id,
      });
    }
  }
}
