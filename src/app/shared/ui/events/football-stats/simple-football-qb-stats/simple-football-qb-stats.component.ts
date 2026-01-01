import { Component, Input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { IPlayerInMatchFullDataWithQbStats } from '../../../../../type/player.type';

@Component({
  selector: 'app-simple-football-qb-stats',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './simple-football-qb-stats.component.html',
  styleUrl: './simple-football-qb-stats.component.less',
})
export class SimpleFootballQbStatsComponent {
  @Input() qbs: IPlayerInMatchFullDataWithQbStats[] | null | undefined = [];
}
