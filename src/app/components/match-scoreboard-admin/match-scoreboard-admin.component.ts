import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { IMatchFullDataWithScoreboard } from '../../type/match.type';
import { Websocket } from '../../store/websocket/websocket';
import { TuiLoaderModule } from '@taiga-ui/core';
import { ScoreboardDisplayFlatComponent } from '../../shared/scoreboards/scoreboard-display-flat/scoreboard-display-flat.component';
import { AllAdminFormsComponent } from '../../shared/scoreboards/admin-forms/all-admin-forms/all-admin-forms.component';
import { IPlayclock } from '../../type/playclock.type';
import { IGameclock } from '../../type/gameclock.type';

@Component({
  selector: 'app-match-scoreboard-admin',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiLoaderModule,
    NgIf,
    ScoreboardDisplayFlatComponent,
    AllAdminFormsComponent,
  ],
  templateUrl: './match-scoreboard-admin.component.html',
  styleUrl: './match-scoreboard-admin.component.less',
})
export class MatchScoreboardAdminComponent implements OnInit, OnDestroy {
  // loading$: Observable<boolean> = this.Websocket.loading$;
  // error$: Observable<any> = this.Websocket.error$;
  data$: Observable<IMatchFullDataWithScoreboard> = this.Websocket.data$;
  playclock$: Observable<IPlayclock> = this.Websocket.playclock$;
  gameclock$: Observable<IGameclock> = this.Websocket.gameclock$;

  constructor(private Websocket: Websocket) {}

  ngOnInit() {
    this.Websocket.connect();
  }

  ngOnDestroy() {
    this.Websocket.disconnect();
  }
}
