import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getFormControl } from '../../../../base/formHelpers';
import {
  TuiAppearance,
  TuiButtonModule,
  TuiHostedDropdownModule,
} from '@taiga-ui/core';
import { ButtonIconComponent } from '../button-icon/button-icon.component';

@Component({
  selector: 'app-actions-buttons',
  standalone: true,
  imports: [ButtonIconComponent, TuiHostedDropdownModule, TuiButtonModule],
  templateUrl: './actions-buttons.component.html',
  styleUrl: './actions-buttons.component.less',
})
export class ActionsButtonsComponent {
  @Input() id: number | null = null;
  @Input() index: number | null = null;
  @Input() deleteOrUpdate: 'delete' | 'update' | 'deleteFromTeam' = 'delete';

  @Output() edit = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<{
    action: 'add' | 'edit' | 'deleteFromTeam';
    index: number;
    id: number | null;
  }>();
  @Output() onDeleteUpdate = new EventEmitter<{
    action: 'deleteFromTeam';
    index: number;
    id: number | null;
  }>();
  @Output() onDelete = new EventEmitter<{
    id: number | null;
  }>();
  // @Output() onDelete = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  dropdownOpen = false;

  // Call these methods when the corresponding button is clicked
  // edit(event: Event, index: number) {
  //   // Handle edit...
  // }

  submit(action: 'add' | 'edit' | 'deleteFromTeam') {
    if (this.index !== null) {
      this.onSubmit.emit({ action, index: this.index, id: this.id });
    }
  }

  // update(action: 'edit') {
  //   if (this.index !== null) {
  //     this.onDeleteUpdate.emit({ action, index: this.index, id: this.id });
  //   }
  // }

  delete() {
    if (this.id !== null) {
      console.log('action id', this.id);
      // this.onDelete.emit();

      this.onDelete.emit({ id: this.id });
    }
  }

  cancel() {
    this.onCancel.emit();
  }

  // protected readonly getFormControl = getFormControl;
  protected readonly TuiAppearance = TuiAppearance;
}
