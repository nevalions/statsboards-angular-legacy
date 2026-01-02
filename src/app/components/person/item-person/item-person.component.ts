import { Component, inject } from '@angular/core';
import { Person } from '../person';
import { ImageService } from '../../../services/image.service';
import { urlWithProtocol } from '../../../base/constants';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { EditButtonComponent } from '../../../shared/ui/buttons/edit-button/edit-button.component';
import { AddEditPersonComponent } from '../add-edit-person/add-edit-person.component';

@Component({
  selector: 'app-item-person',
  standalone: true,
  imports: [
    AsyncPipe,
    UpperCasePipe,
    DeleteButtonComponent,
    DeleteDialogComponent,
    EditButtonComponent,
    AddEditPersonComponent,
  ],
  templateUrl: './item-person.component.html',
  styleUrl: './item-person.component.less',
})
export class ItemPersonComponent {
  private person = inject(Person);
  private imageService = inject(ImageService);

  currentPerson$ = this.person.currentPerson$;
  buttonTitle: string = 'Person';

  constructor() {
    const person = this.person;

    person.loadCurrentPerson();
  }

  onImgError(event: Event) {
    this.imageService.handleError(event);
  }

  onDelete() {
    this.person.deletePerson();
  }

  protected readonly url = urlWithProtocol;
}
