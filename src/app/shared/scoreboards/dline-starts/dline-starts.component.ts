import { NgIf } from '@angular/common';
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
  selector: 'app-dline-starts',
  standalone: true,
  imports: [PlayerCardRosterComponent, NgIf],
  templateUrl: './dline-starts.component.html',
  styleUrl: './dline-starts.component.less',
})
export class DlineStartsComponent implements OnInit, OnChanges {
  @Input() startDL: IPlayerInMatchFullData[] = [];
  public selectedDL: { [key: string]: IPlayerInMatchFullData | null } = {};
  public positions = {
    e: ['e', 'de', 'dl'],
    dt: ['dt', 'dl'],
    dtTwo: ['ng', 'dt', 'dl'],
    dtTree: ['dt', 'de', 'dl'],
    a: ['a', 'de', 'dl'],
  };

  ngOnInit() {
    if (this.startDL) {
      this.selectedDL = selectPlayersForPositions(this.startDL, this.positions);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['startDL'] && changes['startDL'].currentValue) {
      this.selectedDL = selectPlayersForPositions(this.startDL, this.positions);
      // console.log('Selected DL Players from ngOnChanges:', this.selectedDL);
    }
  }
}
