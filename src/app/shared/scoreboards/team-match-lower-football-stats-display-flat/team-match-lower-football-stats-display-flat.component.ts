import { Component, Input } from '@angular/core';
import { ImageService } from '../../../services/image.service';
import { environment } from '../../../../environments/environment';
import { hexToRgba } from '../../../base/helpers';
import { IFootballTeamWithStats } from '../../../type/team.type';

@Component({
  selector: 'app-team-match-lower-football-stats-display-flat',
  standalone: true,
  templateUrl: './team-match-lower-football-stats-display-flat.component.html',
  styleUrl: './team-match-lower-football-stats-display-flat.component.less',
})
export class TeamMatchLowerFootballStatsDisplayFlatComponent {
  @Input() footballTeamWithStats: IFootballTeamWithStats | null = null;
  @Input() teamColor: string = '#3b3b3b';

  constructor(private imageService: ImageService) { }

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  backendUrl = environment.backendUrl;
  protected readonly hexToRgba = hexToRgba;
}
