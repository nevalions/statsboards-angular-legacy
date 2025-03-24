import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { TuiAppearance, TuiButton } from '@taiga-ui/core';
import { DialogService } from '../../../../services/dialog.service';
import { UiTuiSizeType } from '../../../../type/ui.type';

@Component({
  selector: 'app-button-icon',
  standalone: true,
  imports: [TuiButton],
  templateUrl: './button-icon.component.html',
  styleUrl: './button-icon.component.less',
  // encapsulation: ViewEncapsulation.None,
})
export class ButtonIconComponent {
  dialogService = inject(DialogService);

  // @Input() buttonAppear: TuiAppearance | 'create' = TuiAppearance.Primary;
  @Input() buttonShape: 'rounded' | 'square' = 'rounded';
  @Input() buttonSize: UiTuiSizeType = 'm';
  @Input() buttonClass: string = 'add-new-button';
  @Input() buttonIcon = '@tui.x';
  @Input() dialogId: string = '';

  onButtonClick(dialogId: string) {
    // console.log('clicked');
    this.dialogService.showDialog(dialogId);
  }
}
