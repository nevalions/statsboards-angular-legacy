import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderMenuComponent } from '../../../shared/ui/headermenu/header-menu.component';
import { IBaseIdElse } from '../../../type/base.type';
import { TuiLoaderModule } from '@taiga-ui/core';
import { AsyncPipe } from '@angular/common';

import { Sport } from '../sport';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sport-nav',
  standalone: true,
  imports: [HeaderMenuComponent, TuiLoaderModule, AsyncPipe],
  templateUrl: './sport-nav.component.html',
  styleUrl: './sport-nav.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportNavComponent {
  sports$ = this.sport.allSports$;

  constructor(private sport: Sport) {
    sport.loadAllSports();
  }

  mapItemToLabel(item: IBaseIdElse): string {
    return item.title ?? '';
  }

  sportRoutWithSeason(item: IBaseIdElse): any[] {
    return [
      `/sport/${item.id}/season/${environment.currentSeasonId}/tournaments`,
    ];
  }

  sportTeamsRout(item: IBaseIdElse): any[] {
    return [`/sport/${item.id}/teams`];
  }

  sportPlayersRout(item: IBaseIdElse): any[] {
    return [`/sport/${item.id}/players`];
  }

  sportPositionsRout(item: IBaseIdElse): any[] {
    return [`/sport/${item.id}/positions`];
  }
}
