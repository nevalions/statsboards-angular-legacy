import { Component, Input } from '@angular/core';
import { IPlayerInSport } from '../../../../type/player.type';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { tuiItemsHandlersProvider, TuiSelectModule } from '@taiga-ui/kit';
import { TuiDataListModule } from '@taiga-ui/core';
import { stringifySurnameName } from '../../../../base/helpers';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-select-player-to-team-tournament',
  standalone: true,
  imports: [
    TuiSelectModule,
    TuiDataListModule,
    ReactiveFormsModule,
    TitleCasePipe,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: (item: IPlayerInSport) =>
        stringifySurnameName(item.person!).toUpperCase(),
    }),
  ],
  templateUrl: './select-player-to-team-tournament.component.html',
  styleUrl: './select-player-to-team-tournament.component.less',
})
export class SelectPlayerToTeamTournamentComponent {
  @Input() playerList: IPlayerInSport[] = [];
  @Input() tournamentId!: number;
  @Input() control!: FormControl;
}
