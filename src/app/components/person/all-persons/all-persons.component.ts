import { TuiLoader } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Person } from '../person';
import { AsyncPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { EditButtonComponent } from '../../../shared/ui/buttons/edit-button/edit-button.component';
import { ListOfItemsIslandComponent } from '../../../shared/ui/list/list-of-items-island/list-of-items-island.component';
import { ITeam } from '../../../type/team.type';
import { IPerson } from '../../../type/person.type';
import { AddEditPersonComponent } from '../add-edit-person/add-edit-person.component';
import { BasePaginationComponent } from '../../../shared/ui/pagination/base-pagination/base-pagination.component';
import { BaseSearchFormComponent } from '../../../shared/ui/search/base-search-form/base-search-form.component';
import { Search } from '../../../store/search/search';
import { Pagination } from '../../../store/pagination/pagination';

@Component({
  selector: 'app-all-persons',
  standalone: true,
  imports: [
    RouterOutlet,
    UpperCasePipe,
    EditButtonComponent,
    ListOfItemsIslandComponent,
    AsyncPipe,
    TuiLoader,
    AddEditPersonComponent,
    TitleCasePipe,
    BasePaginationComponent,
    BaseSearchFormComponent,
  ],
  templateUrl: './all-persons.component.html',
  styleUrl: './all-persons.component.less',
})
export class AllPersonsComponent {
  // allPersons$ = this.person.allPersons$;
  paginatedPersonSearchResults$ = this.pagination.paginatedPersonSearchResults$;
  totalPersonSearchPages$ = this.pagination.totalPersonSearchPages$;
  currentPage$ = this.pagination.currentPage$;

  constructor(
    private person: Person,
    private search: Search,
    private pagination: Pagination,
  ) {
    person.loadAllPersons();

    this.search.searchPerson(null);
    this.pagination.resetCurrentPage();
  }

  first_name: keyof IPerson = 'first_name';
  second_name: keyof IPerson = 'second_name';
  avatarIconUrl: keyof IPerson = 'person_photo_icon_url';

  personItemHref(item: ITeam): string {
    return `person/${item.id}`;
  }

  onSearch(searchTerm: string | null) {
    this.search.searchPerson(searchTerm);
    this.pagination.resetCurrentPage();
  }

  setCurrentPage(page: number): void {
    this.pagination.changePage(page);
  }

  changePageSize(size: number | 'All'): void {
    this.pagination.changeItemsPerPage(size);
  }
}
