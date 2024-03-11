import { Component, Input } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';

@Component({
  selector: 'app-admin-timeout-button',
  standalone: true,
  imports: [TuiButtonModule],
  templateUrl: './admin-timeout-button.component.html',
  styleUrl: './admin-timeout-button.component.less',
})
export class AdminTimeoutButtonComponent {
  @Input() timeouts: string = '';
  @Input() disabled: boolean = false;
}
