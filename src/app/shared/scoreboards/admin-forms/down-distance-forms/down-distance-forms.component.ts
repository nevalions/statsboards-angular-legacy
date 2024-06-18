import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { MatchData } from '../../../../components/match/matchdata';
import { IMatchData, IScoreboard } from '../../../../type/matchdata.type';
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
import { TuiButtonModule } from '@taiga-ui/core';
import { ScoreboardData } from '../../../../components/scoreboard-data/scoreboard-data';
import { Websocket } from '../../../../store/websocket/websocket';

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
    TuiButtonModule,
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
  isFlagForm: FormGroup;

  downValue: string = '1-й';
  distanceValue: string = ' & 10';

  // items: string[] = [
  //   '1',
  //   '2',
  //   '3',
  //   '4',
  //   '5',
  //   '6',
  //   '7',
  //   '8',
  //   '9',
  //   '10',
  //   '11',
  //   '12',
  //   '13',
  //   '14',
  //   '15',
  //   '16',
  //   '17',
  //   '18',
  //   '19',
  //   '20',
  //   '20+',
  //   'inch',
  //   'Goal',
  // ];

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
    'дюйм',
    'Гол',
  ];

  constructor(
    private matchData: MatchData,
    private scoreboardData: ScoreboardData,
    private websocket: Websocket,
  ) {
    this.downDistanceForm = this.initForm();
    this.distanceForm = this.initDistanceForm();
    this.isFlagForm = this.initFlagForm();

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
      this.isFlagForm = this.initFlagForm();
    }
    if (changes['disabled']) {
      if (this.disabled) {
        this.downDistanceForm.disable();
        this.isFlagForm.disabled; //???? not ();
      } else {
        this.downDistanceForm.enable();
        this.isFlagForm.enable();
      }
    }
  }

  private initFlagForm(): FormGroup {
    return new FormGroup({
      isFlag: new FormControl<boolean | null | undefined>(
        this.data?.scoreboard_data?.is_flag,
      ),
    });
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

  toggleFlag(scoreboardData: IScoreboard) {
    if (!scoreboardData) return;
    this.websocket.checkConnection();

    if (this.isFlagForm.valid) {
      const formValue = this.isFlagForm.getRawValue();
      const isFlagged = formValue.isFlag;
      // console.log('FLAGED', isFlagged);
      if (isFlagged === true || isFlagged === false) {
        // const updatedScoreboardData = {
        //   ...scoreboardData,
        //   is_flag: !isFlagged,
        // };

        this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
          // is_flag: !isFlagged,
          is_flag: !this.data?.scoreboard_data?.is_flag,
        });
        // this.scoreboardData.updateScoreboardData(updatedScoreboardData);
      } else {
        // const updatedScoreboardData = {
        //   ...scoreboardData,
        //   is_flag: false,
        // };
        this.scoreboardData.updateScoreboardDataKeyValue(scoreboardData.id!, {
          is_flag: false,
        });
        // this.scoreboardData.updateScoreboardData(updatedScoreboardData);
      }
    }
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
    // const singleValueOptions = ['1PT', '2PT', 'FG', 'KickOff'];
    const singleValueOptions = ['1 ОЧКО', '2 ОЧКА', 'ФГ', 'Нач.Уд.'];
    if (singleValueOptions.includes(downAndDistance)) {
      distance = downAndDistance;
    } else {
      // The input is expected to have both down and distance
      [down, distance] = downAndDistance.split(' & ');

      if (distance && distance.startsWith(' & ')) {
        distance = distance.slice(3);
      }
    }
    // const updatedMatchData = {
    //   ...matchData,
    //   down: down,
    //   distance: distance || '',
    // };

    // this.matchData.updateMatchData(updatedMatchData);
    this.websocket.checkConnection();
    this.matchData.updateMatchDataKeyValue(matchData.id!, {
      down: down,
      distance: distance,
    });
  }
}
