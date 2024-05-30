import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPlayerInMatchFullData } from '../../../../type/player.type';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { tuiItemsHandlersProvider, TuiSelectModule } from '@taiga-ui/kit';
import { TuiDataListModule, TuiDropdownModule } from '@taiga-ui/core';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import {
  stringifyMatchPlayer,
  stringifyPerson,
} from '../../../../base/helpers';
import { PlayerInMatch } from '../../../../components/player-match/player-match';
import { Observable, of } from 'rxjs';

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
  @Input() control: FormControl = new FormControl();

  // @Output() playerSelect = new EventEmitter<IPlayerInMatchFullData>();

  constructor(private playerInMatch: PlayerInMatch) {}

  onSelect(player: IPlayerInMatchFullData) {
    this.playerInMatch.onPlayerLowerSelect(player);
  }

  //   if (this.control) {
  //     if (this.control.value) {
  //       console.log(player);
  //       this.playerInMatch.onPlayerLowerSelect(player);
  //       // this.playerSelect.emit(player);
  //     }
  //   }
  // }
}
