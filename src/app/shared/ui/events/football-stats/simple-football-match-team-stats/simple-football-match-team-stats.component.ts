import { Component, Input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-simple-football-match-team-stats',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './simple-football-match-team-stats.component.html',
  styleUrl: './simple-football-match-team-stats.component.less',
})
export class SimpleFootballMatchTeamStatsComponent {
  @Input() teamTitle: string | undefined | null = 'team';

  @Input() runDistance: number | undefined | null = 0;
  @Input() passDistance: number | undefined | null = 0;
  @Input() offenceDistance: number | undefined | null = 0;
  @Input() flagYards: number | undefined | null = 0;

  constructor() {}
}
