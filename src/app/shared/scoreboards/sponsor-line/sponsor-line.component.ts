import { Component, Input, inject } from '@angular/core';
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
  private imageService = inject(ImageService);

  @Input() sponsorLine: ISponsorLineFullData | null | undefined;

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  protected readonly url = urlWithProtocol;
}
