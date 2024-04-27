import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import { TuiIslandModule, TuiSelectModule } from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { SeasonDropdownComponent } from '../../../season/season-dropdown/season-dropdown.component';
import { ListOfItemsIslandComponent } from '../../../../shared/ui/list-of-items-island/list-of-items-island.component';
import { DropDownMenuComponent } from '../../../../shared/ui/dropdownmenu/dropdownmenu.component';
import { FormSearchTextComponent } from '../../../../shared/ui/forms/form-search-text/form-search-text.component';
import { paginationWithItemsPerPage } from '../../../../shared/ui/pagination/pagination-with-items-per-page/pagination-with-items-per-page.component';
import { SportWithSeasonDropdownComponent } from '../../../../shared/ui/dropdownmenu/sport-with-season-dropdown/sport-with-season-dropdown.component';
import { CreateButtonComponent } from '../../../../shared/ui/buttons/create-button/create-button.component';
import { BodyListTitleComponent } from '../../../../shared/ui/body/body-title/body-list-title.component';
import { TournamentAddEditFormComponent } from '../../../tournament/tournament-add-edit-form/tournament-add-edit-form.component';
import { IslandListOfTournamentsComponent } from '../../../tournament/island-list-of-tournaments/island-list-of-tournaments.component';
import { Sport } from '../../sport';
import { Season } from '../../../season/season';
import { Tournament } from '../../../tournament/tournament';
import { CreateButtonShowDialogComponent } from '../../../../shared/ui/buttons/create-button-show-dialog/create-button-show-dialog.component';
import { AddEditMatchComponent } from '../../../match/add-edit-match/add-edit-match.component';
import { Sponsor } from '../../../adv/sponsor/sponsor';
import { SponsorLine } from '../../../adv/sponsor-line/sponsorLine';

@Component({
  selector: 'app-item-sport-with-season',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiBlockStatusModule,
    TuiSelectModule,
    TuiButtonModule,
    TuiIslandModule,
    UpperCasePipe,
    SeasonDropdownComponent,
    ListOfItemsIslandComponent,
    DropDownMenuComponent,
    TuiDataListModule,
    TuiLoaderModule,
    FormSearchTextComponent,
    paginationWithItemsPerPage,
    SportWithSeasonDropdownComponent,
    CreateButtonComponent,
    BodyListTitleComponent,
    TournamentAddEditFormComponent,
    IslandListOfTournamentsComponent,
    CreateButtonShowDialogComponent,
    AddEditMatchComponent,
  ],
  providers: [],
  templateUrl: './item-sport-with-season.component.html',
  styleUrl: './item-sport-with-season.component.less',
  encapsulation: ViewEncapsulation.None, //helps with full width of buttons select season
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSportWithSeasonComponent {
  sport$ = this.sport.sport$;
  season$ = this.season.season$;
  allSeasonSportTournaments$ = this.tournament.allSeasonSportTournaments$;
  allSponsors$ = this.sponsor.allSponsors$;
  allSponsorLines$ = this.sponsorLine.allSponsorLines$;

  constructor(
    private sport: Sport,
    private season: Season,
    private tournament: Tournament,
    private sponsor: Sponsor,
    private sponsorLine: SponsorLine,
  ) {
    // sport.loadCurrentSport();
    // season.loadCurrentSeason();
    tournament.loadSeasonSportTournaments();
    sponsor.loadAllSponsors();
    sponsorLine.loadAllSponsorLines();
  }

  // tournamentItemHref(item: ITournament): string {
  //   return `sport/${item.sport_id}/season/${item.season_id}/tournament/${item.id}`;
  // }
}
