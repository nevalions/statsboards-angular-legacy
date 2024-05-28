import { UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TuiAvatarModule } from '@taiga-ui/kit';
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

@Component({
  selector: 'app-football-offense-start-display',
  standalone: true,
  imports: [
    TuiAvatarModule,
    UpperCasePipe,
    OlineStartComponent,
    QbWrStartComponent,
    BacksStartComponent,
    DlineStartsComponent,
    LbStartsComponent,
    DbStartsComponent,
  ],
  templateUrl: './football-offense-start-display.component.html',
  styleUrl: './football-offense-start-display.component.less',
})
export class FootballOffenseStartDisplayComponent {
  @Input() side: 'offense' | 'defense' = 'offense';
  @Input() players: IPlayerInMatchFullData[] = [];
  @Input() team?: ITeam | null = null;

  constructor(private imageService: ImageService) {}

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  backendUrl = environment.backendUrl;
}
