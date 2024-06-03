import { Component, Input } from '@angular/core';
import { IPlayerInMatchFullData } from '../../../../type/player.type';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { tuiItemsHandlersProvider, TuiSelectModule } from '@taiga-ui/kit';
import { TuiDataListModule, TuiDropdownModule } from '@taiga-ui/core';
import { AsyncPipe, NgClass, TitleCasePipe } from '@angular/common';
import { stringifyMatchPlayer } from '../../../../base/helpers';
import { PlayerInMatch } from '../../../../components/player-match/player-match';
import { ScoreboardData } from '../../../../components/scoreboard-data/scoreboard-data';

@Component({
  selector: 'app-select-player-lower',
  standalone: true,
  imports: [
    TuiSelectModule,
    TuiDataListModule,
    ReactiveFormsModule,
    TuiDropdownModule,
    TitleCasePipe,
    AsyncPipe,
    NgClass,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: stringifyMatchPlayer,
    }),
  ],
  templateUrl: './select-player-lower.component.html',
  styleUrl: './select-player-lower.component.less',
})
export class SelectPlayerLowerComponent {
  @Input() matchPlayers: IPlayerInMatchFullData[] = [];
  @Input() selectedPlayer: IPlayerInMatchFullData | undefined | null = null;
  @Input() scoreboardId: number | undefined | null = null;
  @Input() control: FormControl = new FormControl();

  constructor(
    private playerInMatch: PlayerInMatch,
    private scoreboardData: ScoreboardData,
  ) {}

  isSelectedPlayerInMatch(
    selectedPlayerId: number | null | undefined,
  ): boolean {
    if (!selectedPlayerId) {
      return false;
    }
    return this.matchPlayers.some(
      (player) => player.match_player?.id === selectedPlayerId,
    );
  }

  onSelect(player: IPlayerInMatchFullData) {
    this.playerInMatch.onPlayerLowerSelect(player);
    if (this.scoreboardId && player.match_player.id) {
      this.scoreboardData.updateScoreboardDataKeyValue(this.scoreboardId, {
        player_match_lower_id: player.match_player.id,
      });
    }
  }
}
