import { TuiCheckbox } from "@taiga-ui/kit";
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
import { TuiLabel, TuiDialog, TuiButton } from '@taiga-ui/core';
import { UpperCasePipe } from '@angular/common';
import { DialogService } from '../../../../services/dialog.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { CancelButtonInFormComponent } from '../../buttons/cancel-button-in-form/cancel-button-in-form.component';
import { DeleteButtonInFormComponent } from '../../buttons/delete-button-in-form/delete-button-in-form.component';

@Component({
  selector: 'app-remove-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TuiButton,
    TuiLabel,
    TuiDialog,
    UpperCasePipe,
    CancelButtonInFormComponent,
    DeleteButtonInFormComponent,
      TuiCheckbox
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

  private destroy$ = new Subject<void>();

  itemDeleteForm = new FormGroup({
    checkboxToAction: new FormControl(false),
  });

  open: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.dialogService
      .getDialogEvent(this.dialogId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.showDialog(true);
      });
  }

  showDialog(open: boolean): void {
    console.log(`Remove Dialog ${open ? 'opened' : 'closed'}`);
    this.open = open;
  }

  onSubmit(): void {
    if (this.open) {
      console.log('Emitting remove event');
      this.delete.emit();
      this.itemDeleteForm.reset();
      this.showDialog(false);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
