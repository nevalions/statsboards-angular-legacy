import { Component, Input } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';

@Component({
  selector: 'app-admin-down-button',
  standalone: true,
  imports: [TuiButtonModule],
  templateUrl: './admin-down-button.component.html',
  styleUrl: './admin-down-button.component.less',
})
export class AdminDownButtonComponent {
  @Input() down: string = '';
  @Input() distance: string = '';
  @Input() disabled: boolean = false;
  @Input() size: 'xs' | 's' | 'm' | 'l' | 'xl' = 'm';
}
