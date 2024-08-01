import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdminDownButtonComponent } from '../../../ui/buttons/admin-down-button/admin-down-button.component';
import { AsyncPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-on-air-toggle',
  standalone: true,
  imports: [AdminDownButtonComponent, AsyncPipe, UpperCasePipe],
  templateUrl: './on-air-toggle.component.html',
  styleUrl: './on-air-toggle.component.less',
})
export class OnAirToggleComponent {
  @Input() isOnAir: boolean = false;
  @Input() buttonLabel: string = '';
  @Input() item: string = 'item';
  @Output() toggle: EventEmitter<void> = new EventEmitter<void>();

  onButtonClick(): void {
    this.toggle.emit();
  }
}
