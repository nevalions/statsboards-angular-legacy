import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AsyncPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiButtonModule, TuiDialogModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiSelectModule } from '@taiga-ui/kit';
import { TuiLetModule } from '@taiga-ui/cdk';
import { DialogService } from '../../../../services/dialog.service';
import { Observable, of, Subject, Subscription, takeUntil } from 'rxjs';
import { CreateButtonInFormComponent } from '../../buttons/create-button-in-form/create-button-in-form.component';
import { CancelButtonInFormComponent } from '../../buttons/cancel-button-in-form/cancel-button-in-form.component';

@Component({
  selector: 'app-add-item-dialog-from-list',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiDataListWrapperModule,
    TuiDialogModule,
    TuiLetModule,
    TuiSelectModule,
    TitleCasePipe,
    UpperCasePipe,
    CreateButtonInFormComponent,
    CancelButtonInFormComponent,
  ],
  templateUrl: './add-item-dialog-from-list.component.html',
  styleUrl: './add-item-dialog-from-list.component.less',
})
export class AddItemDialogFromListComponent<T> implements OnInit, OnDestroy {
  dialogService = inject(DialogService);

  @Input() item: string = 'item';
  @Input() parentItem: string = 'parent item';
  @Input() action: string = 'add';
  @Input() itemsList$: Observable<T[]> = of([]);
  @Input() dialogId: string = 'addDialog';
  @Output() add = new EventEmitter<T | null | undefined>();

  private destroy$ = new Subject<void>();

  open: boolean = false;

  itemAddForm = new FormGroup({
    itemToAdd: new FormControl<T | null>(null, Validators.required),
  });

  ngOnInit(): void {
    this.dialogService
      .getDialogEvent(this.dialogId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.showDialog(true);
      });
  }

  showDialog(open: boolean): void {
    console.log(`Add Dialog ${open ? 'opened' : 'closed'}`);
    this.open = open;
  }

  onSubmit(): void {
    if (this.itemAddForm.valid) {
      console.log('Emitting add event');
      this.add.emit(this.itemAddForm.get('itemToAdd')?.value);
      this.itemAddForm.reset();
      this.showDialog(false); // close the dialog
    } else {
      console.log('Form not valid, emitting null');
      this.add.emit(null);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
