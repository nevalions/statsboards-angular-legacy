import { TuiButton } from "@taiga-ui/core";
import { Component, Input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-admin-submit-button',
  standalone: true,
  imports: [TuiButton, TitleCasePipe],
  templateUrl: './admin-submit-button.component.html',
  styleUrl: './admin-submit-button.component.less',
})
export class AdminSubmitButtonComponent {
  @Input() action: string = 'save';
  @Input() disabled: boolean = false;
}
