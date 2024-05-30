import { Component, Input } from '@angular/core';
import { IPlayerInMatchFullData } from '../../../type/player.type';
import { ImageService } from '../../../services/image.service';
import { environment } from '../../../../environments/environment';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { PlayerInMatch } from '../../../components/player-match/player-match';

@Component({
  selector: 'app-player-match-lower-display-flat',
  standalone: true,
  imports: [TuiAvatarModule, UpperCasePipe, AsyncPipe],
  templateUrl: './player-match-lower-display-flat.component.html',
  styleUrl: './player-match-lower-display-flat.component.less',
})
export class PlayerMatchLowerDisplayFlatComponent {
  // @Input() player: IPlayerInMatchFullData | undefined | null = null;

  player$ = this.playerInMatch.selectSelectedPlayerInMatchLower$;

  constructor(
    private playerInMatch: PlayerInMatch,
    private imageService: ImageService,
  ) {}

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  backendUrl = environment.backendUrl;
}
