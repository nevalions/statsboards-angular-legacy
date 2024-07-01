import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  tuiItemsHandlersProvider,
  TuiStringifyContentPipeModule,
} from '@taiga-ui/kit';
import { stringifyEnumObject, toTitleCase } from '../../../../base/helpers';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IEnumObject } from '../../../../type/base.type';
import { UpperCasePipe } from '@angular/common';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';

@Component({
  selector: 'app-select-enum',
  standalone: true,
  imports: [
    TuiComboBoxModule,
    ReactiveFormsModule,
    TuiDataListWrapperModule,
    TuiStringifyContentPipeModule,
    TuiFilterByInputPipeModule,
    UpperCasePipe,
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
  templateUrl: './select-enum.component.html',
  styleUrl: './select-enum.component.less',
})
export class SelectEnumComponent {
  @Input() control!: FormControl;
  @Input() action: string = 'select';
  @Input() placeholder: string = 'item';
  @Input() enumObjects: IEnumObject[] = [];
  @Output() itemSelected = new EventEmitter<IEnumObject>();

  onSelected(item: IEnumObject): void {
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
