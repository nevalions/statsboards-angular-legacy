import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { Sponsor } from '../sponsor';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { urlWithProtocol } from '../../../../base/constants';
import { ImageService } from '../../../../services/image.service';

@Component({
  selector: 'app-item-store',
  standalone: true,
  imports: [AsyncPipe, UpperCasePipe],
  templateUrl: './item-sponsor.component.html',
  styleUrl: './item-sponsor.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSponsorComponent {
  private sponsor = inject(Sponsor);
  private imageService = inject(ImageService);

  sponsor$ = this.sponsor.currentSponsor$;

  constructor() {
    const sponsor = this.sponsor;

    sponsor.loadCurrentSponsorByUrlId();
  }

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  protected readonly url = urlWithProtocol;
}
