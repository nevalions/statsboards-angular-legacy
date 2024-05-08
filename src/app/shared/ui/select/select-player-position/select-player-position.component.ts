import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IPosition } from '../../../../type/position.type';
import {
  TuiDataListWrapperModule,
  tuiItemsHandlersProvider,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { TuiLetModule } from '@taiga-ui/cdk';
import { WithNullOptionPipe } from '../../../../pipes/with-null-option.pipe';
import { AddEditPositionComponent } from '../../../../components/position/add-edit-position/add-edit-position.component';
import { EditButtonComponent } from '../../buttons/edit-button/edit-button.component';
import { TuiDataListModule, TuiSvgModule } from '@taiga-ui/core';
import { AddButtonIconComponent } from '../../buttons/add-button-icon/add-button-icon.component';

@Component({
  selector: 'app-select-player-position',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiDataListWrapperModule,
    TuiLetModule,
    TuiSelectModule,
    WithNullOptionPipe,
    AddEditPositionComponent,
    EditButtonComponent,
    TuiDataListModule,
    TuiSvgModule,
    AddButtonIconComponent,
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
  @Input() positionList: IPosition[] = [];
  @Input() index!: number;
  @Input() sportId!: number;
  @Input() control!: FormControl;
}
