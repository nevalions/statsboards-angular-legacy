import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { FootballOffenseStartDisplayComponent } from '../../shared/scoreboards/football-offense-start-display/football-offense-start-display.component';
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
import { Team } from '../team/team';
import { Tournament } from '../tournament/tournament';

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
    FootballOffenseStartDisplayComponent,
  ],
})
export class MatchScoreboardDisplayComponent implements OnDestroy {
  // loading$: Observable<boolean> = this.Websocket.loading$;
  // error$: Observable<any> = this.Websocket.error$;
  sport$ = this.sport.currentSport$;
  positions$ = this.position.allSportPositions$;
  homeTeam$ = this.team.homeTeam$;
  awayTeam$ = this.team.awayTeam$;
  tournament$: Observable<ITournament | null | undefined> =
    this.match.matchTournament$;
  mainTournamentSponsor$: Observable<ISponsor | null | undefined> =
    this.tournament.mainTournamentSponsor$;
  data$: Observable<IMatchFullDataWithScoreboard> = this.Websocket.data$;
  playclock$: Observable<IPlayclock> = this.Websocket.playclock$;
  gameclock$: Observable<IGameclock> = this.Websocket.gameclock$;
  // showHomeOffenseStart: Observable<boolean> = this.Websocket.showHomeRoster$;
  showHomeDefenseStart: boolean = false;
  showAwayOffenseStart: boolean = false;
  showAwayDefenseStart: boolean = false;
  //offense start
  homeFootballStartOffense$ = this.playerInMatch.homeFootballStartOffense$;
  homeStartOL$ = this.playerInMatch.homeFootballStartOL$;
  homeStartBacks$ = this.playerInMatch.homeFootballStartBacks$;
  homeStartWR$ = this.playerInMatch.homeFootballStartWR$;
  awayFootballStartOffense$ = this.playerInMatch.awayFootballStartOffense$;
  awayStartOL$ = this.playerInMatch.awayFootballStartOL$;
  awayStartBacks$ = this.playerInMatch.awayFootballStartBacks$;
  awayStartWR$ = this.playerInMatch.awayFootballStartWR$;
  //defense start
  homeFootballStartDefense$ = this.playerInMatch.homeFootballStartDefense$;
  awayFootballStartDefense$ = this.playerInMatch.awayFootballStartDefense$;
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
    private team: Team,
  ) {
    team.loadMatchTeams();
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
