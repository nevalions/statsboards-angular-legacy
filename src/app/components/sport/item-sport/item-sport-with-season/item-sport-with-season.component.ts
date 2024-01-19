import {ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
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
    TuiLoaderModule
  ],
  templateUrl: './item-sport-with-season.component.html',
  styleUrl: './item-sport-with-season.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSportWithSeasonComponent implements OnInit{
  @ViewChild(ListOfItemsIslandComponent)
  comp!: ListOfItemsIslandComponent<ITournament>;

  items$: Observable<ITournament[]> = of({} as ITournament[]);
  sport$: Observable<ISport> = of({} as ISport);
  seasons$: Observable<IBaseIdElse[]> = of([]);
  year: number = 0;

  constructor(
    private route: ActivatedRoute,
    private sportService: SportService,
    private tournamentService: TournamentService,
    private seasonService: SeasonService,
  ) {}

  mapItemToLabel(item: IBaseIdElse): string {
    return item.year?.toString() ?? '';
  }

  islandTitleProperty: keyof IBaseIdElse = 'title';

  seasonSportRoute(item: ISeasonAndSport): any{
    return [`/seasons/year/${item.year}/sports/id/${item.sport_id}/tournaments`];
  }

  seasonHref(item: IBaseIdElse): string {
    return `/tournaments/id/${item.id}`;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const firstItem = 'seasons'
      const firstKey = 'year'
      const firstValue = Number([params['year']])
      const secondItem = 'sports'
      const secondKey = 'id'
      const secondValue = Number([params['id']])
      const optionalValue = 'tournaments'

      this.year = firstValue;
      this.sport$ = this.sportService.findById(secondValue);

      const allSeasons$ = this.seasonService.findAll().pipe(
      shareReplay(1),
    );

      this.seasons$ = allSeasons$.pipe(
        map(data => SortService.sort(data, 'year', false))
      );

      combineLatest([this.sport$, allSeasons$])
        .pipe(
          map(([sport, seasons]) => {
            const seasonsWithSportId = seasons.
            map(season => ({...season, sport_id: secondValue}));
            return SortService.sort(seasonsWithSportId, 'year', false);
          })
        ).subscribe(sortedSeasonsWithSportId => this.seasons$ = of(sortedSeasonsWithSportId));

      this.items$ = this.route.paramMap.pipe(
        switchMap(() => {
          const id = secondValue;
          return this.tournamentService.findByFirstKeyValueAndSecondItemSecondKeyValue(
            firstItem,
            firstKey,
            firstValue,
            secondItem,
            secondKey,
            id,
            optionalValue
          )
            .pipe(
              tap(
                items =>
                  console.log(`Items fetched by findByValueAndSecondId: ID ${id}`,
                    items,)
              ),
            )
        }))
    })
  }

  protected readonly arrow = TUI_ARROW;
}
