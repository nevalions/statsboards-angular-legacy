import { TUI_ARROW } from '@taiga-ui/legacy';
import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DropDownMenuComponent } from '../dropdownmenu.component';
import { ISeasonAndSport } from '../../../../type/sport.type';
import { IBaseIdElse } from '../../../../type/base.type';
import { Store } from '@ngrx/store';
import { SeasonState } from '../../../../components/season/store/reducers';
import { seasonActions } from '../../../../components/season/store/actions';
import { selectAllSeasons } from '../../../../components/season/store/reducers';

@Component({
  selector: 'app-sport-with-season-dropdown',
  standalone: true,
  imports: [DropDownMenuComponent],
  templateUrl: './sport-with-season-dropdown.component.html',
  styleUrl: './sport-with-season-dropdown.component.less',
})
export class SportWithSeasonDropdownComponent implements OnChanges {
  store: Store<{ season: SeasonState }> = inject(Store);
  seasonsWithSportId$ = this.store.select(selectAllSeasons);

  @Input() sportId!: number;

  protected readonly arrow = TUI_ARROW;

  seasonSportRoute(item: ISeasonAndSport): string[] {
    return [`/sport/${item.sport_id}/season/${item.id}/tournaments`];
  }

  mapItemToLabelYear(item: IBaseIdElse): string {
    return item.year?.toString() ?? '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sportId']) {
      this.store.dispatch(
        seasonActions.getSeasonsWithSportId({ sportId: this.sportId }),
      );
    }
  }
}
