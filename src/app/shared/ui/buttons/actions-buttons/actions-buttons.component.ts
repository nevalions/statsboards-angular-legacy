import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getFormControl } from '../../../../base/formHelpers';
import { TuiAppearance } from '@taiga-ui/core';
import { ButtonIconComponent } from '../button-icon/button-icon.component';

@Component({
  selector: 'app-actions-buttons',
  standalone: true,
  imports: [ButtonIconComponent],
  templateUrl: './actions-buttons.component.html',
  styleUrl: './actions-buttons.component.less',
})
export class ActionsButtonsComponent {
  @Input() id: number | null = null;
  @Input() index: number | null = null;

  @Output() edit = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<{
    action: 'add' | 'edit';
    index: number;
    id: number | null;
  }>();
  @Output() onDelete = new EventEmitter<{
    id: number | null;
  }>();
  @Output() onCancel = new EventEmitter<void>();

  // Call these methods when the corresponding button is clicked
  // edit(event: Event, index: number) {
  //   // Handle edit...
  // }

  submit(action: 'add' | 'edit') {
    if (this.index !== null) {
      this.onSubmit.emit({ action, index: this.index, id: this.id });
    }
  }

  delete() {
    if (this.id !== null) {
      this.onDelete.emit({ id: this.id });
    }
  }

  cancel() {
    this.onCancel.emit();
  }

  protected readonly getFormControl = getFormControl;
  protected readonly TuiAppearance = TuiAppearance;
}
