import { TuiButton } from "@taiga-ui/core";
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-toggle-button',
  standalone: true,
  imports: [TuiButton, UpperCasePipe],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.less',
})
export class ToggleButtonComponent {
  @Input() eventsArray: FormArray | null | undefined = null;
  @Input() control: FormControl | null | undefined = null;
  @Input() index: number | null | undefined = null;
  @Input() buttonValue: string = 'item';
  @Input() label: string = 'item';
  @Input() currentEnumValue?: string | null = null;
  @Input() disabled: boolean = false;

  @Output() toggle = new EventEmitter<string>();

  onToggle(): void {
    if (this.control) {
      this.control.markAsDirty();
      this.toggle.emit(this.buttonValue);
    }
  }

  getButtonAppearance(): string {
    return this.currentEnumValue === this.buttonValue ? 'primary' : 'glass';
  }
}
