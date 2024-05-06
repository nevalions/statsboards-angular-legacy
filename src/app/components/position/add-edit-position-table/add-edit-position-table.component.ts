import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { IPosition } from '../../../type/position.type';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputDateTimeModule,
  TuiInputModule,
} from '@taiga-ui/kit';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { Position } from '../postion';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { DialogService } from '../../../services/dialog.service';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';
import {
  TuiAutoFocusModule,
  tuiAutoFocusOptionsProvider,
  TuiFocusedModule,
  TuiFocusVisibleModule,
} from '@taiga-ui/cdk';

@Component({
  selector: 'app-add-edit-position-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiButtonModule,
    TuiInputDateTimeModule,
    TuiInputModule,
    TuiTableModule,
    TuiTextfieldControllerModule,
    UpperCasePipe,
    DeleteDialogComponent,
    DeleteButtonComponent,
    TuiAutoFocusModule,
    AsyncPipe,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiFocusedModule,
    TuiFocusVisibleModule,
  ],
  templateUrl: './add-edit-position-table.component.html',
  styleUrl: './add-edit-position-table.component.less',
})
export class AddEditPositionTableComponent implements OnChanges {
  @Input() sportId!: number;
  @Input() positions: IPosition[] = [];
  @ViewChild('positionInput') newPositionInput!: ElementRef;
  @ViewChildren('positionInput') positionInputs!: QueryList<ElementRef>;

  newPositionsCount = 0;
  isEnabled: boolean = false;
  editableIndex: number | null = null;
  positionForm = new FormGroup({});

  constructor(
    private position: Position,
    private dialogService: DialogService,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['positions']) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    this.positionForm = new FormGroup({});

    this.positions.forEach((position, index) => {
      // const isLastPosition = index === this.positions.length - 1;
      const controlName = this.getControlNameByIndex(index);

      const control = new FormControl(
        { value: position.title, disabled: true }, // Only enable the last position (assumed to be "new position")
        [Validators.required, Validators.minLength(1)],
      );

      this.positionForm.addControl(controlName, control);
    });

    const newControlName = `newPosition${this.newPositionsCount}`;
    if (this.isNewPosition()) {
      this.positionForm.get(newControlName)!.enable();
    }
  }

  addNewPosition(): void {
    const lastPosition = this.positions[this.positions.length - 1];

    if (lastPosition && lastPosition.id === null && lastPosition.title === '') {
      // console.log('An empty new position row is already present.');
      return;
    }
    this.newPositionsCount++;

    const newPosition: Partial<IPosition> = {
      id: null,
      title: '',
    };

    this.positions = [...this.positions, newPosition as IPosition];
    this.initializeForm();
    console.log(this.isNewPosition());
  }

  onSubmit(event: Event, positionId: number | null): void {
    if (positionId && this.positionForm.valid) {
      event.preventDefault();
      const updatedTitle = this.positionForm.get(
        `position${positionId}`,
      )?.value;
      const updatedPosition: IPosition = {
        id: positionId,
        title: updatedTitle,
      };
      this.position.updatePosition(updatedPosition);
      this.initializeForm();
    }

    if (!positionId && this.positionForm.valid) {
      // console.log('newposition', this.newPositionsCount);
      const newTitle: string | undefined = this.positionForm.get(
        `newPosition${this.newPositionsCount}`,
      )?.value;
      this.position.createPosition({ title: newTitle, sport_id: this.sportId });
      this.initializeForm();
    }
  }

  isNewPosition(): boolean {
    const newControlName = `newPosition${this.newPositionsCount}`;
    if (this.positionForm.get(newControlName)) {
      return !!this.positionForm.get(newControlName);
    }
    // console.log('null position', this.positionForm.get(newControlName));
    return false;
  }

  makeEditable(index: number): void {
    const allControls: { [key: string]: AbstractControl } =
      this.positionForm.controls;

    // If the same control is clicked again (double-clicked), disable it
    if (this.editableIndex === index && !this.isNewPosition()) {
      const controlName = this.getControlNameByIndex(index);
      const controlToToggle = this.positionForm.get(controlName);

      if (controlToToggle && controlToToggle.enabled) {
        controlToToggle.disable();
        this.editableIndex = null;
      } else {
        if (controlToToggle) {
          controlToToggle.enable();
          this.isEnabled = true;
          this.editableIndex = index;
        }
      }
    } else if (this.isNewPosition()) {
      Object.keys(allControls).forEach((controlName) => {
        allControls[controlName].disable();
      });

      const newControlName = `newPosition${this.newPositionsCount}`;
      if (this.isNewPosition()) {
        this.positionForm.get(newControlName)!.enable();

        const editableControlName = this.getControlNameByIndex(index);
        const controlToEdit = this.positionForm.get(editableControlName);
        if (controlToEdit) {
          controlToEdit.enable();
          this.editableIndex = index;
        }
      }
    } else {
      Object.keys(allControls).forEach((controlName) => {
        allControls[controlName].disable();
      });

      const editableControlName = this.getControlNameByIndex(index);
      const controlToEdit = this.positionForm.get(editableControlName);
      if (controlToEdit) {
        controlToEdit.enable();
        this.editableIndex = index;
      }
    }
  }

  disableAll(index: number): void {
    const allControls: { [key: string]: AbstractControl } =
      this.positionForm.controls;

    if (this.editableIndex === index && !this.isNewPosition()) {
      const controlName = this.getControlNameByIndex(index);
      const controlToToggle = this.positionForm.get(controlName);

      if (controlToToggle && controlToToggle.enabled) {
        controlToToggle.disable();
        this.editableIndex = null;
      }
    } else if (this.isNewPosition()) {
      Object.keys(allControls).forEach((controlName) => {
        allControls[controlName].disable();
      });

      const newControlName = `newPosition${this.newPositionsCount}`;
      if (this.isNewPosition()) {
        this.positionForm.get(newControlName)!.enable();
      }
    } else {
      Object.keys(allControls).forEach((controlName) => {
        allControls[controlName].disable();
      });
    }
    this.initializeForm();
  }

  // disableInput(index: number): void {
  //   if (this.editableIndex !== index && !this.isNewPosition()) {
  //     const controlName = this.getControlNameByIndex(index);
  //     const control = this.positionForm.get(controlName);
  //     if (control) {
  //       control.disable();
  //     }
  //   }
  // }

  getControlNameByIndex(index: number): string {
    const p = this.positions[index];
    return p.id ? 'position' + p.id : 'newPosition' + this.newPositionsCount;
  }

  onDeleteButtonClick(dialogId: string) {
    // console.log('clicked');
    this.dialogService.showDialog(dialogId);
  }

  onCancelButtonClick() {
    if (this.positions.length > 0) {
      this.positions = this.positions.slice(0, this.positions.length - 1);
      this.initializeForm();
    }
  }

  onDelete(id: number) {
    this.position.deletePositionWithId(id);
  }

  protected readonly tuiAutoFocusOptionsProvider = tuiAutoFocusOptionsProvider;
}
