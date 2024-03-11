import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { MatchData } from '../../../../components/match/matchdata';
import { IMatchData } from '../../../../type/matchdata.type';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminSubmitButtonComponent } from '../../../ui/buttons/admin-submit-button/admin-submit-button.component';
import { TuiDataListWrapperModule, TuiSelectModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-qtr-forms',
  standalone: true,
  imports: [
    NgIf,
    ToggleVisibleButtonComponent,
    AsyncPipe,
    AdminSubmitButtonComponent,
    ReactiveFormsModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
  ],
  templateUrl: './qtr-forms.component.html',
  styleUrl: './qtr-forms.component.less',
})
export class QtrFormsComponent implements OnChanges {
  @Input() qtrFormsVisible$!: Observable<boolean>;
  @Input() data!: IMatchFullDataWithScoreboard;
  @Input() disabled: boolean = false;

  qtrForm: FormGroup;

  items: string[] = ['1st', '2nd', 'HT', '3rd', '4th', 'Final', 'OT'];

  constructor(private matchData: MatchData) {
    this.qtrForm = this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.qtrForm = this.initForm();
    }
    if (changes['disabled']) {
      if (this.disabled) {
        this.qtrForm.disable();
      } else {
        this.qtrForm.enable();
      }
    }
  }

  private initForm(): FormGroup {
    return new FormGroup({
      qtrSelect: new FormControl<string | null | undefined>(
        this.data?.match_data?.qtr,
      ),
    });
  }

  updateQuarter(matchData: IMatchData) {
    if (!matchData) return;

    if (this.qtrForm.valid) {
      const formValue = this.qtrForm.getRawValue();
      const qtr = formValue.qtrSelect;
      if (qtr) {
        const updatedMatchData = { ...matchData, qtr: qtr };
        this.matchData.updateMatchData(updatedMatchData);
      }
    }
  }
}
