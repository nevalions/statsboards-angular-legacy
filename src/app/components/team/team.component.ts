import {Component, inject, OnInit, signal, Signal} from '@angular/core';
import {WithTeamsComponent} from "../sport/item-sport/with-teams/with-teams.component";
import {BehaviorSubject, map, Observable, of} from "rxjs";
import {ITeam} from "../../type/team.type";
import {ActivatedRoute, RouterOutlet} from "@angular/router";
import {TeamService} from "../../services/team.service";
import {tap} from "rxjs/operators";
import {SortService} from "../../services/sort.service";
import {ListOfTeamsComponent} from "./list-of-teams/list-of-teams.component";
import {AsyncPipe, UpperCasePipe} from "@angular/common";
import {TuiButtonModule} from "@taiga-ui/core";
import {
  FormSearchAutoCompleteComponent
} from "../../shared/ui/forms/form-search-auto-complete/form-search-auto-complete.component";

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    WithTeamsComponent,
    ListOfTeamsComponent,
    AsyncPipe,
    RouterOutlet,
    TuiButtonModule,
    UpperCasePipe,
    FormSearchAutoCompleteComponent
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.less'
})
export class TeamComponent implements OnInit{
  teams$: Observable<ITeam[]> = of([]);

  itemsPerPage = 5;
  currentPageIndex: BehaviorSubject<number> = new BehaviorSubject(1);

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
      this.teams$ = this.teamService.findAll()
        .pipe(
          tap(items =>
            console.log(`API TEAMS`, items,)
          ),
          map(data => SortService.sort(data, 'title'))
        );
    });
  }

  // setPage(pageIndex: number) {
  //   this.currentPageIndex.set(pageIndex);
  // }

  protected readonly Math = Math;
}
