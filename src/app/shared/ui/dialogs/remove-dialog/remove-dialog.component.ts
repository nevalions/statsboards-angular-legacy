import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TuiButtonModule, TuiDialogModule } from '@taiga-ui/core';
import { TuiCheckboxLabeledModule } from '@taiga-ui/kit';
import { UpperCasePipe } from '@angular/common';
import { DialogService } from '../../../../services/dialog.service';
import { Subscription } from 'rxjs';
import { CancelButtonInFormComponent } from '../../buttons/cancel-button-in-form/cancel-button-in-form.component';
import { DeleteButtonInFormComponent } from '../../buttons/delete-button-in-form/delete-button-in-form.component';

@Component({
  selector: 'app-remove-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiCheckboxLabeledModule,
    TuiDialogModule,
    UpperCasePipe,
    CancelButtonInFormComponent,
    DeleteButtonInFormComponent,
  ],
  templateUrl: './remove-dialog.component.html',
  styleUrl: './remove-dialog.component.less',
})
export class RemoveDialogComponent implements OnInit, OnDestroy {
  dialogService = inject(DialogService);

  @Input() item: string = 'item';
  @Input() action: string = 'remove';
  @Input() dialogId: string = 'removeDialog';
  @Output() delete = new EventEmitter<void>();

  private dialogSubscription: Subscription | undefined;

  itemDeleteForm = new FormGroup({
    checkboxToAction: new FormControl(false),
  });

  open: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // console.log(this.dialogId); // logging dialogId
    this.dialogSubscription = this.dialogService
      .getDialogEvent(this.dialogId)
      .subscribe(() => {
        this.showDialog(true);
      });
  }

  showDialog(open: boolean): void {
    this.open = open;
  }

  onSubmit(): void {
    this.delete.emit();
  }

  ngOnDestroy(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }
}
