import { TuiAvatar } from "@taiga-ui/kit";
import { Component, Input, inject } from '@angular/core';
import { ImageService } from '../../../services/image.service';
import { environment } from '../../../../environments/environment';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { PlayerInMatch } from '../../../components/player-match/player-match';
import { hexToRgba } from '../../../base/helpers';

@Component({
  selector: 'app-player-match-lower-display-flat',
  standalone: true,
  imports: [TuiAvatar, UpperCasePipe, AsyncPipe],
  templateUrl: './player-match-lower-display-flat.component.html',
  styleUrl: './player-match-lower-display-flat.component.less',
})
export class PlayerMatchLowerDisplayFlatComponent {
  private playerInMatch = inject(PlayerInMatch);
  private imageService = inject(ImageService);

  player$ = this.playerInMatch.selectSelectedPlayerInMatchLower$;
  @Input() teamColor: string = '#3b3b3b';

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  backendUrl = environment.backendUrl;
  protected readonly hexToRgba = hexToRgba;
}
