import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPlayerInMatchFullData } from '../../../../type/player.type';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { tuiItemsHandlersProvider, TuiSelectModule } from '@taiga-ui/kit';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { toTitleCase } from '../../../../base/helpers';

@Component({
  selector: 'app-select-player-in-match',
  standalone: true,
  imports: [
    TuiHostedDropdownModule,
    TuiDataListModule,
    TuiSelectModule,
    ReactiveFormsModule,
    TitleCasePipe,
    UpperCasePipe,
    TuiTextfieldControllerModule,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: (player: IPlayerInMatchFullData) => {
        if (
          !player ||
          !player.match_player ||
          !player.match_player.match_number ||
          !player.person ||
          !player.person.second_name ||
          !player.person.first_name
        ) {
          return '';
        }

        const matchNumber = player.match_player.match_number;
        const secondName = toTitleCase(player.person.second_name);
        const firstName = toTitleCase(player.person.first_name);

        return `${matchNumber} ${secondName} ${firstName}`;
      },
    }),
  ],
  templateUrl: './select-player-in-match.component.html',
  styleUrl: './select-player-in-match.component.less',
})
export class SelectPlayerInMatchComponent {
  @Input() players: IPlayerInMatchFullData[] | null = [];
  @Input() placeholder: string = 'item';
  @Input() control!: FormControl;
  @Output() playerSelect = new EventEmitter<IPlayerInMatchFullData>();

  onSelect(player: IPlayerInMatchFullData) {
    if (this.control) {
      if (this.control.value) {
        console.log(player);
        this.playerSelect.emit(player);
      }
    }
  }
}
