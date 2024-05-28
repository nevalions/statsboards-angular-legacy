import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { Observable, of } from 'rxjs';
import { Ui } from '../../../../store/ui/ui';

@Component({
  selector: 'app-toggle-visible-button',
  standalone: true,
  imports: [AsyncPipe, TuiButtonModule],
  templateUrl: './toggle-visible-button.component.html',
  styleUrl: './toggle-visible-button.component.less',
})
export class ToggleVisibleButtonComponent {
  @Input() isVisible$: Observable<boolean> = of(true);
  @Input() formName!: string;
  @Input() buttonText: string = '';

  constructor(private ui: Ui) {}

  toggleItemVisibility(formName: string) {
    console.log('toggleItemVisibility', formName);
    this.ui.toggleFormVisibility(formName);
  }
}
