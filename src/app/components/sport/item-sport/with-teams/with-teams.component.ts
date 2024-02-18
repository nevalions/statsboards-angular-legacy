import {
  AfterViewInit,
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
import {
  ActivatedRoute,
  ActivationEnd,
  ParamMap,
  Params,
  Router,
  RouterLink,
} from '@angular/router';
import { TeamService } from '../../../team/team.service';
import { tap } from 'rxjs/operators';
import { SortService } from '../../../../services/sort.service';
import { AsyncPipe, SlicePipe } from '@angular/common';
import { TuiPaginationModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { ListOfTeamsComponent } from '../../../team/list-of-teams/list-of-teams.component';
import { SportService } from '../../sport.service';
import { ItemSportComponent } from '../item-sport.component';

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
export class WithTeamsComponent
  extends ItemSportComponent
  implements AfterViewInit
{
  private teamService = inject(TeamService);

  teams$ = this.teamService.teams$;
  islandTeamTitleProperty: keyof ITeam = 'title';

  teamItemHref(item: ITeam): string {
    return `teams/id/${item.id}`;
  }

  ngAfterViewInit() {
    this.sportId$.subscribe((sportId) => {
      if (sportId) {
        console.log('Sport ID is available:', sportId);
        this.teamService.refreshTeamsInSport(sportId);
      } else {
        console.error(
          'Sport ID is not defined. Check your route configuration.',
        );
      }
    });
  }
}
