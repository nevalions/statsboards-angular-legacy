import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { AsyncPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { TuiLoaderModule, TuiSizeL, TuiSizeS } from '@taiga-ui/core';
import { Observable, of, Subscription } from 'rxjs';
import { SearchListService } from '../../../services/search-list.service';

@Component({
  selector: 'app-list-of-items-island',
  standalone: true,
  imports: [
    TuiIslandModule,
    AsyncPipe,
    TuiLoaderModule,
    TitleCasePipe,
    UpperCasePipe,
  ],
  templateUrl: './list-of-items-island.component.html',
  styleUrl: './list-of-items-island.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfItemsIslandComponent<T extends { id: number; p?: string }> {
  @Input() itemData: T = {} as T;

  @Input() emptyMessage: string = 'No data available';
  @Input() formatPath: (item: T) => string = () => '';
  @Input() titleProperty: keyof T = 'id';
  @Input() paragraphProperty: keyof T = 'p';

  // Initialize with an empty array
  @Input() data: T[] = [];

  // @Input() data$: Observable<T[]> = of({} as T[]);
  @Input() _size: TuiSizeL | TuiSizeS = 'l';
  @Input() hoverable: boolean = true;
}
