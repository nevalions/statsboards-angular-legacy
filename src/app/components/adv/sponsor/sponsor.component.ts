import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { Sponsor } from './sponsor';
import { ListOfItemsIslandComponent } from '../../../shared/ui/list/list-of-items-island/list-of-items-island.component';
import { AsyncPipe } from '@angular/common';
import { ISponsor } from '../../../type/sponsor.type';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [ListOfItemsIslandComponent, AsyncPipe,],
  templateUrl: './sponsor.component.html',
  styleUrl: './sponsor.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsorComponent {
  private sponsor = inject(Sponsor);

  sponsors$ = this.sponsor.allSponsors$;

  constructor() {
    const sponsor = this.sponsor;

    sponsor.loadAllSponsors();
  }

  islandTitleProperty: keyof ISponsor = 'title';

  itemHref(item: ISponsor): string {
    return `home/adv/sponsor/${item.id}`;
  }
}
