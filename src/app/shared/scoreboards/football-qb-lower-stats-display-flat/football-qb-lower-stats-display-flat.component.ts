import { TuiAvatar } from "@taiga-ui/kit";
import { Component, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PlayerInMatch } from '../../../components/player-match/player-match';
import { ImageService } from '../../../services/image.service';
import { hexToRgba } from '../../../base/helpers';
import { AsyncPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-football-qb-lower-stats-display-flat',
  standalone: true,
  imports: [AsyncPipe, TuiAvatar, UpperCasePipe],
  templateUrl: './football-qb-lower-stats-display-flat.component.html',
  styleUrl: './football-qb-lower-stats-display-flat.component.less',
})
export class FootballQbLowerStatsDisplayFlatComponent {
  selectedFootballQbWithFullStats$ =
    this.playerInMatch.selectSelectedFootballQbFullStatsInMatchLower$;
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
