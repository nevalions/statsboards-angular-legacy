import { TuiButton } from "@taiga-ui/core";
import { Component, inject, Input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { UiTuiSizeType } from '../../../../type/ui.type';
import { DialogService } from '../../../../services/dialog.service';

@Component({
  selector: 'app-delete-button',
  standalone: true,
  imports: [TuiButton, UpperCasePipe],
  templateUrl: './delete-button.component.html',
  styleUrl: './delete-button.component.less',
})
export class DeleteButtonComponent {
  dialogService = inject(DialogService);

  @Input() buttonSize: UiTuiSizeType = 'm';
  @Input() buttonClass: string = '';
  @Input() action: string = 'delete';
  @Input() item: string = 'item';
  @Input() dialogId: string = '';

  onButtonClick(dialogId: string) {
    // console.log('clicked');
    // console.log('dialogId', dialogId);
    this.dialogService.showDialog(dialogId);
  }
}
