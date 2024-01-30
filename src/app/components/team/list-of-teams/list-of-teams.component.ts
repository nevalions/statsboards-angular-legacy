import {ChangeDetectionStrategy, Component, inject, Input, OnInit, signal} from '@angular/core';
import {AsyncPipe, SlicePipe} from "@angular/common";
import {ListOfItemsIslandComponent} from "../../../shared/ui/list-of-items-island/list-of-items-island.component";
import {TuiButtonModule} from "@taiga-ui/core";
import {TuiPaginationModule} from "@taiga-ui/kit";
import {ITeam} from "../../../type/team.type";
import {BehaviorSubject, combineLatest, map, Observable, of, startWith, switchMap} from "rxjs";
import {
  FormSearchAutoCompleteComponent
} from "../../../shared/ui/forms/form-search-auto-complete/form-search-auto-complete.component";
import {FormSearchTextComponent} from "../../../shared/ui/forms/form-search-text/form-search-text.component";
import {toObservable} from "@angular/core/rxjs-interop";
import {tap} from "rxjs/operators";
import {SearchListService} from "../../../services/search-list.service";
import {PaginationService} from "../../../services/pagination.service";

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
    FormSearchTextComponent
  ],

  templateUrl: './list-of-teams.component.html',
  styleUrl: './list-of-teams.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfTeamsComponent implements OnInit{
  searchListService = inject(SearchListService)
  paginationService = inject(PaginationService);

  @Input() itemsPerPage: number = 2;
  @Input() currentPageIndex: BehaviorSubject<number> = new BehaviorSubject(1);
  public totalPages: number = 0;

  @Input() emptyMessage: string = 'No teams available';
  @Input() teams$: Observable<ITeam[]> = of([]);
  paginatedTeams$: Observable<ITeam[]> = of([]);
  @Input() formatPath: (item: ITeam) => string = () => '';
  @Input() titleProperty: keyof ITeam  = 'id';

  protected readonly Math = Math;

  setPage(pageIndex: number) {
    console.log('Setting page to', pageIndex)
    this.currentPageIndex.next(pageIndex);
  }


  ngOnInit() {
    this.searchListService.filteredData$.pipe(
    map((teams)=> Math.ceil(teams.length / this.itemsPerPage)),
      ).subscribe(pages => {
        this.totalPages = pages;
      });

    this.paginatedTeams$ = combineLatest([
      this.searchListService.filteredData$,
      this.currentPageIndex.asObservable(),
    ]).pipe(
      map(([teams, currentPageIndex]) => {
        console.log('Teams:', teams);
        console.log('Current Page:', currentPageIndex);
        console.log('Items per page', this.itemsPerPage)
        const start = (currentPageIndex - 1) * this.itemsPerPage;
        const end = currentPageIndex * this.itemsPerPage;
        return teams.slice(start, end);
      }),
      tap(paginatedTeams => console.log('Paginated Teams:', paginatedTeams))
    );

    this.paginatedTeams$.subscribe(paginatedTeams => {
      console.log('Paginated Teams Inside Subscribe:', paginatedTeams);
    });
  }
}

//   private sliceData(data: Observable<ITeam[]>): Observable<ITeam[]> {
//     return data.pipe(
//       tap(teams => console.log('Unpaginated teams:', teams)),
//       filter(teams => teams.length > 0),
//       map(teams => {
//         const start = (this.currentPageIndex - 1) * this.itemsPerPage;
//         const end = this.currentPageIndex * this.itemsPerPage;
//         const paginatedTeams = teams.slice(start, end);
//
//         console.log('Start:', start);
//         console.log('End:', end);
//         console.log('Paginated teams:', paginatedTeams);
//
//         return paginatedTeams;
//       }),
//     );
// }

  // stringifyFunc(data: ITeam): string {
  //   if (data) {
  //     return data.title.toString();
  //   }
  //   else {
  //     return ''
  //   }
  // }
  //
  // matcherFunc(data: ITeam, search: string) {
  //   if(search) {
  //     return data.title.toLowerCase().startsWith(search)
  //     }
  //   return ''
  // }





