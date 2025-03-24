import { TuiFallbackSrcPipe, TuiInitialsPipe } from "@taiga-ui/core";
import { TuiAvatar } from "@taiga-ui/kit";
import { TuiIslandDirective } from "@taiga-ui/legacy";
import { Component, Input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { IPlayer, IPlayerInSport } from '../../../type/player.type';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list-of-players',
  standalone: true,
  imports: [TitleCasePipe, TuiAvatar, TuiIslandDirective, TuiFallbackSrcPipe, TuiInitialsPipe],
  templateUrl: './list-of-players.component.html',
  styleUrl: './list-of-players.component.less',
})
export class ListOfPlayersComponent {
  @Input() players: IPlayerInSport[] = [];
  @Input() playerItemHref: (item: IPlayer) => string = () => '';

  backendUrl = environment.backendUrl;
}
