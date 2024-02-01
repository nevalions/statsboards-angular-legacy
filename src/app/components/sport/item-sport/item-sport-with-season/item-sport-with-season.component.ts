import {ChangeDetectionStrategy, Component, inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {combineLatest, map, Observable, of, shareReplay, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {tap} from "rxjs/operators";
import {AsyncPipe, UpperCasePipe} from "@angular/common";
import {TuiBlockStatusModule} from "@taiga-ui/layout";
import {TUI_ARROW, TuiIslandModule, TuiSelectModule} from "@taiga-ui/kit";
import {TuiButtonModule, TuiDataListModule, TuiLoaderModule} from "@taiga-ui/core";
import {SeasonDropdownComponent} from "../../../season/season-dropdown/season-dropdown.component";
import {ListOfItemsIslandComponent} from "../../../../shared/ui/list-of-items-island/list-of-items-island.component";
import {ITournament} from "../../../../type/tournament.type";
import {TournamentService} from "../../../../services/tournament.service";
import {ISeasonAndSport, ISport} from "../../../../type/sport.type";
import {SportService} from "../../../../services/sport.service";
import {IBaseIdElse} from "../../../../type/base.type";
import {DropDownMenuComponent} from "../../../../shared/ui/dropdownmenu/dropdownmenu.component";
import {SeasonService} from "../../../../services/season.service";
import {SortService} from "../../../../services/sort.service";
import {SportComponent} from "../../sport.component";
import {currentYear} from "../../../../base/constants";
import {FormSearchTextComponent} from "../../../../shared/ui/forms/form-search-text/form-search-text.component";
import {
  paginationWithItemsPerPage
} from "../../../../shared/ui/pagination/pagination-with-items-per-page/pagination-with-items-per-page.component";
import {SearchListService} from "../../../../services/search-list.service";
import {PaginationService} from "../../../../services/pagination.service";
import {
  SportWithSeasonDropdownComponent
} from "../../../../shared/ui/dropdownmenu/sport-with-season-dropdown/sport-with-season-dropdown.component";
import {CreateButtonComponent} from "../../../../shared/ui/buttons/create-button/create-button.component";
import {BodyTitleComponent} from "../../../../shared/ui/body/body-title/body-title.component";

@Component({
  selector: 'app-item-sport-with-season',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiBlockStatusModule,
    TuiSelectModule,
    TuiButtonModule,
    TuiIslandModule,
    UpperCasePipe,
    SeasonDropdownComponent,
    ListOfItemsIslandComponent,
    DropDownMenuComponent,
    TuiDataListModule,
    TuiLoaderModule,
    FormSearchTextComponent,
    paginationWithItemsPerPage,
    SportWithSeasonDropdownComponent,
    CreateButtonComponent,
    BodyTitleComponent
  ],
  templateUrl: './item-sport-with-season.component.html',
  styleUrl: './item-sport-with-season.component.less',
  encapsulation: ViewEncapsulation.None, //helps with full width of buttons select season
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSportWithSeasonComponent implements OnInit{
  private route = inject(ActivatedRoute)
  private sportService = inject(SportService)
  private tournamentService = inject(TournamentService)
  private seasonService = inject(SeasonService)

  searchListService = inject(SearchListService)
  paginationService = inject(PaginationService)

  tournaments$: Observable<ITournament[]> = of({} as ITournament[]);
  sport$: Observable<ISport> = of({} as ISport);
  year: number = 0;

  constructor() {}

  islandTitleProperty: keyof IBaseIdElse = 'title';

  tournamentItemHref(item: IBaseIdElse): string {
    return `/tournaments/id/${item.id}`;
  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {
        const { id, year } = params;
        const sportId = Number(id);
        const seasonYear = Number(year);

        // Validate id and year
        if (isNaN(sportId) || isNaN(seasonYear)) {
          return of([]);
        }
        this.year = seasonYear;
        this.sport$ = this.sportService.findById(sportId);

        return this.tournamentService.fetchTournamentsBySportAndSeason(
          { id: sportId, year: seasonYear }
        );
      }),
      tap((tournaments: ITournament[]) => {
        this.tournaments$ = of(tournaments);
        this.searchListService.updateData(this.tournaments$);
        this.paginationService.initializePagination(this.searchListService.filteredData$);
      })
    ).subscribe();
  }
}
