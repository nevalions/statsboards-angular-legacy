import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { MatchData } from '../../../../components/match/matchdata';
import { IMatchData } from '../../../../type/matchdata.type';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';
import { AdminSubmitButtonComponent } from '../../../ui/buttons/admin-submit-button/admin-submit-button.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { AdminDownButtonComponent } from '../../../ui/buttons/admin-down-button/admin-down-button.component';

@Component({
  selector: 'app-down-distance-forms',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    ToggleVisibleButtonComponent,
    AdminSubmitButtonComponent,
    ReactiveFormsModule,
    TuiInputNumberModule,
    TuiInputModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    AdminDownButtonComponent,
  ],
  templateUrl: './down-distance-forms.component.html',
  styleUrl: './down-distance-forms.component.less',
})
export class DownDistanceFormsComponent implements OnChanges {
  @Input() downAndDistanceFormVisible$!: Observable<boolean>;
  @Input() data: IMatchFullDataWithScoreboard | undefined;
  @Input() disabled: boolean = false;

  downDistanceForm: FormGroup;
  distanceForm: FormGroup;

  downValue: string = '1st';
  distanceValue: string = ' & 10';

  items: string[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '20+',
    'inch',
    'Goal',
  ];

  constructor(private matchData: MatchData) {
    this.downDistanceForm = this.initForm();
    this.distanceForm = this.initDistanceForm();

    this.distanceForm
      .get('distanceFormValue')
      ?.valueChanges.subscribe((value) => {
        this.distanceValue = ' & ' + value;
        this.updateFormValue();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['downValue']) {
      this.downDistanceForm = this.initForm();
    }
    if (changes['distanceValue']) {
      this.downDistanceForm = this.initForm();
    }
    if (changes['data']) {
      this.downDistanceForm = this.initForm();
    }
    if (changes['disabled']) {
      if (this.disabled) {
        this.downDistanceForm.disable();
      } else {
        this.downDistanceForm.enable();
      }
    }
  }

  private initForm(): FormGroup {
    return new FormGroup({
      downDistanceValue: new FormControl<string | null | undefined>(
        this.downValue + this.distanceValue,
      ),
    });
  }

  private initDistanceForm(): FormGroup {
    return new FormGroup({
      distanceFormValue: new FormControl<string | null | undefined>(
        this.distanceValue,
      ),
    });
  }

  updateFormValue(): void {
    this.downDistanceForm
      .get('downDistanceValue')
      ?.setValue(this.downValue + this.distanceValue);
  }

  updateDownAndDistance(matchData: IMatchData) {
    if (!matchData) return;

    const formValue = this.downDistanceForm.getRawValue();
    const downAndDistance = formValue.downDistanceValue;

    let down = '';
    let distance = '';

    // Check if downAndDistance is one of the single-value options
    const singleValueOptions = ['1PT', '2PT', 'FG', 'KickOff'];
    if (singleValueOptions.includes(downAndDistance)) {
      distance = downAndDistance;
    } else {
      // The input is expected to have both down and distance
      [down, distance] = downAndDistance.split(' & ');

      if (distance && distance.startsWith(' & ')) {
        distance = distance.slice(3);
      }
    }
    const updatedMatchData = {
      ...matchData,
      down: down,
      distance: distance || '',
    };

    this.matchData.updateMatchData(updatedMatchData);
  }
}
