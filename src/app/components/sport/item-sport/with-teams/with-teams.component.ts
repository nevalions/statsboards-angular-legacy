import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ITeam } from '../../../../type/team.type';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { ListOfTeamsComponent } from '../../../team/list-of-teams/list-of-teams.component';
import { Sport } from '../../sport';
import { Team } from '../../../team/team';
import { AddEditTeamComponent } from '../../../team/add-edit-team/add-edit-team.component';
import { EditButtonComponent } from '../../../../shared/ui/buttons/edit-button/edit-button.component';
import { Sponsor } from '../../../adv/sponsor/sponsor';
import { SponsorLine } from '../../../adv/sponsor-line/sponsorLine';
import { Search } from '../../../../store/search/search';
import { BaseSearchFormComponent } from '../../../../shared/ui/search/base-search-form/base-search-form.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiDataListWrapperModule,
  TuiInputNumberModule,
  TuiPaginationModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { Pagination } from '../../../../store/pagination/pagination';
import { debounceTime, distinctUntilChanged, take } from 'rxjs';
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
    TuiLoaderModule,
    UpperCasePipe,
    ReactiveFormsModule,
    TuiInputNumberModule,
    TuiPaginationModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiDataListWrapperModule,
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
  teamInSportSearchResults$ = this.search.teamInSportSearchResults$;
  paginatedTeamInSportSearchResults$ =
    this.pagination.paginatedTeamInSportSearchResults$;
  currentPage$ = this.pagination.currentPage$;
  itemsPerPage$ = this.pagination.itemsPerPage$;
  totalTeamInSportSearchPages$ = this.pagination.totalTeamInSportSearchPages$;

  // itemPerPageForm: FormGroup = new FormGroup({
  //   itemPerPageValue: new FormControl(4, [
  //     Validators.min(2),
  //     // Validators.max(20),
  //   ]),
  // });
  //
  // itemsPerPage = ['All', 2, 4, 6, 8, 10, 20];

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

    // this.itemPerPageForm
    //   .get('itemPerPageValue')!
    //   .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
    //   .subscribe((itemsPerPage) => {
    //     this.pagination.changeItemsPerPage(itemsPerPage);
    //   });
  }

  islandTeamTitleProperty: keyof ITeam = 'title';

  teamItemHref(item: ITeam): string {
    return `team/${item.id}`;
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
