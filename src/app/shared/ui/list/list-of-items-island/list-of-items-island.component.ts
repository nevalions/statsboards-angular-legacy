import { TuiAvatar } from "@taiga-ui/kit";
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { TuiAppearance, TuiLoader, TuiSizeL, TuiSizeS, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { environment } from '../../../../../environments/environment';
import { getTitleCase } from '../../../../base/helpers';
import { TuiCardLarge, TuiCell } from "@taiga-ui/layout";
import { Router } from "@angular/router";
import { navigateToItem } from "../../../../base/helpers";

@Component({
  selector: 'app-list-of-items-island',
  standalone: true,
  imports: [
    TuiCardLarge,
    TuiCell,
    TuiTitle,
    TuiSurface,
    TuiAppearance,
    TitleCasePipe,
    TuiAvatar,
    TuiLoader,
  ],
  templateUrl: './list-of-items-island.component.html',
  styleUrl: './list-of-items-island.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfItemsIslandComponent<
  T extends { id: number; p?: string; none: '' },
> {
  private router = inject(Router);

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

  navigate(item: T): void {
    const url = this.formatPath(item);
    navigateToItem(url, this.router);
  }

  apiUrl = environment.url
  backendUrl = environment.backendUrl;
  protected readonly getTitleCase = getTitleCase;
}
