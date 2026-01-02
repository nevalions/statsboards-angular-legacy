import { Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { SponsorLine } from '../../../components/adv/sponsor-line/sponsorLine';
import { ImageService } from '../../../services/image.service';
import { urlWithProtocol } from '../../../base/constants';
import { AsyncPipe } from '@angular/common';
import { SponsorLineComponent } from '../sponsor-line/sponsor-line.component';

@Component({
  selector: 'app-sponsor-display-flat',
  standalone: true,
  imports: [AsyncPipe, SponsorLineComponent],
  templateUrl: './sponsor-display-flat.component.html',
  styleUrl: './sponsor-display-flat.component.less',
  // encapsulation: ViewEncapsulation.None,
})
export class SponsorDisplayFlatComponent {
  private sponsorLine = inject(SponsorLine);

  // @Input() tournamentId!: number;
  // @Input() sponsorLineId: number | null | undefined;
  sponsorLine$ = this.sponsorLine.sponsorLineWithFullData$;

  // onImgError(event: Event) {
  //   this.imageService.handleError(event);
  // }
  //
  // protected readonly url = urlWithProtocol;
}
