import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ITeam } from '../../../type/team.type';
import { AsyncPipe } from '@angular/common';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDialogModule,
  TuiErrorModule,
} from '@taiga-ui/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';
import { CreateButtonInFormComponent } from '../../../shared/ui/buttons/create-button-in-form/create-button-in-form.component';
import { CancelButtonInFormComponent } from '../../../shared/ui/buttons/cancel-button-in-form/cancel-button-in-form.component';
import { Team } from '../team';

@Component({
  selector: 'app-add-edit-team',
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
    TuiInputNumberModule,
    CreateButtonInFormComponent,
    CancelButtonInFormComponent,
  ],
  templateUrl: './add-edit-team.component.html',
  styleUrl: './add-edit-team.component.less',
})
export class AddEditTeamComponent {
  @Input() sportId!: number;

  constructor(private team: Team) {}

  teamForm = new FormGroup({
    teamTitle: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    teamCity: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    teamDescription: new FormControl(''),
    teamLogoUrl: new FormControl(''),
    teamEeslId: new FormControl(undefined),
  });

  open: boolean = false;

  showDialog(): void {
    this.open = true;
  }

  onSubmit(): void {
    if (this.teamForm.valid) {
      const formValue = this.teamForm.getRawValue();

      const data: ITeam = {
        title: formValue.teamTitle!,
        city: formValue.teamCity!,
        description: formValue.teamDescription!,
        team_logo_url: formValue.teamLogoUrl!,
        team_eesl_id: formValue.teamEeslId,
        sport_id: this.sportId,
      };

      // console.log(formValue.teamTitle, data.sport_id);
      this.team.createTeam(data);
    }
  }
}
