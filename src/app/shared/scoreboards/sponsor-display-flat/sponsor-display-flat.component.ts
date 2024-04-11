import { Component, Input } from '@angular/core';
import { SponsorLine } from '../../../components/adv/sponsor-line/sponsorLine';
import { ImageService } from '../../../services/image.service';
import { urlWithProtocol } from '../../../base/constants';
import { AsyncPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-sponsor-display-flat',
  standalone: true,
  imports: [AsyncPipe, UpperCasePipe],
  templateUrl: './sponsor-display-flat.component.html',
  styleUrl: './sponsor-display-flat.component.less',
})
export class SponsorDisplayFlatComponent {
  @Input() tournamentId!: number;
  @Input() sponsorLineId: number = 1;
  sponsorLine$ = this.sponsorLine.sponsorLineWithFullData$;

  constructor(
    private sponsorLine: SponsorLine,
    private imageService: ImageService,
  ) {
    sponsorLine.loadSponsorLineWithFullData(this.sponsorLineId);
  }

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  protected readonly url = urlWithProtocol;
}
