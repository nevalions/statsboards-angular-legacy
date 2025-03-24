import { TuiButton } from "@taiga-ui/core";
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-down-button',
  standalone: true,
  imports: [TuiButton],
  templateUrl: './admin-down-button.component.html',
  styleUrl: './admin-down-button.component.less',
})
export class AdminDownButtonComponent {
  @Input() down: string = '';
  @Input() distance: string = '';
  @Input() disabled: boolean = false;
  @Input() size: 'xs' | 's' | 'm' | 'l' | 'xl' = 'm';
}
