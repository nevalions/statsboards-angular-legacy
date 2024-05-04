import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ITeam } from '../../../../type/team.type';
import { RouterLink } from '@angular/router';
import { AsyncPipe, SlicePipe, UpperCasePipe } from '@angular/common';
import { TuiInputModule, TuiPaginationModule } from '@taiga-ui/kit';
import { TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { ListOfTeamsComponent } from '../../../team/list-of-teams/list-of-teams.component';
import { Sport } from '../../sport';
import { Team } from '../../../team/team';
import { AddEditTeamComponent } from '../../../team/add-edit-team/add-edit-team.component';
import { EditButtonComponent } from '../../../../shared/ui/buttons/edit-button/edit-button.component';
import { Sponsor } from '../../../adv/sponsor/sponsor';
import { SponsorLine } from '../../../adv/sponsor-line/sponsorLine';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiValueChangesModule } from '@taiga-ui/cdk';
import { Search } from '../../../../store/search/search';
import { BaseSearchFormComponent } from '../../../../shared/ui/search/base-search-form/base-search-form.component';

@Component({
  selector: 'app-with-teams',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiPaginationModule,
    SlicePipe,
    RouterLink,
    ListOfTeamsComponent,
    TuiLoaderModule,
    UpperCasePipe,
    AddEditTeamComponent,
    EditButtonComponent,
    ReactiveFormsModule,
    TuiInputModule,
    TuiValueChangesModule,
    TuiTextfieldControllerModule,
    BaseSearchFormComponent,
  ],
  templateUrl: './with-teams.component.html',
  styleUrl: './with-teams.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithTeamsComponent {
  sport$ = this.sport.currentSport$;
  allSponsors$ = this.sponsor.allSponsors$;
  allSponsorLines$ = this.sponsorLine.allSponsorLines$;
  teamInSportSearchResults$ = this.search.teamInSportSearchResults$;

  constructor(
    private sport: Sport,
    private team: Team,
    private sponsor: Sponsor,
    private sponsorLine: SponsorLine,
    private search: Search,
  ) {
    sponsor.loadAllSponsors();
    sponsorLine.loadAllSponsorLines();
    team.loadAllTeamsInSport();

    this.search.searchTeamInSport(null);
  }

  islandTeamTitleProperty: keyof ITeam = 'title';

  teamItemHref(item: ITeam): string {
    return `team/${item.id}`;
  }

  onSearch(searchTerm: string | null) {
    this.search.searchTeamInSport(searchTerm);
  }
}
