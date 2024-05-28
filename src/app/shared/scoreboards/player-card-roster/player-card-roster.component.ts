import { UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { environment } from '../../../../environments/environment';
import { ImageService } from '../../../services/image.service';
import { IPlayerInMatchFullData } from '../../../type/player.type';

@Component({
  selector: 'app-player-card-roster',
  standalone: true,
  imports: [TuiAvatarModule, UpperCasePipe],
  templateUrl: './player-card-roster.component.html',
  styleUrl: './player-card-roster.component.less',
})
export class PlayerCardRosterComponent {
  @Input() player: IPlayerInMatchFullData | null = null;

  constructor(private imageService: ImageService) {}

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  backendUrl = environment.backendUrl;
}
