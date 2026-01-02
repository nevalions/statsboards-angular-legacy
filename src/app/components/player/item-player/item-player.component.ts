import { Component, inject } from '@angular/core';
import { Player } from '../player';
import { ImageService } from '../../../services/image.service';
import { urlWithProtocol } from '../../../base/constants';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { EditButtonComponent } from '../../../shared/ui/buttons/edit-button/edit-button.component';
import { AddEditPlayerComponent } from '../add-edit-player/add-edit-player.component';
import { Person } from '../../person/person';
import { AddEditPersonComponent } from '../../person/add-edit-person/add-edit-person.component';

@Component({
  selector: 'app-item-player',
  standalone: true,
  imports: [
    DeleteButtonComponent,
    DeleteDialogComponent,
    AsyncPipe,
    UpperCasePipe,
    EditButtonComponent,
    AddEditPlayerComponent,
    AddEditPersonComponent,
  ],
  templateUrl: './item-player.component.html',
  styleUrl: './item-player.component.less',
})
export class ItemPlayerComponent {
  private player = inject(Player);
  private person = inject(Person);
  private imageService = inject(ImageService);

  // currentPlayer$ = this.player.currentPlayer$;
  currentPlayerWithPerson$ = this.player.currentPlayerWithPerson$;
  availablePersonsForSport$ = this.person.availablePersonsForSport$;

  allPersons$ = this.person.allPersons$;
  allSportPlayersWithPerson$ = this.player.allSportPlayersWithPerson$;

  buttonTitle: string = 'Player';

  constructor() {
    const player = this.player;
    const person = this.person;

    player.loadAllPlayers();
    player.loadAllPlayersBySportId();
    person.loadAllPersons();
    player.loadCurrentPlayer();
  }

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  onDelete() {
    this.player.deletePlayer();
  }

  protected readonly url = urlWithProtocol;
}
