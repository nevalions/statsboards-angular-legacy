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

@Component({
  selector: 'app-select-player-position',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiDataListWrapperModule,
    TuiLetModule,
    TuiSelectModule,
    WithNullOptionPipe,
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
  @Input() control!: FormControl;
}
