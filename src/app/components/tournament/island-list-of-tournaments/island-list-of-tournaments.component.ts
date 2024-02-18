import { Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiLoaderModule, TuiSizeL, TuiSizeS } from '@taiga-ui/core';
import { Observable, of } from 'rxjs';
import { ITournament } from '../../../type/tournament.type';

@Component({
  selector: 'app-island-list-of-tournaments',
  standalone: true,
  imports: [AsyncPipe, TuiIslandModule, TuiLoaderModule],
  templateUrl: './island-list-of-tournaments.component.html',
  styleUrl: './island-list-of-tournaments.component.less',
})
export class IslandListOfTournamentsComponent {
  @Input() emptyMessage: string = 'No data available';
  @Input() formatPath: (item: ITournament) => string = () => '';
  @Input() titleProperty: keyof ITournament = 'title';
  @Input() paragraphProperty: keyof ITournament = 'description';

  // Initialize with an empty array
  @Input() data$: Observable<ITournament[]> = of({} as ITournament[]);
  @Input() _size: TuiSizeL | TuiSizeS = 'l';
  @Input() hoverable: boolean = true;
}
