import {ChangeDetectionStrategy, Component, inject, Input, OnInit} from '@angular/core';
import {AsyncPipe, SlicePipe} from "@angular/common";
import {ListOfItemsIslandComponent} from "../../../shared/ui/list-of-items-island/list-of-items-island.component";
import {TuiButtonModule, TuiLoaderModule} from "@taiga-ui/core";
import {TuiInputNumberModule, TuiPaginationModule} from "@taiga-ui/kit";
import {ITeam} from "../../../type/team.type";
import {Observable, of} from "rxjs";
import {
  FormSearchAutoCompleteComponent
} from "../../../shared/ui/forms/form-search-auto-complete/form-search-auto-complete.component";
import {FormSearchTextComponent} from "../../../shared/ui/forms/form-search-text/form-search-text.component";
import {SearchListService} from "../../../services/search-list.service";
import {PaginationService} from "../../../services/pagination.service";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TuiValueChangesModule} from "@taiga-ui/cdk";
import {
  paginationWithItemsPerPage
} from "../../../shared/ui/pagination/pagination-with-items-per-page/pagination-with-items-per-page.component";

@Component({
  selector: 'app-list-of-teams',
  standalone: true,
  imports: [
    AsyncPipe,
    ListOfItemsIslandComponent,
    SlicePipe,
    TuiButtonModule,
    TuiPaginationModule,
    FormSearchAutoCompleteComponent,
    FormSearchTextComponent,
    TuiLoaderModule,
    ReactiveFormsModule,
    TuiInputNumberModule,
    TuiValueChangesModule,
    paginationWithItemsPerPage
  ],

  templateUrl: './list-of-teams.component.html',
  styleUrl: './list-of-teams.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfTeamsComponent implements OnInit{
  searchListService = inject(SearchListService)
  paginationService = inject(PaginationService);

  @Input() emptyMessage: string = 'No teams available';
  @Input() teams$: Observable<ITeam[]> = of([]);

  @Input() formatPath: (item: ITeam) => string = () => '';
  @Input() titleProperty: keyof ITeam  = 'id';

  // itemPerPageForm = new FormGroup({
  //   itemPerPageValue: new FormControl(),
  // });

  ngOnInit() {
    // update searchListService
    this.searchListService.updateData(this.teams$);

    // initialize paginationService with filteredData from SearchListService to apply pagination on search result
    this.paginationService.initializePagination(this.searchListService.filteredData$);

    // Set initial value of itemPerPageForm based on paginationService's itemsPerPage
    // this.itemPerPageForm.get('itemPerPageValue')?.setValue(this.paginationService.itemsPerPage.value);

  }
}
