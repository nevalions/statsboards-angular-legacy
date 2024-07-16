import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TuiButtonModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputNumberModule, TuiInputPhoneModule } from '@taiga-ui/kit';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiValueChangesModule } from '@taiga-ui/cdk';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-input-number-with-buttons',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiInputNumberModule,
    TuiInputPhoneModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiValueChangesModule,
    UpperCasePipe,
  ],
  templateUrl: './input-number-with-buttons.component.html',
  styleUrl: './input-number-with-buttons.component.less',
})
export class InputNumberWithButtonsComponent {
  @Input() label: string = 'Item';
  @Input() control!: FormControl;
  @Input() index!: number;
  @Input() key!: string;
  @Input() min: number = -1000;
  @Input() max: number = 1000;
  @Output() numberChanged = new EventEmitter<{
    index: number;
    step: number;
    key: string;
  }>();

  incrementEventNumber(step: number): void {
    if (this.control && !this.control.disabled) {
      this.numberChanged.emit({ index: this.index, step, key: this.key });
    }
  }

  isMinValue(): boolean {
    return this.control.value <= this.min;
  }

  isMaxValue(): boolean {
    return this.control.value >= this.max;
  }
}
