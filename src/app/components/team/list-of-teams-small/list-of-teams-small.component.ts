import { Component, inject, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ListOfItemsIslandComponent } from '../../../shared/ui/list-of-items-island/list-of-items-island.component';
import { TuiLoaderModule, TuiSizeL, TuiSizeS } from '@taiga-ui/core';
import { Observable, of } from 'rxjs';
import { ITeam } from '../../../type/team.type';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-list-of-teams-small',
  standalone: true,
  imports: [AsyncPipe, ListOfItemsIslandComponent, TuiLoaderModule],
  templateUrl: './list-of-teams-small.component.html',
  styleUrl: './list-of-teams-small.component.less',
})
export class ListOfTeamsSmallComponent {
  teamService = inject(TeamService);

  @Input() teams$: Observable<ITeam[]> = of([]);

  @Input() formatPath: (item: ITeam) => string = () => '';
  @Input() titleProperty: keyof ITeam = 'title';
  @Input() _size: TuiSizeL | TuiSizeS = 's';
  @Input() hoverable: boolean = false;
}
