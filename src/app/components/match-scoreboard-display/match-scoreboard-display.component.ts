import { AsyncPipe } from '@angular/common';
import { Component, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { FootballStartRosterDisplayComponent } from '../../shared/scoreboards/football-start-roster-display/football-start-roster-display';
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
import {
  dissolveAnimation,
  RevealHideAnimation,
} from '../../shared/animations/scoreboard-animations';
import { PlayerMatchLowerDisplayFlatComponent } from '../../shared/scoreboards/player-match-lower-display-flat/player-match-lower-display-flat.component';

@Component({
  selector: 'app-match-scoreboard-display',
  standalone: true,
  templateUrl: './match-scoreboard-display.component.html',
  styleUrl: './match-scoreboard-display.component.less',
  imports: [
    AsyncPipe,
    ScoreboardDisplayFlatComponent,
    SponsorDisplayFlatComponent,
    MatchSponsorLineDisplayFlatComponent,
    FootballStartRosterDisplayComponent,
    PlayerMatchLowerDisplayFlatComponent
],
  animations: [RevealHideAnimation, dissolveAnimation],
})
export class MatchScoreboardDisplayComponent implements OnChanges, OnDestroy {
  // loading$: Observable<boolean> = this.Websocket.loading$;
  // error$: Observable<any> = this.Websocket.error$;
  sport$ = this.sport.currentSport$;
  // positions$ = this.position.allSportPositions$;
  homeTeam$ = this.team.homeTeam$;
  awayTeam$ = this.team.awayTeam$;
  tournament$: Observable<ITournament | null | undefined> =
    this.match.matchTournament$;
  mainTournamentSponsor$: Observable<ISponsor | null | undefined> =
    this.tournament.mainTournamentSponsor$;
  data$: Observable<IMatchFullDataWithScoreboard> = this.Websocket.data$;
  playclock$: Observable<IPlayclock> = this.Websocket.playclock$;
  gameclock$: Observable<IGameclock> = this.Websocket.gameclock$;

  //offense start
  homeFootballStartOffense$ = this.playerInMatch.homeFootballStartOffense$;
  // homeStartOL$ = this.playerInMatch.homeFootballStartOL$;
  // homeStartBacks$ = this.playerInMatch.homeFootballStartBacks$;
  // homeStartWR$ = this.playerInMatch.homeFootballStartWR$;
  awayFootballStartOffense$ = this.playerInMatch.awayFootballStartOffense$;
  // awayStartOL$ = this.playerInMatch.awayFootballStartOL$;
  // awayStartBacks$ = this.playerInMatch.awayFootballStartBacks$;
  // awayStartWR$ = this.playerInMatch.awayFootballStartWR$;
  //defense start
  homeFootballStartDefense$ = this.playerInMatch.homeFootballStartDefense$;
  awayFootballStartDefense$ = this.playerInMatch.awayFootballStartDefense$;
  // homeStartDL$ = this.playerInMatch.homeFootballStartDL$;
  // homeStartLB$ = this.playerInMatch.homeFootballStartLB$;
  // homeStartDB$ = this.playerInMatch.homeFootballStartDB$;
  // awayStartDL$ = this.playerInMatch.awayFootballStartDL$;
  // awayStartLB$ = this.playerInMatch.awayFootballStartLB$;
  // awayStartDB$ = this.playerInMatch.awayFootballStartDB$;

  // selectedPlayerInMatchLower$ =
  //   this.playerInMatch.selectSelectedPlayerInMatchLower$;

  homeOffenseRosterVisibility = 'invisible';
  awayOffenseRosterVisibility = 'invisible';
  homeDefenseRosterVisibility = 'invisible';
  awayDefenseRosterVisibility = 'invisible';

  // homePlayerLowerVisibility = 'invisible';
  // awayPlayerLowerVisibility = 'invisible';

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      const currData: IMatchFullDataWithScoreboard =
        changes['data'].currentValue;
      this.homeOffenseRosterVisibility = currData.scoreboard_data
        ?.is_team_a_start_offense
        ? 'visible'
        : 'invisible';
      this.awayOffenseRosterVisibility = currData.scoreboard_data
        ?.is_team_b_start_offense
        ? 'visible'
        : 'invisible';
      this.homeDefenseRosterVisibility = currData.scoreboard_data
        ?.is_team_a_start_defense
        ? 'visible'
        : 'invisible';
      this.awayDefenseRosterVisibility = currData.scoreboard_data
        ?.is_team_b_start_defense
        ? 'visible'
        : 'invisible';
    }
  }

  ngOnDestroy() {
    this.Websocket.disconnect();
  }
}
