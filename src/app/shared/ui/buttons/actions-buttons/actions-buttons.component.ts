import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  TuiAppearance,
  TuiButtonModule,
  TuiHostedDropdownModule,
} from '@taiga-ui/core';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-actions-buttons',
  standalone: true,
  imports: [
    ButtonIconComponent,
    TuiHostedDropdownModule,
    TuiButtonModule,
    DeleteDialogComponent,
  ],
  templateUrl: './actions-buttons.component.html',
  styleUrl: './actions-buttons.component.less',
})
export class ActionsButtonsComponent {
  @Input() id: number | null = null;
  @Input() index: number | null = null;
  @Input() item: string = 'Player';
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
  @Output() onDeleteDialog = new EventEmitter<{
    id: number | null;
  }>();
  @Output() onDelete = new EventEmitter<{ id: number | null }>();
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
  delete(id: number) {
    if (this.id !== null) {
      console.log('delete id', this.id);
      this.onDelete.emit({ id });
      // this.onDeleteDialog.emit({ id: this.id });
    }
  }

  deleteDialog() {
    if (this.id !== null) {
      console.log('action id', this.id);
      // this.onDelete.emit();
      this.onDeleteDialog.emit({ id: this.id });
    }
  }

  cancel() {
    this.onCancel.emit();
  }

  // protected readonly getFormControl = getFormControl;
  protected readonly TuiAppearance = TuiAppearance;
}
