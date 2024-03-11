import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { MatchData } from '../../../../components/match/matchdata';
import { AsyncPipe, NgIf } from '@angular/common';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiFieldErrorPipeModule,
  TuiInputFilesModule,
  TuiInputModule,
} from '@taiga-ui/kit';
import { TuiErrorModule } from '@taiga-ui/core';
import { AdminSubmitButtonComponent } from '../../../ui/buttons/admin-submit-button/admin-submit-button.component';

@Component({
  selector: 'app-change-teams-forms',
  standalone: true,
  imports: [
    NgIf,
    ToggleVisibleButtonComponent,
    AsyncPipe,
    ReactiveFormsModule,
    TuiInputModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    AdminSubmitButtonComponent,
    TuiInputFilesModule,
  ],
  templateUrl: './change-teams-forms.component.html',
  styleUrl: './change-teams-forms.component.less',
})
export class ChangeTeamsFormsComponent implements OnChanges {
  @Input() changeTeamsFormsVisible$!: Observable<boolean>;
  @Input() data!: IMatchFullDataWithScoreboard;
  @Input() disabled: boolean = false;

  teamTitleForm: FormGroup;

  constructor(private matchData: MatchData) {
    this.teamTitleForm = this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.teamTitleForm = this.initForm();
    }
    if (changes['disabled']) {
      if (this.disabled) {
        this.teamTitleForm.disable();
      } else {
        this.teamTitleForm.enable();
      }
    }
  }

  private initForm(): FormGroup {
    return new FormGroup({
      teamATitle: new FormControl<string | null | undefined>(
        this.data?.teams_data?.team_a.title,
        Validators.minLength(3),
      ),
      teamBTitle: new FormControl<string | null | undefined>(
        this.data?.teams_data?.team_b.title,
        Validators.minLength(3),
      ),
      teamALogo: new FormControl<string | null | undefined>(
        this.data?.teams_data?.team_a.team_logo_url,
      ),
      teamBLogo: new FormControl<string | null | undefined>(
        this.data?.teams_data?.team_b.team_logo_url,
      ),
    });
  }
}
