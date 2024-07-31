import { Component, Input } from '@angular/core';
import { ImageService } from '../../../services/image.service';
import { environment } from '../../../../environments/environment';
import { hexToRgba } from '../../../base/helpers';
import { FootballEvent } from '../../../components/match-event/football-event/football-event';
import { IFootballTeamWithStats } from '../../../type/team.type';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { TuiAvatarModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-team-match-lower-football-stats-display-flat',
  standalone: true,
  imports: [AsyncPipe, TuiAvatarModule, UpperCasePipe],
  templateUrl: './team-match-lower-football-stats-display-flat.component.html',
  styleUrl: './team-match-lower-football-stats-display-flat.component.less',
})
export class TeamMatchLowerFootballStatsDisplayFlatComponent {
  @Input() footballTeamWithStats: IFootballTeamWithStats | null = null;
  @Input() teamColor: string = '#3b3b3b';

  constructor(
    private footballEvent: FootballEvent,
    private imageService: ImageService,
  ) {}

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  backendUrl = environment.backendUrl;
  protected readonly hexToRgba = hexToRgba;
}
