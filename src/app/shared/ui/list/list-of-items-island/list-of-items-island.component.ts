import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TuiAvatarModule, TuiIslandModule } from '@taiga-ui/kit';
import { AsyncPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { TuiLoaderModule, TuiSizeL, TuiSizeS } from '@taiga-ui/core';
import { Observable, of, Subscription } from 'rxjs';
import { SearchListService } from '../../../../services/search-list.service';
import { environment } from '../../../../../environments/environment';
import { getTitleCase } from '../../../../base/helpers';

@Component({
  selector: 'app-list-of-items-island',
  standalone: true,
  imports: [
    TuiIslandModule,
    AsyncPipe,
    TuiLoaderModule,
    TitleCasePipe,
    UpperCasePipe,
    TuiAvatarModule,
  ],
  templateUrl: './list-of-items-island.component.html',
  styleUrl: './list-of-items-island.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfItemsIslandComponent<
  T extends { id: number; p?: string; none: '' },
> {
  @Input() itemData: T = {} as T;

  @Input() emptyMessage: string = 'No data available';
  @Input() formatPath: (item: T) => string = () => '';
  @Input() titleProperty: keyof T = 'none';
  @Input() titlePropertyFirst: keyof T = 'none';
  @Input() titlePropertySecond: keyof T = 'none';
  @Input() avatarUrl: keyof T = 'none';

  @Input() paragraphProperty: keyof T = 'p';

  @Input() data: T[] = [];

  @Input() _size: TuiSizeL | TuiSizeS = 'l';
  @Input() hoverable: boolean = true;

  backendUrl = environment.backendUrl;

  protected readonly getTitleCase = getTitleCase;
}
