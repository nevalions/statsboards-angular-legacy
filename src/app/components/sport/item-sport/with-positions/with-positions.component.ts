import { Component } from '@angular/core';
import { Sport } from '../../sport';
import { Position } from '../../../position/postion';
import { IPlayer } from '../../../../type/player.type';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { AddEditPlayerComponent } from '../../../player/add-edit-player/add-edit-player.component';
import { EditButtonComponent } from '../../../../shared/ui/buttons/edit-button/edit-button.component';
import { AddEditPositionComponent } from '../../../position/add-edit-position/add-edit-position.component';

@Component({
  selector: 'app-with-positions',
  standalone: true,
  imports: [
    AsyncPipe,
    UpperCasePipe,
    AddEditPlayerComponent,
    EditButtonComponent,
    AddEditPositionComponent,
  ],
  templateUrl: './with-positions.component.html',
  styleUrl: './with-positions.component.less',
})
export class WithPositionsComponent {
  sport$ = this.sport.currentSport$;
  allSportPositions$ = this.position.allSportPositions$;

  constructor(
    private sport: Sport,
    private position: Position,
  ) {
    position.loadAllPositionsBySportId();
  }

  positionItemHref(item: IPlayer): string {
    return `/sport/${item.sport_id}/position/${item.id}`;
  }
}
