import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IPlayerInMatchFullData } from '../../../type/player.type';
import { selectPlayersForPositions } from '../../../base/footballHelpers';
import { PlayerCardRosterComponent } from '../player-card-roster/player-card-roster.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-qb-wr-start',
  standalone: true,
  imports: [PlayerCardRosterComponent, NgIf],
  templateUrl: './qb-wr-start.component.html',
  styleUrl: './qb-wr-start.component.less',
})
export class QbWrStartComponent implements OnInit, OnChanges {
  @Input() startQbWr: IPlayerInMatchFullData[] = [];
  public selectedQbWr: { [key: string]: IPlayerInMatchFullData | null } = {};
  public positions = {
    qb: ['qb'],
    wrOne: ['wr'],
    wrTwo: ['wr'],
    slotOne: ['slot', 'te', 'wr'],
    slotTwo: ['slot', 'te', 'wr'],
  };

  ngOnInit() {
    if (this.startQbWr) {
      this.selectedQbWr = selectPlayersForPositions(
        this.startQbWr,
        this.positions,
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['startQbWr'] && changes['startQbWr'].currentValue) {
      this.selectedQbWr = selectPlayersForPositions(
        this.startQbWr,
        this.positions,
      );
      console.log('Selected QbWr Players from ngOnChanges:', this.selectedQbWr);
    }
  }
}
