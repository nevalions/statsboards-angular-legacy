import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import {
  TuiDataListModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { tuiItemsHandlersProvider, TuiSelectModule } from '@taiga-ui/kit';
import { toTitleCase } from '../../../../base/helpers';

@Component({
  selector: 'app-select-list-of-strings',
  standalone: true,
  imports: [
    TitleCasePipe,
    TuiDataListModule,
    TuiSelectModule,
    UpperCasePipe,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
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
  templateUrl: './select-list-of-strings.component.html',
  styleUrl: './select-list-of-strings.component.less',
})
export class SelectListOfStringsComponent {
  @Input() control!: FormControl;
  @Input() action: string = 'select';
  @Input() placeholder: string = 'item';
  @Input() stringList: string[] = [];
  @Output() itemSelected = new EventEmitter<string>();

  onSelected(item: string): void {
    this.control.setValue(item);
    this.itemSelected.emit(item);
  }
}
