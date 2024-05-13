import { Component, Input } from '@angular/core';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import {
  TuiAppearance,
  TuiButtonModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { UiTuiSizeType } from '../../../../type/ui.type';

@Component({
  selector: 'app-parse-button',
  standalone: true,
  imports: [AsyncPipe, TuiButtonModule, TuiLoaderModule, UpperCasePipe],
  templateUrl: './parse-button.component.html',
  styleUrl: './parse-button.component.less',
})
export class ParseButtonComponent {
  @Input() appear = TuiAppearance.Primary;
  @Input() buttonSize: UiTuiSizeType = 'm';
  @Input() buttonClass: string = '';
  @Input() item: string = 'item';
  @Input() isLoading: boolean = false;
}
