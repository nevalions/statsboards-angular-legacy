import { TuiButton } from "@taiga-ui/core";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-cancel-button-in-form',
  standalone: true,
  imports: [TuiButton, UpperCasePipe],
  templateUrl: './cancel-button-in-form.component.html',
  styleUrl: './cancel-button-in-form.component.less',
})
export class CancelButtonInFormComponent {
  @Input() action: string = 'cancel';
  @Output() cancel = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
  }
}
