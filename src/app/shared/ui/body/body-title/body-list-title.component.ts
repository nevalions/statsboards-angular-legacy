import { TuiButton } from "@taiga-ui/core";
import { Component, Input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-body-list-title',
  standalone: true,
  imports: [TuiButton, UpperCasePipe],
  templateUrl: './body-list-title.component.html',
  styleUrl: './body-list-title.component.less',
})
export class BodyListTitleComponent {
  @Input() titleMany: string = '';
}
