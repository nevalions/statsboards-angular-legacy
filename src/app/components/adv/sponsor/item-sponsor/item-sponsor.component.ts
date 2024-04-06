import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
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
  sponsor$ = this.sponsor.sponsor$;

  constructor(
    private sponsor: Sponsor,
    private imageService: ImageService,
  ) {
    sponsor.loadCurrentSponsor();
  }

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  protected readonly url = urlWithProtocol;
}
