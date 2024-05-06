import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  TuiAvatarModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  TuiInputModule,
  tuiItemsHandlersProvider,
  TuiSelectModule,
  TuiStringifyContentPipeModule,
} from '@taiga-ui/kit';
import { NgForOf, NgIf, TitleCasePipe, UpperCasePipe } from '@angular/common';
import {
  TuiDataListModule,
  TuiDropdownModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { IPerson } from '../../../../type/person.type';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  stringifyNameSurname,
  stringifySurnameName,
  toTitleCase,
} from '../../../../base/helpers';
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
    TuiDropdownModule,
    TuiComboBoxModule,
    TuiFilterByInputPipeModule,
    TuiStringifyContentPipeModule,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: (person: IPerson) =>
        `${toTitleCase(person.second_name)} ${toTitleCase(person.first_name)}`,
    }),
  ],
  templateUrl: './search-input-autocomplete.component.html',
  styleUrl: './search-input-autocomplete.component.less',
})
export class SearchInputAutocompleteComponent {
  @Input() placeholder: string = 'person by last name';
  @Input() persons: IPerson[] = [];
  @Input() formField!: FormControl;

  backendUrl = environment.backendUrl;

  // @Output() search = new EventEmitter<string | null>();

  // searchForm = new FormGroup({
  //   searchValue: new FormControl(''),
  // });

  readonly form = new FormGroup({
    person: new FormControl<IPerson | null>(null),
  });

  constructor() {
    // this.searchForm
    //   .get('searchValue')!
    //   .valueChanges.pipe(debounceTime(200), distinctUntilChanged())
    //   .subscribe((searchTerm) => {
    //     this.search.emit(searchTerm);
    //   });
  }

  readonly matcherString = (person: IPerson, search: string): boolean =>
    person.second_name.toLowerCase().startsWith(search.toLowerCase());

  onSelected(person: IPerson): void {
    this.formField.setValue(person);
  }

  protected readonly stringifySurnameName = stringifySurnameName;
}
