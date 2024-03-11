import { Component, Input } from '@angular/core';
import { AddSignPipe } from '../../../../components/pipes/add-sign.pipe';
import { TeamNamePipe } from '../../../../components/pipes/team-name.pipe';
import { TuiButtonModule } from '@taiga-ui/core';

@Component({
  selector: 'app-admin-submit-button',
  standalone: true,
  imports: [AddSignPipe, TeamNamePipe, TuiButtonModule],
  templateUrl: './admin-submit-button.component.html',
  styleUrl: './admin-submit-button.component.less',
})
export class AdminSubmitButtonComponent {
  @Input() disabled: boolean = false;
}
