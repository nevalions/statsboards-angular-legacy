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
import { TitleCasePipe, UpperCasePipe } from '@angular/common';

import { TuiCheckboxLabeledModule } from '@taiga-ui/kit';
import { DialogService } from '../../../../services/dialog.service';
import { Subscription } from 'rxjs';
import { DeleteButtonInFormComponent } from '../../buttons/delete-button-in-form/delete-button-in-form.component';
import { CancelButtonInFormComponent } from '../../buttons/cancel-button-in-form/cancel-button-in-form.component';
import { ivyTransformFactory } from '@angular/compiler-cli/src/ngtsc/transform';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [
    FormsModule,
    TuiButtonModule,
    TuiDialogModule,
    UpperCasePipe,
    ReactiveFormsModule,
    TitleCasePipe,
    TuiCheckboxLabeledModule,
    DeleteButtonInFormComponent,
    CancelButtonInFormComponent,
  ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.less',
})
export class DeleteDialogComponent implements OnInit, OnDestroy {
  dialogService = inject(DialogService);

  @Input() id: number | null = null;
  @Input() item: string = 'item';
  @Input() action: string = 'delete';
  @Input() dialogId: string = 'deleteDialog';
  @Output() delete = new EventEmitter<void>();

  private dialogSubscription: Subscription | undefined;

  itemDeleteForm = new FormGroup({
    checkboxToAction: new FormControl(false),
  });

  open: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // console.log('dialogId on delete', this.dialogId); // logging dialogId
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
    this.itemDeleteForm.reset();
  }

  ngOnDestroy(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }
}
