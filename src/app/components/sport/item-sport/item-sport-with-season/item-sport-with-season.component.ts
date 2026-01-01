import { TuiBlockStatus } from '@taiga-ui/layout';
import { TuiIslandDirective, TuiSelectModule } from '@taiga-ui/legacy';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { TuiDataList } from '@taiga-ui/core';
import { Sport } from '../../sport';
import { Season } from '../../../season/season';
import { Tournament } from '../../../tournament/tournament';

@Component({
  selector: 'app-item-sport-with-season',
  standalone: true,
  imports: [AsyncPipe, TuiBlockStatus, TuiSelectModule, UpperCasePipe],
  providers: [],
  templateUrl: './item-sport-with-season.component.html',
  styleUrl: './item-sport-with-season.component.less',
  encapsulation: ViewEncapsulation.None, //helps with full width of buttons select season
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSportWithSeasonComponent {
  sport$ = this.sport.currentSport$;
  season$ = this.season.season$;
  allSeasonSportTournaments$ = this.tournament.allSeasonSportTournaments$;

  constructor(
    private sport: Sport,
    private season: Season,
    private tournament: Tournament,
  ) {
    tournament.loadSeasonSportTournaments();
  }
}
