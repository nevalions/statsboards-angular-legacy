import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IPlayerInMatch,
  IPlayerInSport,
  IPlayerInTeamTournament,
  IPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from '../../../../type/player.type';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiSelectModule } from '@taiga-ui/kit';
import { TuiDataListModule, TuiDropdownModule } from '@taiga-ui/core';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-select-player-to-match',
  standalone: true,
  imports: [
    TuiSelectModule,
    ReactiveFormsModule,
    TuiDataListModule,
    TuiDropdownModule,
    TitleCasePipe,
  ],
  templateUrl: './select-player-to-match.component.html',
  styleUrl: './select-player-to-match.component.less',
})
export class SelectPlayerToMatchComponent {
  @Input()
  playerList: IPlayerInTeamTournamentWithPersonWithSportWithPosition[] = [];
  // @Input()
  // playerListFromMatch: IPlayerInMatch[] = [];
  @Input() matchId!: number;
  @Input() control: FormControl | null = null;

  @Output() playerSelect = new EventEmitter<number>();

  onSelect(playerId: number) {
    if (this.control) {
      if (this.control.value) {
        this.playerSelect.emit(playerId);
      }
    }
  }
}
