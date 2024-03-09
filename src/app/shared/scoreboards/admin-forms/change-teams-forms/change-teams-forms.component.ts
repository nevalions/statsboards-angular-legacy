import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../../../type/match.type';
import { MatchData } from '../../../../components/match/matchdata';
import { AsyncPipe, NgIf } from '@angular/common';
import { ToggleVisibleButtonComponent } from '../../../ui/buttons/toggle-visible-button/toggle-visible-button.component';

@Component({
  selector: 'app-change-teams-forms',
  standalone: true,
  imports: [NgIf, ToggleVisibleButtonComponent, AsyncPipe],
  templateUrl: './change-teams-forms.component.html',
  styleUrl: './change-teams-forms.component.less',
})
export class ChangeTeamsFormsComponent {
  @Input() changeTeamsFormsVisible$!: Observable<boolean>;
  @Input() data!: IMatchFullDataWithScoreboard;
  @Input() isMatchDataSubmitting$?: Observable<boolean>;

  constructor(private matchData: MatchData) {}
}
