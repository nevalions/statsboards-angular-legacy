import { Component, Input } from '@angular/core';
import { ImageService } from '../../../services/image.service';
import { environment } from '../../../../environments/environment';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { PlayerInMatch } from '../../../components/player-match/player-match';
import { hexToRgba } from '../../../base/helpers';

@Component({
  selector: 'app-player-match-lower-display-flat',
  standalone: true,
  imports: [TuiAvatarModule, UpperCasePipe, AsyncPipe],
  templateUrl: './player-match-lower-display-flat.component.html',
  styleUrl: './player-match-lower-display-flat.component.less',
})
export class PlayerMatchLowerDisplayFlatComponent {
  player$ = this.playerInMatch.selectSelectedPlayerInMatchLower$;
  @Input() teamColor: string = '#3b3b3b';

  constructor(
    private playerInMatch: PlayerInMatch,
    private imageService: ImageService,
  ) {}

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  backendUrl = environment.backendUrl;
  protected readonly hexToRgba = hexToRgba;
}
