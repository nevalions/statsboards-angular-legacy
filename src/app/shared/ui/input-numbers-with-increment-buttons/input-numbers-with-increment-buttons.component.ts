import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiInputNumberModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiValueChangesModule } from '@taiga-ui/cdk';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-input-numbers-with-increment-buttons',
  standalone: true,
  imports: [
    TuiInputNumberModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiValueChangesModule,
    UpperCasePipe,
    TuiButtonModule,
  ],
  templateUrl: './input-numbers-with-increment-buttons.component.html',
  styleUrl: './input-numbers-with-increment-buttons.component.less',
})
export class InputNumbersWithIncrementButtonsComponent {
  @Input() size: 's' | 'm' | 'l' = 'm';
  @Input() label: string = 'item';
  @Input() control!: FormControl;
  @Input() min: number = -1000;
  @Input() max: number = 1000;
  @Input() plusOne: number = 1;
  @Input() minusOne: number = -1;

  @Output() incrementEvent = new EventEmitter<number>();
  @Output() valueChanged = new EventEmitter<number>();

  onValueChange(value: number): void {
    this.valueChanged.emit(value); // Emit value changes to the parent
  }

  increment(step: number): void {
    this.incrementEvent.emit(step); // Emit step value for increment
  }
}
