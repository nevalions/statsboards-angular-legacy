import { Component, Input } from '@angular/core';
import { AddSignPipe } from '../../../../pipes/add-sign.pipe';
import { TeamNamePipe } from '../../../../pipes/team-name.pipe';
import { TuiButtonModule } from '@taiga-ui/core';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-admin-submit-button',
  standalone: true,
  imports: [AddSignPipe, TeamNamePipe, TuiButtonModule, TitleCasePipe],
  templateUrl: './admin-submit-button.component.html',
  styleUrl: './admin-submit-button.component.less',
})
export class AdminSubmitButtonComponent {
  @Input() action: string = 'save';
  @Input() disabled: boolean = false;
}
