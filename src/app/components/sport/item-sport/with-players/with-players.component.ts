import { Component } from '@angular/core';
import { Player } from '../../../player/player';
import { Person } from '../../../person/person';
import { IPlayer } from '../../../../type/player.type';
import { Sport } from '../../sport';
import { AsyncPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { EditButtonComponent } from '../../../../shared/ui/buttons/edit-button/edit-button.component';
import { ListOfItemsIslandComponent } from '../../../../shared/ui/list-of-items-island/list-of-items-island.component';
import { TuiAvatarModule, TuiIslandModule } from '@taiga-ui/kit';
import { environment } from '../../../../../environments/environment';
import { AddEditPlayerComponent } from '../../../player/add-edit-player/add-edit-player.component';
import { ListOfPlayersComponent } from '../../../player/list-of-players/list-of-players.component';
import { Search } from '../../../../store/search/search';
import { Pagination } from '../../../../store/pagination/pagination';
import { BasePaginationComponent } from '../../../../shared/ui/pagination/base-pagination/base-pagination.component';
import { BaseSearchFormComponent } from '../../../../shared/ui/search/base-search-form/base-search-form.component';

@Component({
  selector: 'app-with-players',
  standalone: true,
  imports: [
    AsyncPipe,
    UpperCasePipe,
    EditButtonComponent,
    ListOfItemsIslandComponent,
    TuiIslandModule,
    TitleCasePipe,
    TuiAvatarModule,
    AddEditPlayerComponent,
    ListOfPlayersComponent,
    BasePaginationComponent,
    BaseSearchFormComponent,
  ],
  templateUrl: './with-players.component.html',
  styleUrl: './with-players.component.less',
})
export class WithPlayersComponent {
  sport$ = this.sport.currentSport$;
  paginatedPlayerInSportSearchResults$ =
    this.pagination.paginatedPlayerInSportSearchResults$;
  totalPlayerInSportSearchPages$ =
    this.pagination.totalPlayerInSportSearchPages$;
  currentPage$ = this.pagination.currentPage$;
  availablePersonsForSport$ = this.person.availablePersonsForSport$;

  backendUrl = environment.backendUrl;

  constructor(
    private sport: Sport,
    private player: Player,
    private person: Person,
    private search: Search,
    private pagination: Pagination,
  ) {
    person.loadAllPersons();
    player.loadAllPlayersBySportId();

    this.search.searchPlayerInSport(null);
    this.pagination.resetCurrentPage();
  }

  playerItemHref(item: IPlayer): string {
    return `/sport/${item.sport_id}/player/${item.id}`;
  }

  onSearch(searchTerm: string | null) {
    this.search.searchPlayerInSport(searchTerm);
    this.pagination.resetCurrentPage();
  }

  setCurrentPage(page: number): void {
    this.pagination.changePage(page);
  }

  changePageSize(size: number | 'All'): void {
    this.pagination.changeItemsPerPage(size);
  }
}
