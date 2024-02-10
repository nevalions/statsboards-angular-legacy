import { Component, inject, Input } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { UpperCasePipe } from '@angular/common';
import { DialogService } from '../../../../services/dialog.service';
import { UiTuiSizeType } from '../../../../type/ui.type';

@Component({
  selector: 'app-create-button-show-dialog',
  standalone: true,
  imports: [TuiButtonModule, UpperCasePipe],
  templateUrl: './create-button-show-dialog.component.html',
  styleUrl: './create-button-show-dialog.component.less',
})
export class CreateButtonShowDialogComponent {
  dialogService = inject(DialogService);

  @Input() buttonSize: UiTuiSizeType = 'm';
  @Input() buttonClass: string = '';
  @Input() action: string = 'add';
  @Input() item: string = 'item';
  @Input() dialogId: string = '';

  onButtonClick(dialogId: string) {
    console.log('clicked');
    this.dialogService.showDialog(dialogId);
  }
}
