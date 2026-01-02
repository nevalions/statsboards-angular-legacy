import { Component, inject } from '@angular/core';
import { Sport } from '../../sport';
import { Position } from '../../../position/postion';
import { AddEditPositionTableComponent } from '../../../position/add-edit-position-table/add-edit-position-table.component';
import { AsyncPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-with-positions',
  standalone: true,
  imports: [AddEditPositionTableComponent, AsyncPipe, UpperCasePipe],
  templateUrl: './with-positions.component.html',
  styleUrl: './with-positions.component.less',
})
export class WithPositionsComponent {
  private sport = inject(Sport);
  private position = inject(Position);

  sport$ = this.sport.currentSport$;
  allSportPositions$ = this.position.allSportPositions$;

  constructor() {
    const position = this.position;

    position.loadAllPositionsBySportId();
  }
}
