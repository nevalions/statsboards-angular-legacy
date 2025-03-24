import { TuiSelectModule } from "@taiga-ui/legacy";
import { TuiLet } from "@taiga-ui/cdk";
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IPosition } from '../../../../type/position.type';
import { tuiItemsHandlersProvider, TuiDataListWrapper } from '@taiga-ui/kit';
import { WithNullOptionPipe } from '../../../../pipes/with-null-option.pipe';
import { AddEditPositionComponent } from '../../../../components/position/add-edit-position/add-edit-position.component';
import { EditButtonComponent } from '../../buttons/edit-button/edit-button.component';
import { TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { AddButtonIconComponent } from '../../buttons/add-button-icon/add-button-icon.component';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-select-player-position',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiDataListWrapper,
    TuiLet,
    TuiSelectModule,
    WithNullOptionPipe,
    AddEditPositionComponent,
    EditButtonComponent,
    TuiDataList,
    TuiIcon,
    AddButtonIconComponent,
    UpperCasePipe,
    TuiDropdown,
  ],
  providers: [
    tuiItemsHandlersProvider({
      stringify: (item: IPosition) => `${item.title}`,
    }),
  ],
  templateUrl: './select-player-position.component.html',
  styleUrl: './select-player-position.component.less',
})
export class SelectPlayerPositionComponent {
  @Input() positionList: IPosition[] | null = [];
  @Input() index!: number;
  @Input() sportId!: number;
  @Input() control: FormControl | null = null;
}
