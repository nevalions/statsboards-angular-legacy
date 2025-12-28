
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { selectPlayersForPositions } from '../../../base/footballHelpers';
import { IPlayerInMatchFullData } from '../../../type/player.type';
import { PlayerCardRosterComponent } from '../player-card-roster/player-card-roster.component';

@Component({
  selector: 'app-backs-start',
  standalone: true,
  imports: [PlayerCardRosterComponent],
  templateUrl: './backs-start.component.html',
  styleUrl: './backs-start.component.less',
})
export class BacksStartComponent implements OnInit, OnChanges {
  @Input() startRB: IPlayerInMatchFullData[] = [];
  public selectedRB: { [key: string]: IPlayerInMatchFullData | null } = {};
  public positions = {
    rbOne: ['fb', 'rb', 'hb', 'tb'],
    rbTwo: ['fb', 'rb', 'hb', 'tb'],
    rbThree: ['fb', 'rb', 'hb', 'tb'],
  };

  ngOnInit() {
    if (this.startRB) {
      this.selectedRB = selectPlayersForPositions(this.startRB, this.positions);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['startRB'] && changes['startRB'].currentValue) {
      this.selectedRB = selectPlayersForPositions(this.startRB, this.positions);
      console.log('Selected QbWr Players from ngOnChanges:', this.selectedRB);
    }
  }
}
