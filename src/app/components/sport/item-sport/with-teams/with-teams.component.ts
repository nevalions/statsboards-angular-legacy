import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ITeam } from '../../../../type/team.type';
import { RouterLink } from '@angular/router';
import { AsyncPipe, SlicePipe, UpperCasePipe } from '@angular/common';
import { TuiPaginationModule } from '@taiga-ui/kit';
import { TuiLoaderModule } from '@taiga-ui/core';
import { ListOfTeamsComponent } from '../../../team/list-of-teams/list-of-teams.component';
import { Sport } from '../../sport';
import { Team } from '../../../team/team';

@Component({
  selector: 'app-with-teams',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiPaginationModule,
    SlicePipe,
    RouterLink,
    ListOfTeamsComponent,
    TuiLoaderModule,
    UpperCasePipe,
  ],
  templateUrl: './with-teams.component.html',
  styleUrl: './with-teams.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithTeamsComponent {
  sport$ = this.sport.sport$;
  teamsInSport$ = this.team.teamsInSport$;

  constructor(
    private sport: Sport,
    private team: Team,
  ) {
    sport.loadCurrentSport();
    team.loadAllTeamsInSport();
  }

  islandTeamTitleProperty: keyof ITeam = 'title';

  teamItemHref(item: ITeam): string {
    return `team/${item.id}`;
  }
}
