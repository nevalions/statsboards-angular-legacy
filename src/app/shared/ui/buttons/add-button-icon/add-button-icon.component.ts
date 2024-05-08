import { Component, inject, Input } from '@angular/core';
import { DialogService } from '../../../../services/dialog.service';
import { TuiAppearance, TuiButtonModule } from '@taiga-ui/core';
import { UiTuiSizeType } from '../../../../type/ui.type';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-add-button-icon',
  standalone: true,
  imports: [TuiButtonModule, UpperCasePipe],
  templateUrl: './add-button-icon.component.html',
  styleUrl: './add-button-icon.component.less',
})
export class AddButtonIconComponent {
  dialogService = inject(DialogService);

  @Input() appearance: TuiAppearance = TuiAppearance.Primary;
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
