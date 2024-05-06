import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { IPosition } from '../../../type/position.type';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiButtonModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputDateTimeModule, TuiInputModule } from '@taiga-ui/kit';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { Position } from '../postion';
import { UpperCasePipe } from '@angular/common';
import { DeleteDialogComponent } from '../../../shared/ui/dialogs/delete-dialog/delete-dialog.component';
import { DialogService } from '../../../services/dialog.service';
import { DeleteButtonComponent } from '../../../shared/ui/buttons/delete-button/delete-button.component';

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
  ],
  templateUrl: './add-edit-position-table.component.html',
  styleUrl: './add-edit-position-table.component.less',
})
export class AddEditPositionTableComponent implements OnChanges {
  @Input() sportId!: number;
  @Input() positions: IPosition[] = [];
  @ViewChildren('positionInput') positionInputs!: QueryList<ElementRef>;

  newPositionsCount = 0;
  positionForm = new FormGroup({});

  constructor(
    private position: Position,
    private dialogService: DialogService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['positions']) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    this.positionForm = new FormGroup({});

    this.positions.forEach((position, index) => {
      const controlName =
        position.id !== null
          ? `position${position.id}`
          : `newPosition${this.newPositionsCount}`;

      this.positionForm.addControl(
        controlName,
        new FormControl(position.title, [
          Validators.required,
          Validators.minLength(1),
        ]),
      );
    });
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

  onDeleteButtonClick(dialogId: string) {
    // console.log('clicked');
    this.dialogService.showDialog(dialogId);
  }

  onDelete(id: number) {
    this.position.deletePositionWithId(id);
  }

  // ngOnInit() {
  //   // Dynamically create form controls for each position
  //   this.positions.forEach((position) => {
  //     this.positionForm.addControl(
  //       `position${position.id}`,
  //       new FormControl(position.title, [
  //         Validators.required,
  //         Validators.minLength(1),
  //       ]),
  //     );
  //   });
  // }
}
