import { Component, inject, Input } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiButtonModule,
  TuiDialogModule,
  TuiErrorModule,
  TuiHintModule,
} from '@taiga-ui/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import { ITournament } from '../../../type/tournament.type';
import { AsyncPipe } from '@angular/common';
import { CreateButtonInFormComponent } from '../../../shared/ui/buttons/create-button-in-form/create-button-in-form.component';
import { CancelButtonInFormComponent } from '../../../shared/ui/buttons/cancel-button-in-form/cancel-button-in-form.component';
import { Store } from '@ngrx/store';
import { tournamentActions } from '../store/actions';
import { TournamentState } from '../store/reducers';
import { Tournament } from '../tournament';

@Component({
  selector: 'app-tournament-add-edit-form',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiHintModule,
    TuiDialogModule,
    TuiInputModule,
    ReactiveFormsModule,
    TuiAutoFocusModule,
    TuiFieldErrorPipeModule,
    AsyncPipe,
    TuiErrorModule,
    TuiTextareaModule,
    CreateButtonInFormComponent,
    CancelButtonInFormComponent,
  ],
  templateUrl: './tournament-add-edit-form.component.html',
  styleUrl: './tournament-add-edit-form.component.less',
})
export class TournamentAddEditFormComponent {
  // store: Store<{ tournament: TournamentState }> = inject(Store);
  @Input() sport_Id!: number;
  @Input() season_Id!: number;

  constructor(private tournament: Tournament) {}

  tournamentForm = new FormGroup({
    tournamentTitle: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    tournamentDescription: new FormControl(''),
    tournament_logo_url: new FormControl(''),
  });

  open: boolean = false;

  showDialog(): void {
    this.open = true;
  }

  onSubmit(): void {
    if (this.tournamentForm.valid) {
      const formValue = this.tournamentForm.getRawValue();

      const data: ITournament = {
        title: formValue.tournamentTitle!,
        description: 'string',
        tournament_logo_url: 'www',
        season_id: this.season_Id,
        sport_id: this.sport_Id,
      };

      this.tournament.createTournament(data);
    }
  }
}
