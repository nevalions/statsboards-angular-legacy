import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { TuiTableModule } from '@taiga-ui/addon-table';

@Component({
  selector: 'app-add-button-on-final-tr',
  standalone: true,
  imports: [ButtonIconComponent, TuiTableModule],
  templateUrl: './add-button-on-final-tr.component.html',
  styleUrl: './add-button-on-final-tr.component.less',
})
export class AddButtonOnFinalTrComponent {
  @Input() span: number = 1;
  @Output() onAdd = new EventEmitter();

  add() {
    this.onAdd.emit();
  }
}
