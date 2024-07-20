import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TuiButtonModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputNumberModule, TuiInputPhoneModule } from '@taiga-ui/kit';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiValueChangesModule } from '@taiga-ui/cdk';
import { UpperCasePipe } from '@angular/common';
import { IFootballEventWithPlayers } from '../../../../type/football-event.type';

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
  @Input() events: IFootballEventWithPlayers[] | null = null;
  @Input() eventsArray!: FormArray;
  @Input() onBallOnChange?: (
    events: IFootballEventWithPlayers[] | null,
    eventsArray: FormArray,
    ballOn: number,
    index: number,
  ) => void;
  @Input() onDownChange?: (
    eventsArray: FormArray,
    down: number,
    index: number,
  ) => void;
  @Output() numberChanged = new EventEmitter<{
    index: number;
    step: number;
    key: string;
  }>();

  incrementEventNumber(step: number): void {
    if (this.control && !this.control.disabled) {
      const newValue = this.control.value + step;
      this.numberChanged.emit({ index: this.index, step, key: this.key });

      if (this.onBallOnChange) {
        this.onBallOnChange(
          this.events,
          this.eventsArray,
          newValue,
          this.index,
        );
      }

      if (this.onDownChange) {
        this.onDownChange(this.eventsArray, newValue, this.index);
      }
    }
  }

  isMinValue(): boolean {
    return this.control.value <= this.min;
  }

  isMaxValue(): boolean {
    return this.control.value >= this.max;
  }
}
