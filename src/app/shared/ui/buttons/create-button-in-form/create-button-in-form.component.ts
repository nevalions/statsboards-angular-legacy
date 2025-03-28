import { TuiButton } from "@taiga-ui/core";
import { Component, Input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-create-button-in-form',
  standalone: true,
  imports: [TuiButton, UpperCasePipe],
  templateUrl: './create-button-in-form.component.html',
  styleUrl: './create-button-in-form.component.less',
})
export class CreateButtonInFormComponent {
  @Input() action: string = 'add';
  @Input() disabled: boolean = false;
}
