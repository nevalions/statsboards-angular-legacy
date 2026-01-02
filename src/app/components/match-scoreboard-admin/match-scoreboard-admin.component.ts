import { TuiLoader } from "@taiga-ui/core";
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { IMatchFullDataWithScoreboard } from '../../type/match.type';
import { Websocket } from '../../store/websocket/websocket';
import { ScoreboardDisplayFlatComponent } from '../../shared/scoreboards/scoreboard-display-flat/scoreboard-display-flat.component';
import { AllAdminFormsComponent } from '../../shared/scoreboards/admin-forms/all-admin-forms/all-admin-forms.component';
import { IPlayclock } from '../../type/playclock.type';
import { IGameclock } from '../../type/gameclock.type';
import { Match } from '../match/match';
import { ITournament } from '../../type/tournament.type';
import { ISponsor } from '../../type/sponsor.type';
import { Tournament } from '../tournament/tournament';

@Component({
  selector: 'app-match-scoreboard-admin',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiLoader,
    ScoreboardDisplayFlatComponent,
    AllAdminFormsComponent
],
  templateUrl: './match-scoreboard-admin.component.html',
  styleUrl: './match-scoreboard-admin.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchScoreboardAdminComponent {
  private Websocket = inject(Websocket);
  private match = inject(Match);
  private tournament = inject(Tournament);

  tournament$: Observable<ITournament | null | undefined> =
    this.match.matchTournament$;
  mainTournamentSponsor$: Observable<ISponsor | null | undefined> =
    this.tournament.mainTournamentSponsor$;
  data$: Observable<IMatchFullDataWithScoreboard> = this.Websocket.data$;
  playclock$: Observable<IPlayclock> = this.Websocket.playclock$;
  gameclock$: Observable<IGameclock> = this.Websocket.gameclock$;

  constructor() {
    const match = this.match;

    // Websocket.connect();
    match.loadCurrentMatch();
  }
}
