import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  TuiButtonModule,
  TuiDialogModule,
  TuiDialogSize,
  TuiSizeL,
  TuiSizeM,
  TuiSizeS,
  TuiSizeXL,
  TuiSizeXS,
} from '@taiga-ui/core';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { UiTuiSizeType } from '../../../../type/ui.type';
import { TuiCheckboxLabeledModule } from '@taiga-ui/kit';
import { DialogService } from '../../../../services/dialog.service';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [
    FormsModule,
    TuiButtonModule,
    TuiDialogModule,
    UpperCasePipe,
    ReactiveFormsModule,
    TitleCasePipe,
    TuiCheckboxLabeledModule,
  ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.less',
})
export class DeleteDialogComponent {
  dialogService = inject(DialogService);

  @Input() item: string = 'item';
  @Input() action: string = 'delete';
  @Output() delete = new EventEmitter<void>();

  itemDeleteForm = new FormGroup({
    checkboxToAction: new FormControl(false),
  });

  open: boolean = false;

  constructor() {
    this.dialogService.getDialogEvent('deleteDialog').subscribe(() => {
      this.showDialog(true);
    });
  }

  //
  showDialog(open: boolean): void {
    this.open = open;
  }

  onSubmit(): void {
    this.delete.emit();
  }
}
