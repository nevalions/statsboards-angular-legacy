import { TuiTabs } from '@taiga-ui/kit';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TuiAppearance, TuiDropdown } from '@taiga-ui/core';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog/delete-dialog.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';

@Component({
  selector: 'app-actions-buttons',
  standalone: true,
  imports: [ButtonIconComponent, TuiDropdown, DeleteDialogComponent, TuiTabs],
  templateUrl: './actions-buttons.component.html',
  styleUrl: './actions-buttons.component.less',
})
export class ActionsButtonsComponent {
  @Input() id: number | null = null;
  @Input() subId: number | null = null;
  @Input() index: number | null = null;
  @Input() item: string = 'Player';
  @Input() deleteOrUpdate: 'delete' | 'update' | 'deleteFromTeam' = 'delete';
  @Input() isEnabled: boolean = false;
  @Input() isDataChanged: boolean = false;

  @Output() onEdit = new EventEmitter<{
    index: number;
    subId: number | null;
  }>();
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

  submit(action: 'add' | 'edit' | 'deleteFromTeam') {
    if (this.index !== null) {
      this.onSubmit.emit({ action, index: this.index, id: this.id });
    }
  }

  edit() {
    if (this.index !== null) {
      this.onEdit.emit({ index: this.index, subId: this.subId });
    }
  }

  delete(id: number) {
    if (id !== null) {
      // console.log('delete id', id);
      this.onDelete.emit({ id });
      // this.onDeleteDialog.emit({ id: this.id });
    }
  }

  deleteDialog(event: MouseEvent): void {
    event.stopPropagation();
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
  open = false;
}
