import { Component, inject, Input } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { DialogService } from '../../../../services/dialog.service';
import { UiTuiSizeType } from '../../../../type/ui.type';

@Component({
  selector: 'app-delete-button-icon',
  standalone: true,
  imports: [TuiButtonModule],
  templateUrl: './delete-button-icon.component.html',
  styleUrl: './delete-button-icon.component.less',
})
export class DeleteButtonIconComponent {
  dialogService = inject(DialogService);

  @Input() buttonSize: UiTuiSizeType = 's';
  @Input() buttonClass: string = '';
  @Input() buttonIcon = 'tuiIconClose';
  @Input() dialogId: string = '';

  onButtonClick(dialogId: string) {
    console.log('clicked');
    this.dialogService.showDialog(dialogId);
  }
}
