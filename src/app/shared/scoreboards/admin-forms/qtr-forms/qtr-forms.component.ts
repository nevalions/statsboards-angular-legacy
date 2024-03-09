import { Component, Input } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { MatchData } from '../../../../components/match/matchdata';
import { IMatchData } from '../../../../type/matchdata.type';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';

@Component({
  selector: 'app-qtr-forms',
  standalone: true,
  imports: [NgIf, ToggleVisibleButtonComponent, AsyncPipe],
  templateUrl: './qtr-forms.component.html',
  styleUrl: './qtr-forms.component.less',
})
export class QtrFormsComponent {
  @Input() qtrFormsVisible$!: Observable<boolean>;
  @Input() data!: IMatchFullDataWithScoreboard;
  @Input() isMatchDataSubmitting$?: Observable<boolean>;

  constructor(private matchData: MatchData) {}

  updateQuarter(matchData: IMatchData, selectedQuarter: string) {
    if (!matchData) return;

    const updatedMatchData = { ...matchData, qtr: selectedQuarter };
    this.matchData.updateMatchData(updatedMatchData);
  }
}
