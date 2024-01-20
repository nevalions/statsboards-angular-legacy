import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ListOfItemsIslandComponent} from "../../../../shared/ui/list-of-items-island/list-of-items-island.component";
import {map, Observable, of, switchMap} from "rxjs";
import {ITeam} from "../../../../type/team.type";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {TeamService} from "../../../../services/team.service";
import {tap} from "rxjs/operators";
import {SortService} from "../../../../services/sort.service";
import {AsyncPipe, SlicePipe} from "@angular/common";
import {TuiPaginationModule} from "@taiga-ui/kit";

@Component({
  selector: 'app-with-teams',
  standalone: true,
  imports: [
    ListOfItemsIslandComponent,
    AsyncPipe,
    TuiPaginationModule,
    SlicePipe
  ],
  templateUrl: './with-teams.component.html',
  styleUrl: './with-teams.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithTeamsComponent implements OnInit{
  teams$: Observable<ITeam[]> = of([]);

  itemsPerPage = 5;
  currentPageIndex = 1;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
  ) {}

  islandTitleProperty: keyof ITeam = 'title';
  teamHref(item: ITeam): string {
    return `teams/id/${item.id}`;
  }

  ngOnInit() {
    this.route.parent?.params.subscribe(() => {
      const firstItem = 'sports';
      const firstKey = 'id';
      const firstValue = this.route.snapshot.parent?.params['id']; //get id from parent route
      const optionalValue = 'teams'

      this.teams$ = this.teamService.findByFirstKeyValue(
        firstItem,
        firstKey,
        firstValue,
        optionalValue
      )
        .pipe(
          tap(items =>
            console.log(`Items fetched by findByFirstKeyValue: ID ${firstValue}`, items,)
          ),
          map(data => SortService.sort(data, 'title'))
        );
    });
  }

  setPage(pageIndex: number) {
    this.currentPageIndex = pageIndex;
  }

  protected readonly Math = Math;
}
