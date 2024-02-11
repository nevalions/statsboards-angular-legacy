import { Component, inject, Input } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { UpperCasePipe } from '@angular/common';
import { DialogService } from '../../../../services/dialog.service';
import { UiTuiSizeType } from '../../../../type/ui.type';

@Component({
  selector: 'app-edit-button',
  standalone: true,
  imports: [TuiButtonModule, UpperCasePipe],
  templateUrl: './edit-button.component.html',
  styleUrl: './edit-button.component.less',
})
export class EditButtonComponent {
  dialogService = inject(DialogService);

  @Input() buttonSize: UiTuiSizeType = 'm';
  @Input() buttonClass: string = '';
  @Input() action: string = 'edit';
  @Input() item: string = 'item';
  @Input() dialogId: string = '';

  onButtonClick(dialogId: string) {
    // console.log('clicked');
    this.dialogService.showDialog(dialogId);
  }
}
