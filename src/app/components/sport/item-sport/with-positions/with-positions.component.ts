import { Component } from '@angular/core';
import { Sport } from '../../sport';
import { Position } from '../../../position/postion';
import { IPlayer } from '../../../../type/player.type';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { AddEditPlayerComponent } from '../../../player/add-edit-player/add-edit-player.component';
import { EditButtonComponent } from '../../../../shared/ui/buttons/edit-button/edit-button.component';
import { AddEditPositionComponent } from '../../../position/add-edit-position/add-edit-position.component';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AddEditPositionTableComponent } from '../../../position/add-edit-position-table/add-edit-position-table.component';

@Component({
  selector: 'app-with-positions',
  standalone: true,
  imports: [
    AsyncPipe,
    UpperCasePipe,
    AddEditPlayerComponent,
    EditButtonComponent,
    AddEditPositionComponent,
    TuiTableModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiButtonModule,
    AddEditPositionTableComponent,
  ],
  templateUrl: './with-positions.component.html',
  styleUrl: './with-positions.component.less',
})
export class WithPositionsComponent {
  sport$ = this.sport.currentSport$;
  allSportPositions$ = this.position.allSportPositions$;

  // positionForm = new FormGroup({
  //   id: new FormControl<number | null | undefined>(undefined),
  //   positionTitle: new FormControl<string>('', [
  //     Validators.required,
  //     Validators.minLength(1),
  //   ]),
  // });

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
