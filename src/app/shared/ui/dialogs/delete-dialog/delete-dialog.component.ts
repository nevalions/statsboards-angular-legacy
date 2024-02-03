import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() item: string = 'item';
  @Input() buttonSize: UiTuiSizeType = 'm';
  @Input() buttonClass: string = '';
  @Input() dialogSize: TuiDialogSize = 'm';
  @Input() action: string = 'delete';

  @Output() delete = new EventEmitter<void>();

  itemDeleteForm = new FormGroup({
    checkboxToAction: new FormControl(false),
  });

  open: boolean = false;

  showDialog(): void {
    this.open = true;
  }

  onSubmit(): void {
    this.delete.emit();
  }
}
