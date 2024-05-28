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
  selector: 'app-oline-start',
  standalone: true,
  imports: [PlayerCardRosterComponent, NgIf],
  templateUrl: './oline-start.component.html',
  styleUrl: './oline-start.component.less',
})
export class OlineStartComponent implements OnInit, OnChanges {
  @Input() startOL: IPlayerInMatchFullData[] = [];
  public selectedOL: { [key: string]: IPlayerInMatchFullData | null } = {};
  public positions = {
    lt: ['lt', 't', 'ot', 'ol'],
    lg: ['lg', 'og', 'g', 'ol'],
    c: ['c', 'oc', 'ol'],
    rg: ['rg', 'og', 'g', 'ol'],
    rt: ['rt', 't', 'ot', 'ol'],
  };

  ngOnInit() {
    if (this.startOL) {
      this.selectedOL = selectPlayersForPositions(this.startOL, this.positions);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['startOL'] && changes['startOL'].currentValue) {
      this.selectedOL = selectPlayersForPositions(this.startOL, this.positions);
      // console.log('Selected OL Players from ngOnChanges:', this.selectedOL);
    }
  }
}
