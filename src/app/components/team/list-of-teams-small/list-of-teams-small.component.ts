import { Component, inject, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ListOfItemsIslandComponent } from '../../../shared/ui/list/list-of-items-island/list-of-items-island.component';
import { TuiSizeL, TuiSizeS, TuiLoader } from '@taiga-ui/core';
import { Observable, of } from 'rxjs';
import { ITeam } from '../../../type/team.type';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-list-of-teams-small',
  standalone: true,
  imports: [AsyncPipe, ListOfItemsIslandComponent, TuiLoader],
  templateUrl: './list-of-teams-small.component.html',
  styleUrl: './list-of-teams-small.component.less',
})
export class ListOfTeamsSmallComponent {
  // @Input() teams$: Observable<ITeam[]> = of([]);
  @Input() teams: ITeam[] = [];

  @Input() formatPath: (item: ITeam) => string = () => '';
  @Input() titleProperty: keyof ITeam = 'title';
  @Input() _size: TuiSizeL | TuiSizeS = 's';
  @Input() hoverable: boolean = false;
}
