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
import {
  TuiButtonModule,
  TuiDialogModule,
  TuiDialogSize,
  TuiSizeL,
  TuiSizeM,
  TuiSizeS,
  TuiSizeXL,
  TuiSizeXS,
} from '@taiga-ui/core';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { UiTuiSizeType } from '../../../../type/ui.type';
import { TuiCheckboxLabeledModule } from '@taiga-ui/kit';
import { DialogService } from '../../../../services/dialog.service';
import { Subscription } from 'rxjs';

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
  ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.less',
})
export class DeleteDialogComponent implements OnInit, OnDestroy {
  dialogService = inject(DialogService);

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
