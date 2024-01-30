import {ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ListOfItemsIslandComponent} from "../../../../shared/ui/list-of-items-island/list-of-items-island.component";
import {map, Observable, of, switchMap} from "rxjs";
import {ITeam} from "../../../../type/team.type";
import {ActivatedRoute, Params, RouterLink} from "@angular/router";
import {TeamService} from "../../../../services/team.service";
import {tap} from "rxjs/operators";
import {SortService} from "../../../../services/sort.service";
import {AsyncPipe, SlicePipe} from "@angular/common";
import {TuiPaginationModule} from "@taiga-ui/kit";
import {TuiButtonModule} from "@taiga-ui/core";
import {ListOfTeamsComponent} from "../../../team/list-of-teams/list-of-teams.component";

@Component({
  selector: 'app-with-teams',
  standalone: true,
  imports: [
    ListOfItemsIslandComponent,
    AsyncPipe,
    TuiPaginationModule,
    SlicePipe,
    RouterLink,
    TuiButtonModule,
    ListOfTeamsComponent,
  ],
  templateUrl: './with-teams.component.html',
  styleUrl: './with-teams.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithTeamsComponent implements OnInit{
  private route = inject(ActivatedRoute)
  private teamService =  inject(TeamService)

  teams$: Observable<ITeam[]> = of([]);

  itemsPerPage = 5;
  currentPageIndex = 1;

  constructor(
  ) {}

  islandTitleProperty: keyof ITeam = 'title';
  teamHref(item: ITeam): string {
    return `teams/id/${item.id}`;
  }

  ngOnInit() {
    this.teams$ = this.getTeams$();
  }

  getTeams$(): Observable<ITeam[]> {
    return this.route.parent?.params.pipe(
      switchMap(id => this.teamService.fetchTeamsBySportId(id)),
    ) ?? of([]);
  }

  setPage(pageIndex: number) {
    this.currentPageIndex = pageIndex;
  }

  protected readonly Math = Math;
}
