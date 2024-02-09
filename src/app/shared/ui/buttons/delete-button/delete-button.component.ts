import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TuiButtonModule, TuiDialogSize } from '@taiga-ui/core';
import { UpperCasePipe } from '@angular/common';
import { UiTuiSizeType } from '../../../../type/ui.type';
import { DialogService } from '../../../../services/dialog.service';

@Component({
  selector: 'app-delete-button',
  standalone: true,
  imports: [TuiButtonModule, UpperCasePipe],
  templateUrl: './delete-button.component.html',
  styleUrl: './delete-button.component.less',
})
export class DeleteButtonComponent {
  dialogService = inject(DialogService);

  @Input() buttonSize: UiTuiSizeType = 'm';
  @Input() buttonClass: string = '';
  @Input() dialogSize: TuiDialogSize = 'm';
  @Input() action: string = 'delete';
  @Input() item: string = 'item';

  onButtonClick() {
    console.log('clicked');
    this.dialogService.showDialog();
  }
}
