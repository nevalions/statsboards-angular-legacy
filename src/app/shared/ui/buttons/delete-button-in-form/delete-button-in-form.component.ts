import { TuiButton } from "@taiga-ui/core";
import { Component, Input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-delete-button-in-form',
  standalone: true,
  imports: [TuiButton, UpperCasePipe],
  templateUrl: './delete-button-in-form.component.html',
  styleUrl: './delete-button-in-form.component.less',
})
export class DeleteButtonInFormComponent {
  @Input() action: string = 'delete';
  @Input() disabled: boolean = false;
}
