import { TuiTextfieldControllerModule, TuiSelectModule } from "@taiga-ui/legacy";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { TuiDataList } from '@taiga-ui/core';
import { tuiItemsHandlersProvider } from '@taiga-ui/kit';
import { toTitleCase } from '../../../../base/helpers';

@Component({
  selector: 'app-select-list-of-strings',
  standalone: true,
  imports: [
    TitleCasePipe,
    TuiDataList,
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
