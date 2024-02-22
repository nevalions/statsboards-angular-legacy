import { Component, EventEmitter, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDialogModule,
  TuiErrorModule,
} from '@taiga-ui/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';

@Component({
  selector: 'app-tournament-delete-form',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiAutoFocusModule,
    TuiButtonModule,
    TuiDialogModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputModule,
    TuiTextareaModule,
  ],
  templateUrl: './tournament-delete-form.component.html',
  styleUrl: './tournament-delete-form.component.less',
})
export class TournamentDeleteFormComponent {
  @Output() delete = new EventEmitter<void>();
  tournamentDeleteForm = new FormGroup({});

  open: boolean = false;

  showDialog(): void {
    this.open = true;
  }

  onSubmit(): void {
    this.delete.emit();
    this.tournamentDeleteForm.reset();
  }
}
