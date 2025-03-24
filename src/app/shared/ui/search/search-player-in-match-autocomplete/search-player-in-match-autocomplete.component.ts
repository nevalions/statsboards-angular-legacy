import { TuiButton } from "@taiga-ui/core";
import { TuiTextfieldControllerModule, TuiComboBoxModule } from "@taiga-ui/legacy";
import { TuiValueChanges } from "@taiga-ui/cdk";
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  stringifyMatchPlayerNumberSurnameName,
  toTitleCase,
} from '../../../../base/helpers';
import { tuiItemsHandlersProvider, TuiDataListWrapper, TuiStringifyContentPipe, TuiFilterByInputPipe } from '@taiga-ui/kit';
import { IPlayerInMatchFullData } from '../../../../type/player.type';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-search-player-in-match-autocomplete',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiComboBoxModule,
    TuiDataListWrapper,
    UpperCasePipe,
    TuiStringifyContentPipe,
    TuiFilterByInputPipe,
    TuiTextfieldControllerModule,
    TuiValueChanges,
    TuiButton,
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
  templateUrl: './search-player-in-match-autocomplete.component.html',
  styleUrl: './search-player-in-match-autocomplete.component.less',
})
export class SearchPlayerInMatchAutocompleteComponent {
  @Input() action: string = 'search';
  @Input() placeholder: string = 'player by number or last name';
  @Input() players: IPlayerInMatchFullData[] | null = [];
  @Input() control!: FormControl;

  readonly matcherString = (
    player: IPlayerInMatchFullData,
    search: string,
  ): boolean => {
    if (
      !player ||
      !player.match_player ||
      !player.match_player.match_number ||
      !player.person ||
      !player.person.second_name
    ) {
      return false;
    }

    const matchNumber = player.match_player.match_number;
    const secondName = toTitleCase(player.person.second_name);

    return `${matchNumber} ${secondName}`
      .toLowerCase()
      .includes(search.toLowerCase());
  };

  onSelected(player: IPlayerInMatchFullData | null): void {
    // console.log('selected player', player);
    this.control.setValue(player);
  }

  protected readonly stringifyMatchPlayerNumberSurnameName =
    stringifyMatchPlayerNumberSurnameName;
}
