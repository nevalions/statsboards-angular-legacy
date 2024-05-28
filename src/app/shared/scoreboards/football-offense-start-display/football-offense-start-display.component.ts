import { UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { environment } from '../../../../environments/environment';
import { ImageService } from '../../../services/image.service';
import { IPlayerInMatchFullData } from '../../../type/player.type';
import { ITeam } from '../../../type/team.type';
import { OlineStartComponent } from '../oline-start/oline-start.component';
import { QbWrStartComponent } from '../qb-wr-start/qb-wr-start.component';

@Component({
  selector: 'app-football-offense-start-display',
  standalone: true,
  imports: [
    TuiAvatarModule,
    UpperCasePipe,
    OlineStartComponent,
    QbWrStartComponent,
  ],
  templateUrl: './football-offense-start-display.component.html',
  styleUrl: './football-offense-start-display.component.less',
})
export class FootballOffenseStartDisplayComponent {
  @Input() players: IPlayerInMatchFullData[] = [];
  @Input() team: ITeam | null = null;

  constructor(private imageService: ImageService) {}

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  backendUrl = environment.backendUrl;
}
