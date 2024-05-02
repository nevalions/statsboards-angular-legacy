import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Person } from '../person';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { EditButtonComponent } from '../../../shared/ui/buttons/edit-button/edit-button.component';
import { ListOfItemsIslandComponent } from '../../../shared/ui/list-of-items-island/list-of-items-island.component';
import { TuiLoaderModule } from '@taiga-ui/core';
import { ITeam } from '../../../type/team.type';
import { IPerson } from '../../../type/person.type';
import { AddEditPersonComponent } from '../add-edit-person/add-edit-person.component';

@Component({
  selector: 'app-all-persons',
  standalone: true,
  imports: [
    RouterOutlet,
    UpperCasePipe,
    EditButtonComponent,
    ListOfItemsIslandComponent,
    AsyncPipe,
    TuiLoaderModule,
    AddEditPersonComponent,
  ],
  templateUrl: './all-persons.component.html',
  styleUrl: './all-persons.component.less',
})
export class AllPersonsComponent {
  allPersons$ = this.person.allPersons$;

  constructor(private person: Person) {
    person.loadAllPersons();
  }

  first_name: keyof IPerson = 'first_name';
  second_name: keyof IPerson = 'second_name';

  personItemHref(item: ITeam): string {
    return `person/${item.id}`;
  }
}
