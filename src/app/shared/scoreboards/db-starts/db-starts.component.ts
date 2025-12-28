
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
  selector: 'app-db-starts',
  standalone: true,
  imports: [PlayerCardRosterComponent],
  templateUrl: './db-starts.component.html',
  styleUrl: './db-starts.component.less',
})
export class DbStartsComponent implements OnInit, OnChanges {
  @Input() startDB: IPlayerInMatchFullData[] = [];
  public selectedDB: { [key: string]: IPlayerInMatchFullData | null } = {};
  public positions = {
    cbs: ['cb', 'db'],
    ss: ['ss', 'db'],
    fs: ['fs', 'db'],
    cbw: ['cb', 'db'],
  };

  ngOnInit() {
    if (this.startDB) {
      this.selectedDB = selectPlayersForPositions(this.startDB, this.positions);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['startDB'] && changes['startDB'].currentValue) {
      this.selectedDB = selectPlayersForPositions(this.startDB, this.positions);
      // console.log('Selected LB Players from ngOnChanges:', this.selectedDB);
    }
  }
}
