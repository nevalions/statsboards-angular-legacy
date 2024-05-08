import { Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ListOfItemsIslandComponent } from '../../../shared/ui/list/list-of-items-island/list-of-items-island.component';
import { TuiLoaderModule, TuiSizeL, TuiSizeS } from '@taiga-ui/core';
import { Observable, of } from 'rxjs';
import { ITeam } from '../../../type/team.type';
import { stringifyTitle } from '../../../base/helpers';

@Component({
  selector: 'app-list-of-teams-with-city',
  standalone: true,
  imports: [AsyncPipe, ListOfItemsIslandComponent, TuiLoaderModule],
  templateUrl: './list-of-teams-with-city.component.html',
  styleUrl: './list-of-teams-with-city.component.less',
})
export class ListOfTeamsWithCityComponent {
  // @Input() teams$: Observable<ITeam[]> = of([]);
  @Input() teams: ITeam[] = [];

  @Input() formatPath: (item: ITeam) => string = () => '';
  @Input() titleProperty: keyof ITeam = 'title';
  @Input() _size: TuiSizeL | TuiSizeS = 's';
  @Input() hoverable: boolean = false;
  protected readonly stringifyTitle = stringifyTitle;
}
