import {Component, Input} from '@angular/core';
import {TuiButtonModule} from "@taiga-ui/core";
import {UpperCasePipe} from "@angular/common";

@Component({
  selector: 'app-create-button',
  standalone: true,
    imports: [
        TuiButtonModule,
        UpperCasePipe
    ],
  templateUrl: './create-button.component.html',
  styleUrl: './create-button.component.less'
})
export class CreateButtonComponent {
  @Input() title: string = '';
}
