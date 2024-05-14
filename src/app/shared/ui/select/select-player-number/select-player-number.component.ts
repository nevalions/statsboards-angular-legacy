import { Component, Input } from '@angular/core';
import { TuiDataListWrapperModule, TuiSelectModule } from '@taiga-ui/kit';
import { WithNullOptionRetStringOnlyPipe } from '../../../../pipes/with-null-option-ret-string-only.pipe';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiLetModule } from '@taiga-ui/cdk';
import { UpperCasePipe } from '@angular/common';
import { TuiDropdownModule } from '@taiga-ui/core';

@Component({
  selector: 'app-select-player-number',
  standalone: true,
  imports: [
    TuiSelectModule,
    TuiDataListWrapperModule,
    WithNullOptionRetStringOnlyPipe,
    ReactiveFormsModule,
    TuiLetModule,
    UpperCasePipe,
    TuiDropdownModule,
  ],
  templateUrl: './select-player-number.component.html',
  styleUrl: './select-player-number.component.less',
})
export class SelectPlayerNumberComponent {
  @Input() control: FormControl | null = null;
  numbers = Array.from({ length: 100 }, (_, i) => i.toString());
}
