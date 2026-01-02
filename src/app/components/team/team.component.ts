import { TuiButton } from '@taiga-ui/core';
import { Component, inject, OnInit } from '@angular/core';
import { WithTeamsComponent } from '../sport/item-sport/with-teams/with-teams.component';
import { map, Observable, of } from 'rxjs';
import { ITeam } from '../../type/team.type';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TeamService } from './team.service';
import { tap } from 'rxjs/operators';
import { SortService } from '../../services/sort.service';
import { ListOfTeamsComponent } from './list-of-teams/list-of-teams.component';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { FormSearchAutoCompleteComponent } from '../../shared/ui/forms/form-search-auto-complete/form-search-auto-complete.component';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    WithTeamsComponent,
    ListOfTeamsComponent,
    AsyncPipe,
    RouterOutlet,
    TuiButton,
    UpperCasePipe,
    FormSearchAutoCompleteComponent,
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.less',
})
export class TeamComponent implements OnInit {
  teams$: Observable<ITeam[]> = of([]);
  private route = inject(ActivatedRoute);
  private teamService = inject(TeamService);

  islandTitleProperty: keyof ITeam = 'title';

  teamHref(item: ITeam): string {
    return `teams/id/${item.id}`;
  }

  ngOnInit() {
    this.route.parent?.params.subscribe(() => {
      this.teams$ = this.teamService.findAll().pipe(
        tap((items) => console.log(`API TEAMS`, items)),
        map((data) => SortService.sort(data, 'title')),
      );
    });
  }
}
