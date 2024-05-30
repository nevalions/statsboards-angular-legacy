import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
export class PlayerMatchLowerDisplayFlatComponent implements OnInit, OnChanges {
  player$ = this.playerInMatch.selectSelectedPlayerInMatchLower$;
  @Input() playerId: number | null | undefined = null;
  @Input() teamColor: string | null | undefined = '#3b3b3b';

  constructor(
    private playerInMatch: PlayerInMatch,
    private imageService: ImageService,
  ) {}

  ngOnInit() {
    if (this.playerId) {
      // console.log('oninitplayer', this.playerId);
      this.playerInMatch.getPlayerLowerSelect(this.playerId);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['playerId']) {
      // console.log('onchangesplayer', this.playerId);
      if (this.playerId) {
        this.playerInMatch.getPlayerLowerSelect(this.playerId);
      }
    }
  }

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  backendUrl = environment.backendUrl;
}
