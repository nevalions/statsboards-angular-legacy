import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { ListOfItemsIslandComponent } from '../../../../shared/ui/list-of-items-island/list-of-items-island.component';
import { Observable } from 'rxjs';
import { ITeam } from '../../../../type/team.type';
import { RouterLink } from '@angular/router';
import { AsyncPipe, SlicePipe } from '@angular/common';
import { TuiPaginationModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { ListOfTeamsComponent } from '../../../team/list-of-teams/list-of-teams.component';
import { ItemSportComponent } from '../item-sport.component';
import { Store } from '@ngrx/store';
import { TeamState } from '../../../team/store/reducers';
import { teamActions } from '../../../team/store/actions';
import { AppState } from '../../../../store/appstate';

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
export class WithTeamsComponent {
  store: Store<AppState> = inject(Store);
  teams$: Observable<ITeam[]> = this.store.select(
    (state) => state.team.allTeamsInSport,
  );

  constructor() {
    // this.store.dispatch(teamActions.getTeamsBySportId({ id: sportId }));
  }

  islandTeamTitleProperty: keyof ITeam = 'title';

  teamItemHref(item: ITeam): string {
    return `teams/id/${item.id}`;
  }

  ngAfterViewInit() {
    // this.sportId$.subscribe((sportId) => {
    //   if (sportId) {
    //     console.log('Sport ID is available:', sportId);
    //     this.teamStore.dispatch(teamActions.getTeamsBySportId({ id: sportId }));
    //   } else {
    //     console.error(
    //       'Sport ID is not defined. Check your route configuration.',
    //     );
    //   }
    // });
  }
}
