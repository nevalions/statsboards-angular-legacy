import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { MatchSponsorLineDisplayFlatComponent } from '../../shared/scoreboards/match-sponsor-line-display-flat/match-sponsor-line-display-flat.component';
import { ScoreboardDisplayFlatComponent } from '../../shared/scoreboards/scoreboard-display-flat/scoreboard-display-flat.component';
import { SponsorDisplayFlatComponent } from '../../shared/scoreboards/sponsor-display-flat/sponsor-display-flat.component';
import { Websocket } from '../../store/websocket/websocket';
import { IGameclock } from '../../type/gameclock.type';
import { IMatchFullDataWithScoreboard } from '../../type/match.type';
import { IPlayclock } from '../../type/playclock.type';
import { ISponsor } from '../../type/sponsor.type';
import { ITournament } from '../../type/tournament.type';
import { MatchWithFullData } from '../match-with-full-data/matchWithFullData';
import { Match } from '../match/match';
import { PlayerInMatch } from '../player-match/player-match';
import { Position } from '../position/postion';
import { Sport } from '../sport/sport';
import { Tournament } from '../tournament/tournament';
import { PlayerCardRosterComponent } from '../../shared/scoreboards/player-card-roster/player-card-roster.component';

@Component({
  selector: 'app-match-scoreboard-display',
  standalone: true,
  templateUrl: './match-scoreboard-display.component.html',
  styleUrl: './match-scoreboard-display.component.less',
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    ScoreboardDisplayFlatComponent,
    SponsorDisplayFlatComponent,
    MatchSponsorLineDisplayFlatComponent,
    PlayerCardRosterComponent,
  ],
})
export class MatchScoreboardDisplayComponent implements OnDestroy {
  // loading$: Observable<boolean> = this.Websocket.loading$;
  // error$: Observable<any> = this.Websocket.error$;
  sport$ = this.sport.currentSport$;
  positions$ = this.position.allSportPositions$;
  tournament$: Observable<ITournament | null | undefined> =
    this.match.matchTournament$;
  mainTournamentSponsor$: Observable<ISponsor | null | undefined> =
    this.tournament.mainTournamentSponsor$;
  data$: Observable<IMatchFullDataWithScoreboard> = this.Websocket.data$;
  playclock$: Observable<IPlayclock> = this.Websocket.playclock$;
  gameclock$: Observable<IGameclock> = this.Websocket.gameclock$;
  showHomeOffenseStart: boolean = true;
  showHomeDefenseStart: boolean = true;
  showAwayOffenseStart: boolean = true;
  showAwayDefenseStart: boolean = true;
  //offense start
  homeFootballStartOffense$ = this.playerInMatch.homeFootballStartOffense$;
  homeStartOL$ = this.playerInMatch.homeFootballStartOL$;
  homeStartBacks$ = this.playerInMatch.homeFootballStartBacks$;
  homeStartWR$ = this.playerInMatch.homeFootballStartWR$;
  awayStartOL$ = this.playerInMatch.awayFootballStartOL$;
  awayStartBacks$ = this.playerInMatch.awayFootballStartBacks$;
  awayStartWR$ = this.playerInMatch.awayFootballStartWR$;
  //defense start
  homeStartDL$ = this.playerInMatch.homeFootballStartDL$;
  homeStartLB$ = this.playerInMatch.homeFootballStartLB$;
  homeStartDB$ = this.playerInMatch.homeFootballStartDB$;
  awayStartDL$ = this.playerInMatch.awayFootballStartDL$;
  awayStartLB$ = this.playerInMatch.awayFootballStartLB$;
  awayStartDB$ = this.playerInMatch.awayFootballStartDB$;

  constructor(
    private Websocket: Websocket,
    private sport: Sport,
    private match: Match,
    private matchWithFullData: MatchWithFullData,
    private tournament: Tournament,
    private position: Position,
    private playerInMatch: PlayerInMatch,
  ) {
    sport.loadSportByMatch();
    match.loadCurrentMatch();
    matchWithFullData.loadCurrentMatch();
    position.loadAllPositionsBySportId();
    playerInMatch.loadAllPlayersFullDataInMatch();
  }

  // ngOnInit() {
  //   // this.Websocket.connect();
  // }

  ngOnDestroy() {
    this.Websocket.disconnect();
  }
}
