import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  TuiAvatarModule,
  TuiDataListWrapperModule,
  TuiInputModule,
  tuiItemsHandlersProvider,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { NgForOf, NgIf, TitleCasePipe, UpperCasePipe } from '@angular/common';
import {
  TuiDataListModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { IPerson } from '../../../../type/person.type';
import { TuiLetModule } from '@taiga-ui/cdk';
import { stringifyNameSurname, toTitleCase } from '../../../../base/helpers';
import { environment } from '../../../../../environments/environment';
import { WithNullOptionPipe } from '../../../../pipes/with-null-option.pipe';
import { Person } from '../../../../components/person/person';

@Component({
  selector: 'app-search-input-autocomplete',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    UpperCasePipe,
    TuiTextfieldControllerModule,
    TuiLetModule,
    TuiDataListModule,
    NgForOf,
    TuiAvatarModule,
    NgIf,
    TitleCasePipe,
    TuiSelectModule,
    TuiDataListWrapperModule,
    WithNullOptionPipe,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: (person: IPerson) =>
        `${toTitleCase(person.first_name)} ${toTitleCase(person.second_name)}`,
    }),
  ],
  templateUrl: './search-input-autocomplete.component.html',
  styleUrl: './search-input-autocomplete.component.less',
})
export class SearchInputAutocompleteComponent {
  @Input() placeholder: string = 'item';
  @Input() persons: IPerson[] = [];
  @Input() formField!: FormControl;

  backendUrl = environment.backendUrl;

  @Output() search = new EventEmitter<string | null>();

  // selectedPerson: IPerson | null = null;

  searchForm = new FormGroup({
    searchValue: new FormControl(''),
    // searchPerson: new FormControl<IPerson | null>(null),
  });

  constructor() {
    this.searchForm
      .get('searchValue')!
      .valueChanges.pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.search.emit(searchTerm);
      });
  }

  onSelected(person: IPerson): void {
    // this.selectedPerson = person;

    this.formField.setValue(person);
  }

  protected readonly stringifyNameSurname = stringifyNameSurname;
}
