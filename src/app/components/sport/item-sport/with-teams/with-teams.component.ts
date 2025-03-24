import { TuiTextfieldControllerModule, TuiInputNumberModule, TuiSelectModule } from "@taiga-ui/legacy";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ITeam } from '../../../../type/team.type';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { TuiLoader } from '@taiga-ui/core';
import { ListOfTeamsComponent } from '../../../team/list-of-teams/list-of-teams.component';
import { Sport } from '../../sport';
import { Team } from '../../../team/team';
import { AddEditTeamComponent } from '../../../team/add-edit-team/add-edit-team.component';
import { EditButtonComponent } from '../../../../shared/ui/buttons/edit-button/edit-button.component';
import { Sponsor } from '../../../adv/sponsor/sponsor';
import { SponsorLine } from '../../../adv/sponsor-line/sponsorLine';
import { Search } from '../../../../store/search/search';
import { BaseSearchFormComponent } from '../../../../shared/ui/search/base-search-form/base-search-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiPagination, TuiDataListWrapper } from '@taiga-ui/kit';
import { Pagination } from '../../../../store/pagination/pagination';
import { BasePaginationComponent } from '../../../../shared/ui/pagination/base-pagination/base-pagination.component';

@Component({
  selector: 'app-with-teams',
  standalone: true,
  imports: [
    AsyncPipe,
    EditButtonComponent,
    AddEditTeamComponent,
    BaseSearchFormComponent,
    ListOfTeamsComponent,
    TuiLoader,
    UpperCasePipe,
    ReactiveFormsModule,
    TuiInputNumberModule,
    TuiPagination,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiDataListWrapper,
    BasePaginationComponent,
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
  paginatedTeamInSportSearchResults$ =
    this.pagination.paginatedTeamInSportSearchResults$;
  currentPage$ = this.pagination.currentPage$;
  totalTeamInSportSearchPages$ = this.pagination.totalTeamInSportSearchPages$;

  constructor(
    private sport: Sport,
    private team: Team,
    private sponsor: Sponsor,
    private sponsorLine: SponsorLine,
    private search: Search,
    private pagination: Pagination,
  ) {
    sponsor.loadAllSponsors();
    sponsorLine.loadAllSponsorLines();
    team.loadAllTeamsInSport();

    this.search.searchTeamInSport(null);
    this.pagination.resetCurrentPage();
  }

  islandTeamTitleProperty: keyof ITeam = 'title';

  teamItemHref(item: ITeam): string {
    return `/sport/${item.sport_id}/team/${item.id}`;
  }

  onSearch(searchTerm: string | null) {
    this.search.searchTeamInSport(searchTerm);
    this.pagination.resetCurrentPage();
  }

  setCurrentPage(page: number): void {
    this.pagination.changePage(page);
  }

  changePageSize(size: number | 'All'): void {
    this.pagination.changeItemsPerPage(size);
  }
}
