import { TuiButton } from "@taiga-ui/core";
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-timeout-button',
  standalone: true,
  imports: [TuiButton],
  templateUrl: './admin-timeout-button.component.html',
  styleUrl: './admin-timeout-button.component.less',
})
export class AdminTimeoutButtonComponent {
  @Input() timeouts: string = '';
  @Input() disabled: boolean = false;
}
