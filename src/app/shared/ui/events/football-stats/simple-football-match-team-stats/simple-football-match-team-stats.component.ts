import { Component, Input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { IFootballTeamWithStats } from '../../../../../type/team.type';

@Component({
  selector: 'app-simple-football-match-team-stats',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './simple-football-match-team-stats.component.html',
  styleUrl: './simple-football-match-team-stats.component.less',
})
export class SimpleFootballMatchTeamStatsComponent {
  @Input() teamWithStats: IFootballTeamWithStats | null | undefined = null;

  constructor() {}
}
