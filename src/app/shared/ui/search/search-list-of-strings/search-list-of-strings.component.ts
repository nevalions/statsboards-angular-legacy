import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  tuiItemsHandlersProvider,
  TuiStringifyContentPipeModule,
} from '@taiga-ui/kit';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { UpperCasePipe } from '@angular/common';
import {
  stringifyListOfStringsToTitle,
  toTitleCase,
} from '../../../../base/helpers';

@Component({
  selector: 'app-search-list-of-strings',
  standalone: true,
  imports: [
    TuiComboBoxModule,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    UpperCasePipe,
    TuiDataListWrapperModule,
    TuiFilterByInputPipeModule,
    TuiStringifyContentPipeModule,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: (item: any) => {
        if (!item || typeof item !== 'string') {
          return '';
        }
        return toTitleCase(item);
      },
    }),
  ],
  templateUrl: './search-list-of-strings.component.html',
  styleUrl: './search-list-of-strings.component.less',
})
export class SearchListOfStringsComponent {
  @Input() control!: FormControl;
  @Input() action: string = 'select';
  @Input() placeholder: string = 'item';
  @Input() stringList: string[] = [];
  @Output() itemSelected = new EventEmitter<string>();

  onSelected(item: string): void {
    // console.log('item on select', item);
    this.control.setValue(item);
    this.itemSelected.emit(item);
  }

  readonly matcherString = (item: string, search: string): boolean => {
    if (!item) {
      return false;
    }
    return item.toLowerCase().startsWith(search.toLowerCase());
  };
  protected readonly stringifyListOfStringsToTitle =
    stringifyListOfStringsToTitle;
}
