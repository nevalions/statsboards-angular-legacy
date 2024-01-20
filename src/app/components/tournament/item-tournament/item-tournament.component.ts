import {ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {TUI_ARROW, TuiPaginationModule} from "@taiga-ui/kit";
import {AsyncPipe, SlicePipe, UpperCasePipe} from "@angular/common";
import {DropDownMenuComponent} from "../../../shared/ui/dropdownmenu/dropdownmenu.component";
import {ListOfItemsIslandComponent} from "../../../shared/ui/list-of-items-island/list-of-items-island.component";
import {TuiButtonModule, TuiLoaderModule} from "@taiga-ui/core";
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
    BodyTitleComponent
  ],
  templateUrl: './item-tournament.component.html',
  styleUrl: './item-tournament.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemTournamentComponent implements OnInit{
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
