import { TuiComboBoxModule } from "@taiga-ui/legacy";
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IPlayerInSport } from '../../../../type/player.type';
import {
  stringifySportPlayerSurnameName,
  stringifySurnameName,
  toTitleCase,
} from '../../../../base/helpers';
import { tuiItemsHandlersProvider, TuiDataListWrapper, TuiStringifyContentPipe, TuiFilterByInputPipe } from '@taiga-ui/kit';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-search-player-in-sport-autocomplite',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiComboBoxModule,
    UpperCasePipe,
    TuiDataListWrapper,
    TuiStringifyContentPipe,
    TuiFilterByInputPipe,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: (player: IPlayerInSport) =>
        `${toTitleCase(player.person!.second_name)} ${toTitleCase(player.person!.first_name)}`,
    }),
  ],
  templateUrl: './search-player-in-sport-autocomplite.component.html',
  styleUrl: './search-player-in-sport-autocomplite.component.less',
})
export class SearchPlayerInSportAutocompliteComponent {
  @Input() placeholder: string = 'player by last name';
  @Input() sportPlayers: IPlayerInSport[] | null = [];
  @Input() control!: FormControl;

  readonly form = new FormGroup({
    player: new FormControl<IPlayerInSport | null>(null),
  });

  constructor() {}

  readonly matcherString = (player: IPlayerInSport, search: string): boolean =>
    player.person!.second_name.toLowerCase().startsWith(search.toLowerCase());
  // player.player.id!.toString().startsWith(search.toLowerCase());

  // onSelected(player: IPlayerInSport): void {
  //   if (player) {
  //     this.form.get('player')!.setValue(player);
  //   }
  // }

  onSelected(player: IPlayerInSport): void {
    this.control.setValue(player);
  }

  protected readonly stringifySportPlayerSurnameName =
    stringifySportPlayerSurnameName;
}
