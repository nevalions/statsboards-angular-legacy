import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IMatchFullDataWithScoreboard } from '../../type/match.type';
import { Websocket } from '../../store/websocket/websocket';
import { AsyncPipe, NgIf } from '@angular/common';
import { ScoreboardDisplayFlatComponent } from '../../shared/scoreboards/scoreboard-display-flat/scoreboard-display-flat.component';
import { IPlayclock } from '../../type/playclock.type';
import { IGameclock } from '../../type/gameclock.type';
import { SponsorDisplayFlatComponent } from '../../shared/scoreboards/sponsor-display-flat/sponsor-display-flat.component';
import { Match } from '../match/match';
import { ITournament } from '../../type/tournament.type';
import { ISponsor } from '../../type/sponsor.type';
import { Tournament } from '../tournament/tournament';

@Component({
  selector: 'app-match-scoreboard-display',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    ScoreboardDisplayFlatComponent,
    SponsorDisplayFlatComponent,
  ],
  templateUrl: './match-scoreboard-display.component.html',
  styleUrl: './match-scoreboard-display.component.less',
})
export class MatchScoreboardDisplayComponent implements OnDestroy {
  // loading$: Observable<boolean> = this.Websocket.loading$;
  // error$: Observable<any> = this.Websocket.error$;
  tournament$: Observable<ITournament | null | undefined> =
    this.match.matchTournament$;
  mainTournamentSponsor$: Observable<ISponsor | null | undefined> =
    this.tournament.mainTournamentSponsor$;
  data$: Observable<IMatchFullDataWithScoreboard> = this.Websocket.data$;
  playclock$: Observable<IPlayclock> = this.Websocket.playclock$;
  gameclock$: Observable<IGameclock> = this.Websocket.gameclock$;

  constructor(
    private Websocket: Websocket,
    private match: Match,
    private tournament: Tournament,
  ) {
    match.loadCurrentMatch();
  }

  // ngOnInit() {
  //   // this.Websocket.connect();
  // }

  ngOnDestroy() {
    this.Websocket.disconnect();
  }
}
