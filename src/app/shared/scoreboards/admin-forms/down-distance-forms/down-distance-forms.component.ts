import { Component, Input } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { MatchData } from '../../../../components/match/matchdata';
import { IMatchData } from '../../../../type/matchdata.type';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';

@Component({
  selector: 'app-down-distance-forms',
  standalone: true,
  imports: [NgIf, AsyncPipe, ToggleVisibleButtonComponent],
  templateUrl: './down-distance-forms.component.html',
  styleUrl: './down-distance-forms.component.less',
})
export class DownDistanceFormsComponent {
  @Input() downAndDistanceFormVisible$!: Observable<boolean>;
  @Input() data!: IMatchFullDataWithScoreboard;
  @Input() isMatchDataSubmitting$?: Observable<boolean>;

  downValue: string = '1st';
  distanceValue: string = ' & 10';

  constructor(private matchData: MatchData) {}

  updateDownAndDistance(matchData: IMatchData, downAndDistance: string) {
    if (!matchData) return;

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
      distance: distance || '', // use an empty string if distance is undefined
    };

    this.matchData.updateMatchData(updatedMatchData);
  }
}
