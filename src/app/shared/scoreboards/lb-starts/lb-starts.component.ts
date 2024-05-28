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
  selector: 'app-lb-starts',
  standalone: true,
  imports: [PlayerCardRosterComponent, NgIf],
  templateUrl: './lb-starts.component.html',
  styleUrl: './lb-starts.component.less',
})
export class LbStartsComponent implements OnInit, OnChanges {
  @Input() startLB: IPlayerInMatchFullData[] = [];
  public selectedLB: { [key: string]: IPlayerInMatchFullData | null } = {};
  public positions = {
    s: ['s', 'slb', 'olb', 'lb'],
    mlb: ['m', 'mlb', 'lb'],
    mlbTwo: ['m', 'mlb', 'lb'],
    w: ['w', 'wlb', 'olb', 'lb'],
  };

  ngOnInit() {
    if (this.startLB) {
      this.selectedLB = selectPlayersForPositions(this.startLB, this.positions);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['startLB'] && changes['startLB'].currentValue) {
      this.selectedLB = selectPlayersForPositions(this.startLB, this.positions);
      // console.log('Selected LB Players from ngOnChanges:', this.selectedLB);
    }
  }
}
