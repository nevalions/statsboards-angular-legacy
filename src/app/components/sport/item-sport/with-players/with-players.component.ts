import { Component } from '@angular/core';
import { Player } from '../../../player/player';
import { Person } from '../../../person/person';
import { IPlayer } from '../../../../type/player.type';
import { Sport } from '../../sport';
import { AsyncPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { EditButtonComponent } from '../../../../shared/ui/buttons/edit-button/edit-button.component';
import { ListOfItemsIslandComponent } from '../../../../shared/ui/list-of-items-island/list-of-items-island.component';
import { TuiAvatarModule, TuiIslandModule } from '@taiga-ui/kit';
import { environment } from '../../../../../environments/environment';
import { AddEditPlayerComponent } from '../../../player/add-edit-player/add-edit-player.component';

@Component({
  selector: 'app-with-players',
  standalone: true,
  imports: [
    AsyncPipe,
    UpperCasePipe,
    EditButtonComponent,
    ListOfItemsIslandComponent,
    TuiIslandModule,
    TitleCasePipe,
    TuiAvatarModule,
    AddEditPlayerComponent,
  ],
  templateUrl: './with-players.component.html',
  styleUrl: './with-players.component.less',
})
export class WithPlayersComponent {
  sport$ = this.sport.currentSport$;
  allPersons$ = this.person.allPersons$;
  allPlayersInSport$ = this.player.allSportPlayersWithPerson$;

  constructor(
    private sport: Sport,
    private player: Player,
    private person: Person,
  ) {
    person.loadAllPersons();
    player.loadAllPlayersBySportId();
  }

  playerItemHref(item: IPlayer): string {
    return `/sport/${item.sport_id}/player/${item.id}`;
  }

  backendUrl = environment.backendUrl;
}
