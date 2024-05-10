import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  tuiItemsHandlersProvider,
  TuiStringifyContentPipeModule,
} from '@taiga-ui/kit';
import { UpperCasePipe } from '@angular/common';
import { IPerson } from '../../../../type/person.type';
import { stringifySurnameName, toTitleCase } from '../../../../base/helpers';

@Component({
  selector: 'app-search-person-input-autocomplete',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiComboBoxModule,
    UpperCasePipe,
    TuiDataListWrapperModule,
    TuiStringifyContentPipeModule,
    TuiFilterByInputPipeModule,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: (person: IPerson) =>
        `${toTitleCase(person.second_name)} ${toTitleCase(person.first_name)}`,
    }),
  ],
  templateUrl: './search-person-input-autocomplete.component.html',
  styleUrl: './search-person-input-autocomplete.component.less',
})
export class SearchPersonInputAutocompleteComponent {
  @Input() placeholder: string = 'person by last name';
  @Input() persons: IPerson[] | null = [];
  @Input() control!: FormControl;

  readonly form = new FormGroup({
    person: new FormControl<IPerson | null>(null),
  });

  constructor() {}

  readonly matcherString = (person: IPerson, search: string): boolean =>
    person.second_name.toLowerCase().startsWith(search.toLowerCase());

  onSelected(person: IPerson): void {
    this.control.setValue(person);
  }

  protected readonly stringifySurnameName = stringifySurnameName;
}
