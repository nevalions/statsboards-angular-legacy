import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../type/match.type';
import { Match } from '../match/match';
import { Websocket } from '../../store/websocket/websocket';
import { AsyncPipe, NgIf } from '@angular/common';
import { ScoreboardDisplayFlatComponent } from '../../shared/scoreboards/scoreboard-display-flat/scoreboard-display-flat.component';

@Component({
  selector: 'app-match-scoreboard-display',
  standalone: true,
  imports: [AsyncPipe, NgIf, ScoreboardDisplayFlatComponent],
  templateUrl: './match-scoreboard-display.component.html',
  styleUrl: './match-scoreboard-display.component.less',
})
export class MatchScoreboardDisplayComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean> = this.Websocket.loading$;
  error$: Observable<any> = this.Websocket.error$;
  data$: Observable<IMatchFullDataWithScoreboard> = this.Websocket.data$;

  constructor(private Websocket: Websocket) {}

  ngOnInit() {
    this.Websocket.connect();
  }

  ngOnDestroy() {
    this.Websocket.disconnect();
  }
}
