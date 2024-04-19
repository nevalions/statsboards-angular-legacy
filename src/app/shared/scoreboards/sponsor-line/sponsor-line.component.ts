import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SponsorLine } from '../../../components/adv/sponsor-line/sponsorLine';
import { ImageService } from '../../../services/image.service';
import { urlWithProtocol } from '../../../base/constants';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { ISponsorLine, ISponsorLineFullData } from '../../../type/sponsor.type';

@Component({
  selector: 'app-sponsor-line',
  standalone: true,
  imports: [UpperCasePipe, AsyncPipe],
  templateUrl: './sponsor-line.component.html',
  styleUrl: './sponsor-line.component.less',
  // encapsulation: ViewEncapsulation.None,
})
export class SponsorLineComponent {
  @Input() sponsorLine: ISponsorLineFullData | null | undefined;

  constructor(
    // private sponsorLine: SponsorLine,
    private imageService: ImageService,
  ) {}

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  protected readonly url = urlWithProtocol;
}
