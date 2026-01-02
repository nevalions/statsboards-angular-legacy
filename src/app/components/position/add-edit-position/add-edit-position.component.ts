import { TuiInputModule } from '@taiga-ui/legacy';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { IPosition } from '../../../type/position.type';
import { DialogService } from '../../../services/dialog.service';
import { Position } from '../postion';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { TuiError, TuiDialog } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { CancelButtonInFormComponent } from '../../../shared/ui/buttons/cancel-button-in-form/cancel-button-in-form.component';
import { CreateButtonInFormComponent } from '../../../shared/ui/buttons/create-button-in-form/create-button-in-form.component';

@Component({
  selector: 'app-add-edit-position',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiDialog,
    TuiError,
    TuiFieldErrorPipe,
    TuiInputModule,
    CancelButtonInFormComponent,
    CreateButtonInFormComponent,
  ],
  templateUrl: './add-edit-position.component.html',
  styleUrl: './add-edit-position.component.less',
})
export class AddEditPositionComponent implements OnInit, OnDestroy, OnChanges {
  private dialogService = inject(DialogService);
  private position = inject(Position);

  private dialogSubscription: Subscription | undefined;

  @Input() action: string = 'add';
  @Input() dialogId: string = 'addDialog';
  @Input() positionToEdit: IPosition = {} as IPosition;
  @Input() sport_Id!: number;

  @Output() addEvent = new EventEmitter<any>();
  @Output() editEvent = new EventEmitter<any>();

  positionForm = new FormGroup({
    id: new FormControl<number | null | undefined>(undefined),
    positionTitle: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(1),
    ]),
  });

  open: boolean = false;

  showDialog(open: boolean): void {
    this.open = open;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['positionToEdit'] &&
      this.action === 'edit' &&
      this.positionToEdit
    ) {
      const item: IPosition = this.positionToEdit;

      this.positionForm.setValue({
        id: item.id,
        positionTitle: item.title!,
      });
    }
  }

  onSubmit(): void {
    if (this.positionForm.valid) {
      const formValue = this.positionForm.getRawValue();

      const data: IPosition = {
        id: this.positionForm.get('id')?.value,
        title: formValue.positionTitle!,
        sport_id: this.sport_Id,
      };

      if (this.action === 'add') {
        this.position.createPosition(data);
        this.positionForm.reset();
      } else if (this.action === 'edit') {
        this.position.updatePosition(data);
      }
    }
  }

  ngOnInit(): void {
    // console.log(this.dialogId);
    // console.log(this.action);

    this.dialogSubscription = this.dialogService
      .getDialogEvent(this.dialogId)
      .subscribe(() => {
        this.showDialog(true);
      });
  }

  ngOnDestroy(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }
}
