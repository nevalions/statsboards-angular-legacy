import {ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {
  TUI_ARROW,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  TuiInputModule, TuiInputNumberModule,
  TuiPaginationModule, TuiStringifyContentPipeModule
} from "@taiga-ui/kit";
import {AsyncPipe, SlicePipe, UpperCasePipe} from "@angular/common";
import {DropDownMenuComponent} from "../../../shared/ui/dropdownmenu/dropdownmenu.component";
import {ListOfItemsIslandComponent} from "../../../shared/ui/list-of-items-island/list-of-items-island.component";
import {TuiButtonModule, TuiHintModule, TuiLoaderModule} from "@taiga-ui/core";
import {ActivatedRoute} from "@angular/router";
import {TournamentService} from "../../../services/tournament.service";
import {map, Observable, of} from "rxjs";
import {ITournament} from "../../../type/tournament.type";
import {IMatchFullData} from "../../../type/match.type";
import {tap} from "rxjs/operators";
import {ListOfMatchesComponent} from "../../../shared/ui/list-of-matches/list-of-matches.component";
import {SortService} from "../../../services/sort.service";
import {CreateButtonComponent} from "../../../shared/ui/buttons/create-button/create-button.component";
import {BodyTitleComponent} from "../../../shared/ui/body/body-title/body-title.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TuiValueChangesModule} from "@taiga-ui/cdk";

@Component({
  selector: 'app-item-tournament',
  standalone: true,
  imports: [
    AsyncPipe,
    DropDownMenuComponent,
    ListOfItemsIslandComponent,
    TuiButtonModule,
    TuiLoaderModule,
    UpperCasePipe,
    ListOfMatchesComponent,
    SlicePipe,
    TuiPaginationModule,
    CreateButtonComponent,
    BodyTitleComponent,
    TuiInputModule,
    TuiHintModule,
    ReactiveFormsModule,
    FormsModule,
    TuiDataListWrapperModule,
    TuiFilterByInputPipeModule,
    TuiStringifyContentPipeModule,
    TuiInputNumberModule,
    TuiValueChangesModule,
  ],
  templateUrl: './item-tournament.component.html',
  styleUrl: './item-tournament.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemTournamentComponent implements OnInit{

  searchText: string = '';
  testForm = new FormGroup({
    nameValue: new FormControl(''),
  });

  readonly form = new FormGroup({
    match: new FormControl(),
  });

  readonly stringify = ({match}: IMatchFullData): string => match.week.toString();

  readonly matcherM = (match: IMatchFullData, search: string): boolean =>
    match.match.week.toString().toLowerCase().startsWith(search.toLowerCase());


  @ViewChild(ListOfItemsIslandComponent)
  comp!: ListOfItemsIslandComponent<IMatchFullData>;

  tournament$: Observable<ITournament> = of({} as ITournament)
  matches$: Observable<IMatchFullData[]> = of([])

  itemsPerPage = 4;
  currentPageIndex = 1;

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
  ) {}

  matchHref(item: IMatchFullData): string {
    return `/matches/id/${item.id}`;
  }

  onSearch() {
    this.searchText = this.testForm.get('nameValue')?.value || '';
    this.loadMatches();
  }

  loadMatches() {
    this.route.params.subscribe(params => {
      const tournamentId = Number([params['id']]);
      this.matches$ = this.tournamentService.findMatchByTournamentId(tournamentId)
        .pipe(
          map(items => this.filterMatches(items)),
          tap(filteredItems =>
            console.log(`Filtered Matches in Tournament ID: ${tournamentId}`, filteredItems)
          ),
          map(items => SortService.sort(items, 'match.week', '-match.match_date'))
        );
    });
  }

  filterMatches(matches: IMatchFullData[]): IMatchFullData[] {
    if (!this.searchText) {
      return matches;
    }
    const lowerCaseSearch = this.searchText.toString().toLowerCase();
    return matches.filter(match =>
      match.match.week.toString().includes(lowerCaseSearch)
    );
  }

  protected readonly arrow = TUI_ARROW;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const tournamentId = Number([params['id']])
      this.tournament$ = this.tournamentService.findById(tournamentId)

      this.matches$ = this.tournamentService.findMatchByTournamentId(tournamentId)
        .pipe(
          tap(items =>
            console.log(`Matches in Tournament ID: ${tournamentId}`, items)
          ),
          map(items => SortService.sort(items, 'match.week', '-match.match_date'))
        )

    })
  }

  setPage(pageIndex: number) {
    this.currentPageIndex = pageIndex;
  }

  protected readonly Math = Math;
}
