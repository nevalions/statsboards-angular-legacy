import {Component, Input} from '@angular/core';
import {TuiButtonModule} from "@taiga-ui/core";
import {UpperCasePipe} from "@angular/common";

@Component({
  selector: 'app-body-title',
  standalone: true,
    imports: [
        TuiButtonModule,
        UpperCasePipe
    ],
  templateUrl: './body-title.component.html',
  styleUrl: './body-title.component.less'
})
export class BodyTitleComponent {
  @Input() titleMany: string = '';
}
