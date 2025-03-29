import { TuiAppearance, TuiFallbackSrcPipe, TuiInitialsPipe, TuiLoader, TuiSurface, TuiTitle } from "@taiga-ui/core";
import { TuiAvatar } from "@taiga-ui/kit";
import { TuiIslandDirective } from "@taiga-ui/legacy";
import { Component, Input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { IPlayer, IPlayerInSport } from '../../../type/player.type';
import { environment } from '../../../../environments/environment';
import { TuiCardLarge, TuiCell } from "@taiga-ui/layout";
import { Router } from "@angular/router";

@Component({
  selector: 'app-list-of-players',
  standalone: true,
  imports: [
    TuiCardLarge,
    TuiCell,
    TuiTitle,
    TuiSurface,
    TuiAppearance,
    TitleCasePipe,
    TuiAvatar,
    TuiLoader,
    TitleCasePipe,
    TuiAvatar,
  ],
  templateUrl: './list-of-players.component.html',
  styleUrl: './list-of-players.component.less',
})
export class ListOfPlayersComponent {
  @Input() players: IPlayerInSport[] = [];
  @Input() playerItemHref: (item: IPlayer) => string = () => '';

  constructor(
    private router: Router,
  ) { }

  // TODO: move to helper function
  navigateToItem(urlItem: string): void {
    if (urlItem) {
      const segments = urlItem.split('/');
      this.router.navigate(segments);
    }
  }


  backendUrl = environment.backendUrl;
}
