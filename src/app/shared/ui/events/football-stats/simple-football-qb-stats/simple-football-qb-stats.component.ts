import { Component, Input } from '@angular/core';
import { AsyncPipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { IPlayerInMatchFullDataWithQbStats } from '../../../../../type/player.type';

@Component({
  selector: 'app-simple-football-qb-stats',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, TitleCasePipe],
  templateUrl: './simple-football-qb-stats.component.html',
  styleUrl: './simple-football-qb-stats.component.less',
})
export class SimpleFootballQbStatsComponent {
  @Input() qbs: IPlayerInMatchFullDataWithQbStats[] | null | undefined = [];
}
