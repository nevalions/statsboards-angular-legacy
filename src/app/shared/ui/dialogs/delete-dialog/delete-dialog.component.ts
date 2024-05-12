import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
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
export class DeleteDialogComponent implements OnInit, OnDestroy, OnChanges {
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

  private initializeDialogSubscription(): void {
    this.unsubscribeDialogSubscription();
    this.dialogSubscription = this.dialogService
      .getDialogEvent(this.dialogId)
      .subscribe(() => {
        this.showDialog(true);
      });
  }

  private unsubscribeDialogSubscription(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
    this.dialogSubscription = undefined;
  }

  constructor() {}

  ngOnInit(): void {
    console.log('Registering dialog event listener for:', this.dialogId);
    this.initializeDialogSubscription();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['dialogId'] &&
      changes['dialogId'].currentValue !== changes['dialogId'].previousValue
    ) {
      console.log('Dialog ID changed:', this.dialogId);

      // Notify service that we are resetting the dialog with this ID
      this.dialogService.resetDialog(this.dialogId);

      // Unsubscribe from the old subscription
      this.unsubscribeDialogSubscription();

      // Set up a new subscription for the new dialog ID
      this.initializeDialogSubscription();
    }
  }

  showDialog(open: boolean): void {
    this.open = open;
  }

  onSubmit(): void {
    this.delete.emit();
    this.itemDeleteForm.reset();
  }

  ngOnDestroy(): void {
    this.unsubscribeDialogSubscription();
  }
}
