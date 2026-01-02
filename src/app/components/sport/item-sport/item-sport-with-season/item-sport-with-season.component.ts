import { TuiBlockStatus } from '@taiga-ui/layout';
import { TuiIslandDirective, TuiSelectModule } from '@taiga-ui/legacy';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { TuiDataList, TuiLoader } from '@taiga-ui/core';
import { Sport } from '../../sport';
import { Season } from '../../../season/season';
import { Tournament } from '../../../tournament/tournament';
import { BodyListTitleComponent } from '../../../../shared/ui/body/body-title/body-list-title.component';
import { CreateButtonShowDialogComponent } from '../../../../shared/ui/buttons/create-button-show-dialog/create-button-show-dialog.component';
import { TournamentAddEditFormComponent } from '../../../tournament/tournament-add-edit-form/tournament-add-edit-form.component';
import { SportWithSeasonDropdownComponent } from '../../../../shared/ui/dropdownmenu/sport-with-season-dropdown/sport-with-season-dropdown.component';
import { IslandListOfTournamentsComponent } from '../../../tournament/island-list-of-tournaments/island-list-of-tournaments.component';
import { Sponsor } from '../../../adv/sponsor/sponsor';
import { SponsorLine } from '../../../adv/sponsor-line/sponsorLine';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-item-sport-with-season',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiBlockStatus,
    TuiSelectModule,
    TuiLoader,
    UpperCasePipe,
    BodyListTitleComponent,
    CreateButtonShowDialogComponent,
    TournamentAddEditFormComponent,
    SportWithSeasonDropdownComponent,
    IslandListOfTournamentsComponent,
  ],
  providers: [],
  templateUrl: './item-sport-with-season.component.html',
  styleUrl: './item-sport-with-season.component.less',
  encapsulation: ViewEncapsulation.None, //helps with full width of buttons select season
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSportWithSeasonComponent {
  private sport = inject(Sport);
  private season = inject(Season);
  private tournament = inject(Tournament);
  private sponsor = inject(Sponsor);
  private sponsorLine = inject(SponsorLine);

  sport$ = this.sport.currentSport$;
  season$ = this.season.season$;
  allSeasonSportTournaments$ = this.tournament.allSeasonSportTournaments$;
  allSponsors$: Observable<any[]> = this.sponsor.allSponsors$;
  allSponsorLines$: Observable<any[]> = this.sponsorLine.allSponsorLines$;

  constructor() {
    const tournament = this.tournament;

    tournament.loadSeasonSportTournaments();
  }
}
