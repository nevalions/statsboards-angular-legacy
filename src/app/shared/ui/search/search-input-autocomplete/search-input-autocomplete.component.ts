import { TuiComboBoxModule } from "@taiga-ui/legacy";
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { tuiItemsHandlersProvider, TuiDataListWrapper, TuiStringifyContentPipe, TuiFilterByInputPipe } from '@taiga-ui/kit';
import { UpperCasePipe } from '@angular/common';
import { stringifyTitle, toTitleCase } from '../../../../base/helpers';
import { AnyObjectWithTitle } from '../../../../type/base.type';

@Component({
  selector: 'app-search-input-autocomplete',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiComboBoxModule,
    UpperCasePipe,
    TuiDataListWrapper,
    TuiStringifyContentPipe,
    TuiFilterByInputPipe,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: (item: AnyObjectWithTitle) => `${toTitleCase(item.title)}`,
    }),
  ],
  templateUrl: './search-input-autocomplete.component.html',
  styleUrl: './search-input-autocomplete.component.less',
})
export class SearchInputAutocompleteComponent {
  @Input() placeholder: string = 'item';
  @Input() items: any[] = [];
  @Input() formField!: FormControl;

  readonly form = new FormGroup({
    person: new FormControl<any | null>(null),
  });

  constructor() {}

  readonly matcherString = (item: any, search: string): boolean =>
    item.title.toLowerCase().startsWith(search.toLowerCase());

  onSelected(item: any): void {
    this.formField.setValue(item);
  }

  protected readonly stringifySurnameName = stringifyTitle;
}
