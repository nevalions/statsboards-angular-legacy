import { Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Ui } from '../../../../store/ui/ui';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-toggle-visible-button',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './toggle-visible-button.component.html',
  styleUrl: './toggle-visible-button.component.less',
})
export class ToggleVisibleButtonComponent {
  @Input() isVisible$: Observable<boolean> = of(true);
  @Input() formName!: string;
  @Input() buttonText: string = '';

  constructor(private ui: Ui) {}

  toggleItemVisibility(formName: string) {
    this.ui.toggleFormVisibility(formName);
  }
}
