import { TuiTextfieldControllerModule, TuiComboBoxModule } from "@taiga-ui/legacy";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { stringifyEnumObject, toTitleCase } from '../../../../base/helpers';
import { tuiItemsHandlersProvider, TuiDataListWrapper, TuiStringifyContentPipe, TuiFilterByInputPipe } from '@taiga-ui/kit';
import { UpperCasePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IEnumObject } from '../../../../type/base.type';

@Component({
  selector: 'app-search-enum',
  standalone: true,
  imports: [
    TuiComboBoxModule,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiStringifyContentPipe,
    UpperCasePipe,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: (item: IEnumObject) => {
        if (!item) {
          return '';
        }
        return toTitleCase(item.value);
      },
    }),
  ],
  templateUrl: './search-enum.component.html',
  styleUrl: './search-enum.component.less',
})
export class SearchEnumComponent {
  @Input() control!: FormControl;
  @Input() action: string = 'select';
  @Input() placeholder: string = 'item';
  @Input() enumObjects: IEnumObject[] = [];
  @Output() itemSelected = new EventEmitter<IEnumObject>();

  onSelected(item: IEnumObject): void {
    // console.log('item on select', item);
    this.control.setValue(item);
    this.itemSelected.emit(item);
  }

  readonly matcherString = (
    item: IEnumObject | string,
    search: string,
  ): boolean => {
    if (!item) {
      return false;
    }

    if (typeof item === 'object' && 'value' in item) {
      return item.value.toLowerCase().startsWith(search.toLowerCase());
    }

    if (typeof item === 'string') {
      return item.toLowerCase().startsWith(search.toLowerCase());
    }

    return false;
  };

  protected readonly stringifyEnumObject = stringifyEnumObject;
}
