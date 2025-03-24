import { TuiSelectModule } from "@taiga-ui/legacy";
import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { tuiItemsHandlersProvider } from '@taiga-ui/kit';
import { stringifyPerson } from '../../../../base/helpers';
import { IPlayerInTeamTournamentFullData } from '../../../../type/player.type';

@Component({
  selector: 'app-select-player-to-match',
  standalone: true,
  imports: [
    TuiSelectModule,
    ReactiveFormsModule,
    TuiDataList,
    TuiDropdown,
    TitleCasePipe,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: stringifyPerson,
    }),
  ],
  templateUrl: './select-player-to-match.component.html',
  styleUrl: './select-player-to-match.component.less',
})
export class SelectPlayerToMatchComponent {
  @Input()
  playerList: IPlayerInTeamTournamentFullData[] = [];
  // @Input()
  // playerListFromMatch: IPlayerInMatch[] = [];
  @Input() matchId!: number;
  @Input() control: FormControl | null = null;

  @Output() playerSelect = new EventEmitter<number>();

  onSelect(playerId: number) {
    if (this.control) {
      if (this.control.value) {
        // console.log(playerId);
        this.playerSelect.emit(playerId);
      }
    }
  }
}
