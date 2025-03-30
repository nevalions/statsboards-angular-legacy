import { Component, Input, } from '@angular/core';
import { ImageService } from '../../../services/image.service';
import { urlWithProtocol } from '../../../base/constants';
import { UpperCasePipe } from '@angular/common';
import { ISponsorLineFullData } from '../../../type/sponsor.type';

@Component({
  selector: 'app-sponsor-line',
  standalone: true,
  imports: [UpperCasePipe,],
  templateUrl: './sponsor-line.component.html',
  styleUrl: './sponsor-line.component.less',
})
export class SponsorLineComponent {
  @Input() sponsorLine: ISponsorLineFullData | null | undefined;

  constructor(
    private imageService: ImageService,
  ) { }

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  protected readonly url = urlWithProtocol;
}
