import { TuiSelectModule } from "@taiga-ui/legacy";
import { TuiLet } from "@taiga-ui/cdk";
import { TuiDropdown } from "@taiga-ui/core";
import { Component, Input } from '@angular/core';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { WithNullOptionRetStringOnlyPipe } from '../../../../pipes/with-null-option-ret-string-only.pipe';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-select-player-number',
  standalone: true,
  imports: [
    TuiSelectModule,
    TuiDataListWrapper,
    WithNullOptionRetStringOnlyPipe,
    ReactiveFormsModule,
    TuiLet,
    UpperCasePipe,
    TuiDropdown,
  ],
  templateUrl: './select-player-number.component.html',
  styleUrl: './select-player-number.component.less',
})
export class SelectPlayerNumberComponent {
  @Input() control: FormControl | null = null;
  numbers = Array.from({ length: 100 }, (_, i) => i.toString());
}
