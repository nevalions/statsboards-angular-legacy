import {ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {TUI_ARROW} from "@taiga-ui/kit";
import {AsyncPipe, UpperCasePipe} from "@angular/common";
import {DropDownMenuComponent} from "../../../shared/ui/dropdownmenu/dropdownmenu.component";
import {ListOfItemsIslandComponent} from "../../../shared/ui/list-of-items-island/list-of-items-island.component";
import {TuiButtonModule, TuiLoaderModule} from "@taiga-ui/core";
import {ActivatedRoute} from "@angular/router";
import {SportService} from "../../../services/sport.service";
import {TournamentService} from "../../../services/tournament.service";
import {SeasonService} from "../../../services/season.service";
import {map, Observable, of} from "rxjs";
import {ITournament} from "../../../type/tournament.type";
import {IMatch, IMatchFullData} from "../../../type/match.type";
import {tap} from "rxjs/operators";
import {IBaseIdElse} from "../../../type/base.type";

@Component({
  selector: 'app-item-tournament',
  standalone: true,
  imports: [
    AsyncPipe,
    DropDownMenuComponent,
    ListOfItemsIslandComponent,
    TuiButtonModule,
    TuiLoaderModule,
    UpperCasePipe
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

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
  ) {}

  islandTitleProperty: keyof IBaseIdElse = 'id';

  matchHref(item: IBaseIdElse): string {
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
          )
        )

    })
  }
}
