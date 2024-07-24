import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiInputNumberModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-simple-input-with-buttons',
  standalone: true,
  imports: [
    TuiInputNumberModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    UpperCasePipe,
    TuiButtonModule,
  ],
  templateUrl: './simple-input-with-buttons.component.html',
  styleUrl: './simple-input-with-buttons.component.less',
})
export class SimpleInputWithButtonsComponent {
  @Input() label: string = 'Item';
  @Input() control!: FormControl;
  @Input() key!: string;
  @Input() min: number = -1000;
  @Input() max: number = 1000;

  isMinValue(): boolean {
    return this.control.value <= this.min;
  }

  isMaxValue(): boolean {
    return this.control.value >= this.max;
  }

  increment(): void {
    if (!this.isMaxValue()) {
      this.control.setValue(this.control.value + 1);
    }
  }

  decrement(): void {
    if (!this.isMinValue()) {
      this.control.setValue(this.control.value - 1);
    }
  }
}
