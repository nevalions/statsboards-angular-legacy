import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SponsorLine } from '../../../components/adv/sponsor-line/sponsorLine';
import { ImageService } from '../../../services/image.service';
import { urlWithProtocol } from '../../../base/constants';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { SponsorLineComponent } from '../sponsor-line/sponsor-line.component';

@Component({
  selector: 'app-sponsor-display-flat',
  standalone: true,
  imports: [AsyncPipe, UpperCasePipe, SponsorLineComponent],
  templateUrl: './sponsor-display-flat.component.html',
  styleUrl: './sponsor-display-flat.component.less',
  // encapsulation: ViewEncapsulation.None,
})
export class SponsorDisplayFlatComponent {
  // @Input() tournamentId!: number;
  // @Input() sponsorLineId: number | null | undefined;
  sponsorLine$ = this.sponsorLine.sponsorLineWithFullData$;

  constructor(
    private sponsorLine: SponsorLine,
    // private imageService: ImageService,
  ) {
    // if (this.sponsorLineId) {
    //   sponsorLine.loadSponsorLineWithFullData(this.sponsorLineId);
    // }
  }

  // onImgError(event: Event) {
  //   this.imageService.handleError(event);
  // }
  //
  // protected readonly url = urlWithProtocol;
}
