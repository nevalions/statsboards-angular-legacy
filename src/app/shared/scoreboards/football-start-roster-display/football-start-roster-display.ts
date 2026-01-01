import { TuiAvatar } from '@taiga-ui/kit';
import { UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ImageService } from '../../../services/image.service';
import { IPlayerInMatchFullData } from '../../../type/player.type';
import { ITeam } from '../../../type/team.type';
import { BacksStartComponent } from '../backs-start/backs-start.component';
import { OlineStartComponent } from '../oline-start/oline-start.component';
import { QbWrStartComponent } from '../qb-wr-start/qb-wr-start.component';
import { DlineStartsComponent } from '../dline-starts/dline-starts.component';
import { LbStartsComponent } from '../lb-starts/lb-starts.component';
import { DbStartsComponent } from '../db-starts/db-starts.component';
import { hexToRgba } from '../../../base/helpers';

@Component({
  selector: 'app-football-start-roster-display',
  standalone: true,
  imports: [
    TuiAvatar,
    UpperCasePipe,
    OlineStartComponent,
    QbWrStartComponent,
    BacksStartComponent,
    DlineStartsComponent,
    LbStartsComponent,
    DbStartsComponent,
  ],
  templateUrl: './football-start-roster-display.html',
  styleUrl: './football-start-roster-display.less',
})
export class FootballStartRosterDisplayComponent {
  @Input() side: 'offense' | 'defense' = 'offense';
  @Input() players: IPlayerInMatchFullData[] = [];
  @Input() team?: ITeam | null = null;
  @Input() scoreboardTeamColor: string = '9EBE9ECC';

  constructor(private imageService: ImageService) {}

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  backendUrl = environment.backendUrl;
  protected readonly hexToRgba = hexToRgba;
}
