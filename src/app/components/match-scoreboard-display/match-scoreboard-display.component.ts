import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
} from '@angular/core';
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
import { IMatchFullContext } from '../../type/backend-api.type';
import { MatchContextService } from '../../services/match-context.service';
import { Store } from '@ngrx/store';
import { teamActions } from '../team/store/actions';
import { sportActions } from '../sport/store/actions';
import { positionActions } from '../position/store/actions';
import { playerInMatchActions } from '../player-match/store/actions';
import { selectCurrentMatchId } from '../match/store/reducers';

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
  ],
  animations: [RevealHideAnimation, dissolveAnimation],
})
export class MatchScoreboardDisplayComponent implements OnChanges, OnDestroy {
  private Websocket = inject(Websocket);
  private sport = inject(Sport);
  private match = inject(Match);
  private matchWithFullData = inject(MatchWithFullData);
  private tournament = inject(Tournament);
  private position = inject(Position);
  private playerInMatch = inject(PlayerInMatch);
  private team = inject(Team);
  private matchContextService = inject(MatchContextService);
  private store = inject(Store);

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

  constructor() {
    const sport = this.sport;
    const match = this.match;
    const matchWithFullData = this.matchWithFullData;
    const position = this.position;
    const playerInMatch = this.playerInMatch;
    const team = this.team;

    const matchId = this._getMatchId();

    if (matchId) {
      this.matchContextService.getMatchFullContext(matchId).subscribe({
        next: (context: IMatchFullContext) => {
          this.store.dispatch(teamActions.getMatchTeams());
          this.store.dispatch(sportActions.getSportByMatch());
          this.store.dispatch(sportActions.getAll());
          this.store.dispatch(positionActions.getAllPositionsBySportId());
          this.store.dispatch(
            playerInMatchActions.getAllPlayersWithFullDataInMatch(),
          );
        },
        error: (err) => {
          console.error(
            'Failed to load full context, falling back to old method',
            err,
          );
          this._loadDataOldMethod();
        },
      });
    } else {
      console.warn('No match ID found, falling back to old method');
      this._loadDataOldMethod();
    }
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

  private _getMatchId(): number | undefined {
    let matchId: number | undefined;
    this.store
      .select(selectCurrentMatchId)
      .subscribe((id) => (matchId = id ?? undefined));
    return matchId;
  }

  private _loadDataOldMethod() {
    const sport = this.sport;
    const match = this.match;
    const matchWithFullData = this.matchWithFullData;
    const position = this.position;
    const playerInMatch = this.playerInMatch;
    const team = this.team;

    team.loadMatchTeams();
    sport.loadSportByMatch();
    match.loadCurrentMatch();
    matchWithFullData.loadCurrentMatch();
    position.loadAllPositionsBySportId();
    playerInMatch.loadAllPlayersFullDataInMatch();
  }
}
