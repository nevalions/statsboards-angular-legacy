import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { IMatchFullDataWithScoreboard } from '../../type/match.type';
import { Websocket } from '../../store/websocket/websocket';
import { TuiLoaderModule } from '@taiga-ui/core';
import { ScoreboardDisplayFlatComponent } from '../../shared/scoreboards/scoreboard-display-flat/scoreboard-display-flat.component';
import { AllAdminFormsComponent } from '../../shared/scoreboards/admin-forms/all-admin-forms/all-admin-forms.component';
import { IPlayclock } from '../../type/playclock.type';
import { IGameclock } from '../../type/gameclock.type';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/appstate';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchScoreboardAdminComponent {
  // loading$: Observable<boolean> = this.Websocket.loading$;
  // error$: Observable<any> = this.Websocket.error$;
  data$: Observable<IMatchFullDataWithScoreboard> = this.Websocket.data$;
  playclock$: Observable<IPlayclock> = this.Websocket.playclock$;
  gameclock$: Observable<IGameclock> = this.Websocket.gameclock$;

  constructor(
    private Websocket: Websocket,
    private store: Store<AppState>,
  ) {
    this.Websocket.connect();
    // this.data$.subscribe((result) => {
    //   console.log('DATA DATA', result);
    // });
  }

  // ngOnInit() {
  //   this.Websocket.connect();
  //   this.data$.subscribe((result) => {
  //     console.log('DATA DATA', result);
  //   });
  //   // this.store
  //   //   .select((state) => state.webSocket)
  //   //   .subscribe((result) => {
  //   //     console.log(result);
  //   //   });
  // }
  //
  // ngOnDestroy() {
  //   this.Websocket.disconnect();
  // }
}
