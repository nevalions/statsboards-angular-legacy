import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IPlayerInSport,
  IPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from '../../../../type/player.type';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { tuiItemsHandlersProvider, TuiSelectModule } from '@taiga-ui/kit';
import { TuiDataListModule, TuiDropdownModule } from '@taiga-ui/core';
import { stringifyPerson } from '../../../../base/helpers';
import { TitleCasePipe } from '@angular/common';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';

@Component({
  selector: 'app-select-player-to-team-tournament',
  standalone: true,
  imports: [
    TuiSelectModule,
    TuiDataListModule,
    ReactiveFormsModule,
    TitleCasePipe,
    TuiDropdownModule,
    TuiAutoFocusModule,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: stringifyPerson,
    }),
  ],
  templateUrl: './select-player-to-team-tournament.component.html',
  styleUrl: './select-player-to-team-tournament.component.less',
})
export class SelectPlayerToTeamTournamentComponent {
  @Input() playerList: IPlayerInSport[] = [];
  @Input()
  playerListFromTournament: IPlayerInTeamTournamentWithPersonWithSportWithPosition[] =
    [];
  @Input() tournamentId!: number;
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
