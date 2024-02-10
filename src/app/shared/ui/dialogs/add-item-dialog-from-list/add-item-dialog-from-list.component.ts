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
import { Observable, of, Subscription } from 'rxjs';
import { ITeam } from '../../../../type/team.type';

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

  private dialogSubscription: Subscription | undefined;

  open: boolean = false;

  itemAddForm = new FormGroup({
    itemToAdd: new FormControl<T | null>(null, Validators.required),
  });

  ngOnInit(): void {
    console.log(this.dialogId); // logging dialogId
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
    if (this.itemAddForm.valid) {
      this.add.emit(this.itemAddForm.get('itemToAdd')?.value);
      this.itemAddForm.reset();
      this.showDialog(false); // close the dialog
    } else {
      this.add.emit(null);
    }
  }

  ngOnDestroy(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }
}
