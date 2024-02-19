import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TUI_ARROW } from '@taiga-ui/kit';
import { DropDownMenuComponent } from '../dropdownmenu.component';
import { ISeasonAndSport, ISport } from '../../../../type/sport.type';
import { IBaseIdElse } from '../../../../type/base.type';
import { Store } from '@ngrx/store';
import { SeasonState } from '../../../../components/season/store/reducers';
import { seasonActions } from '../../../../components/season/store/actions';

@Component({
  selector: 'app-sport-with-season-dropdown',
  standalone: true,
  imports: [DropDownMenuComponent],
  templateUrl: './sport-with-season-dropdown.component.html',
  styleUrl: './sport-with-season-dropdown.component.less',
})
export class SportWithSeasonDropdownComponent implements OnChanges {
  seasonStore: Store<{ season: SeasonState }> = inject(Store);
  seasonsWithSportId$ = this.seasonStore.select(
    (state) => state.season.allSeasons,
  );

  @Input() sportId!: number;

  protected readonly arrow = TUI_ARROW;

  seasonSportRoute(item: ISeasonAndSport): any {
    return [`/sport/${item.sport_id}/season/${item.id}/tournaments`];
  }

  mapItemToLabelYear(item: IBaseIdElse): string {
    return item.year?.toString() ?? '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sportId']) {
      this.seasonStore.dispatch(
        seasonActions.getSeasonsWithSportId({ sportId: this.sportId }),
      );
    }
  }
}
