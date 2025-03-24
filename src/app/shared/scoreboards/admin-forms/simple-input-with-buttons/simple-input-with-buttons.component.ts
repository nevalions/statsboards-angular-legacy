import { TuiButton } from "@taiga-ui/core";
import { TuiTextfieldControllerModule, TuiInputNumberModule } from "@taiga-ui/legacy";
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-simple-input-with-buttons',
  standalone: true,
  imports: [
    TuiInputNumberModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    UpperCasePipe,
    TuiButton,
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
  @Input() isCycle: boolean = false;
  @Input() cleaner: boolean = true;

  isMinValue(): boolean {
    return this.control.value <= this.min;
  }

  isMaxValue(): boolean {
    return this.control.value >= this.max;
  }

  increment(): void {
    if (this.isMaxValue()) {
      if (this.isCycle) {
        this.control.setValue(this.min);
      }
    } else {
      this.control.setValue(this.control.value + 1);
    }
  }

  decrement(): void {
    if (this.isMinValue()) {
      if (this.isCycle) {
        this.control.setValue(this.max);
      }
    } else {
      this.control.setValue(this.control.value - 1);
    }
  }
}
