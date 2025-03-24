import { TuiTable } from "@taiga-ui/addon-table";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { CreateButtonInFormComponent } from '../create-button-in-form/create-button-in-form.component';

@Component({
  selector: 'app-add-button-on-final-tr',
  standalone: true,
  imports: [ButtonIconComponent, TuiTable, CreateButtonInFormComponent],
  templateUrl: './add-button-on-final-tr.component.html',
  styleUrl: './add-button-on-final-tr.component.less',
})
export class AddButtonOnFinalTrComponent {
  @Input() action: string = 'add';
  @Output() onAdd = new EventEmitter();

  add() {
    this.onAdd.emit();
  }
}
