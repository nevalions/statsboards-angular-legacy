import { Component, Input } from '@angular/core';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { IPlayerInMatchFullDataWithOffenceStats } from '../../../../../type/player.type';

@Component({
  selector: 'app-simple-football-offence-stats',
  standalone: true,
  imports: [TitleCasePipe, UpperCasePipe],
  templateUrl: './simple-football-offence-stats.component.html',
  styleUrl: './simple-football-offence-stats.component.less',
})
export class SimpleFootballOffenceStatsComponent {
  @Input() offence:
    | IPlayerInMatchFullDataWithOffenceStats[]
    | null
    | undefined = [];
}
