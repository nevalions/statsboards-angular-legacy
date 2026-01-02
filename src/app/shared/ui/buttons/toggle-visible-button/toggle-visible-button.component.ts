import { TuiButton } from "@taiga-ui/core";
import { AsyncPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Ui } from '../../../../store/ui/ui';

@Component({
  selector: 'app-toggle-visible-button',
  standalone: true,
  imports: [AsyncPipe, TuiButton],
  templateUrl: './toggle-visible-button.component.html',
  styleUrl: './toggle-visible-button.component.less',
})
export class ToggleVisibleButtonComponent {
  private ui = inject(Ui);

  @Input() isVisible$: Observable<boolean> = of(true);
  @Input() formName!: string;
  @Input() buttonText: string = '';

  toggleItemVisibility(formName: string) {
    // console.log('toggleItemVisibility', formName);
    this.ui.toggleFormVisibility(formName);
  }
}
