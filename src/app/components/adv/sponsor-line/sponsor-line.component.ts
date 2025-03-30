import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ListOfItemsIslandComponent } from '../../../shared/ui/list/list-of-items-island/list-of-items-island.component';
import { AsyncPipe } from '@angular/common';
import { SponsorLine } from './sponsorLine';
import { ISponsor } from '../../../type/sponsor.type';

@Component({
  selector: 'app-store-line',
  standalone: true,
  imports: [ListOfItemsIslandComponent, AsyncPipe],
  templateUrl: './sponsor-line.component.html',
  styleUrl: './sponsor-line.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsorLineComponent {
  sponsorLines$ = this.sponsorLine.allSponsorLines$;

  constructor(private sponsorLine: SponsorLine) {
    sponsorLine.loadAllSponsorLines();
  }
  // TODO: Change from ISponsor to ISponsorLineWithFullData
  islandTitleProperty: keyof ISponsor = 'title';

  itemHref(item: ISponsor): string {
    return `home/adv/sponsors/line/${item.id}`;
  }
}
