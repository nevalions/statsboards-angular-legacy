import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { SponsorLine } from '../sponsorLine';
import { ImageService } from '../../../../services/image.service';
import { urlWithProtocol } from '../../../../base/constants';
import { AsyncPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-item-sponsor-line',
  standalone: true,
  imports: [AsyncPipe, UpperCasePipe],
  templateUrl: './item-sponsor-line.component.html',
  styleUrl: './item-sponsor-line.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSponsorLineComponent {
  private sponsorLine = inject(SponsorLine);
  private imageService = inject(ImageService);

  sponsorLine$ = this.sponsorLine.sponsorLineWithFullData$;

  constructor() {
    const sponsorLine = this.sponsorLine;

    sponsorLine.loadCurrentSponsorLine();
  }

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  protected readonly url = urlWithProtocol;
}
