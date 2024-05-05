import { Component, Input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { TuiAvatarModule, TuiIslandModule } from '@taiga-ui/kit';
import { IPlayer, IPlayerInSport } from '../../../type/player.type';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list-of-players',
  standalone: true,
  imports: [TitleCasePipe, TuiAvatarModule, TuiIslandModule],
  templateUrl: './list-of-players.component.html',
  styleUrl: './list-of-players.component.less',
})
export class ListOfPlayersComponent {
  @Input() players: IPlayerInSport[] = [];
  @Input() playerItemHref: (item: IPlayer) => string = () => '';

  backendUrl = environment.backendUrl;
}
