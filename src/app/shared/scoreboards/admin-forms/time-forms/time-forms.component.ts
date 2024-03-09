import { Component, Input } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { MatchData } from '../../../../components/match/matchdata';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';

@Component({
  selector: 'app-time-forms',
  standalone: true,
  imports: [NgIf, AsyncPipe, ToggleVisibleButtonComponent],
  templateUrl: './time-forms.component.html',
  styleUrl: './time-forms.component.less',
})
export class TimeFormsComponent {
  @Input() timeFormsVisible$!: Observable<boolean>;
  @Input() data!: IMatchFullDataWithScoreboard;
  @Input() isMatchDataSubmitting$?: Observable<boolean>;

  constructor(private matchData: MatchData) {}

  getMinutes(seconds: number): string {
    if (seconds === undefined) {
      return '--';
    } else {
      return Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
    }
  }

  getSeconds(seconds: number): string {
    if (seconds === undefined) {
      return '--';
    } else {
      return (seconds % 60).toString().padStart(2, '0');
    }
  }

  getPlayClockSeconds(seconds: number): string {
    if (seconds === undefined) {
      return '';
    } else {
      return (seconds % 60).toString().padStart(1, '0');
    }
  }
}
