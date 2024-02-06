import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ListOfItemsIslandComponent } from '../../../../shared/ui/list-of-items-island/list-of-items-island.component';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { ITeam } from '../../../../type/team.type';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { TeamService } from '../../../team/team.service';
import { tap } from 'rxjs/operators';
import { SortService } from '../../../../services/sort.service';
import { AsyncPipe, SlicePipe } from '@angular/common';
import { TuiPaginationModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { ListOfTeamsComponent } from '../../../team/list-of-teams/list-of-teams.component';
import { SportService } from '../../sport.service';

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
export class WithTeamsComponent implements OnInit, OnDestroy {
  private readonly ngUnsubscribe = new Subject<void>();

  private route = inject(ActivatedRoute);
  private teamService = inject(TeamService);
  private sportService = inject(SportService);
  sportId!: number;

  teams$ = this.teamService.teams$;

  // teams$: Observable<ITeam[]> = of([]);

  constructor() {}

  islandTeamTitleProperty: keyof ITeam = 'title';

  teamItemHref(item: ITeam): string {
    return `teams/id/${item.id}`;
  }

  ngOnInit() {
    if (!this.route.parent) {
      console.error('No parent route found');
      return;
    }

    this.route.parent?.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        this.sportId = Number(params['id']);
        this.teamService.refreshTeamsInSport(this.sportId);
      });
  }

  // ngOnInit() {
  //   this.teams$ = this.getTeams$();
  // }
  //
  // getTeams$(): Observable<ITeam[]> {
  //   return (
  //     this.route.parent?.params.pipe(
  //       switchMap((id) => this.teamService.fetchAllTeamsBySportId(id)),
  //     ) ?? of([])
  //   );
  // }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
