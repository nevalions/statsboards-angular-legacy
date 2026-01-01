import { TuiInitialsPipe } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ImageService } from '../../../services/image.service';
import { IPlayerInMatchFullData } from '../../../type/player.type';

@Component({
  selector: 'app-player-card-roster',
  standalone: true,
  imports: [TuiAvatar, UpperCasePipe],
  templateUrl: './player-card-roster.component.html',
  styleUrl: './player-card-roster.component.less',
})
export class PlayerCardRosterComponent {
  @Input() player: IPlayerInMatchFullData | null = null;

  constructor(private imageService: ImageService) {}

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }
  getPlayerInitials(player: any): string {
    if (!player.person) return '';
    return `${player.person.first_name || ''} ${player.person.second_name || ''}`;
  }

  backendUrl = environment.backendUrl;
}
