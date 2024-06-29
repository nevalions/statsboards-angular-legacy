import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { SeasonEffects } from '../season/store/effects';
import { seasonFeatureKey, seasonReducer } from '../season/store/reducers';
import { ItemTournamentComponent } from '../tournament/item-tournament/item-tournament.component';
import { TournamentEffects } from '../tournament/store/effects';
import {
  tournamentFeatureKey,
  tournamentReducer,
} from '../tournament/store/reducers';
import { ItemSportWithSeasonComponent } from './item-sport/item-sport-with-season/item-sport-with-season.component';
import { ItemSportComponent } from './item-sport/item-sport.component';
import { WithTeamsComponent } from './item-sport/with-teams/with-teams.component';
import { SportComponent } from './sport.component';

import {
  paginationFeatureKey,
  paginationReducer,
} from '../../store/pagination/pagination.reducers';
import { SearchEffects } from '../../store/search/search.effects';
import {
  searchFeatureKey,
  searchReducer,
} from '../../store/search/search.reducers';
import { WebSocketEffects } from '../../store/websocket/websocket.effects';
import {
  webSocketFeatureKey,
  webSocketReducer,
} from '../../store/websocket/websocket.reducers';
import { SponsorLineEffects } from '../adv/sponsor-line/store/effects';
import {
  sponsorLineFeatureKey,
  sponsorLineReducer,
} from '../adv/sponsor-line/store/reducers';
import { SponsorEffects } from '../adv/sponsor/store/effects';
import {
  sponsorFeatureKey,
  sponsorReducer,
} from '../adv/sponsor/store/reducers';
import { GameclockEffects } from '../gameclock/store/effects';
import {
  gameclockFeatureKey,
  gameclockReducer,
} from '../gameclock/store/reducers';
import { MatchScoreboardAdminComponent } from '../match-scoreboard-admin/match-scoreboard-admin.component';
import { MatchWithFullDataEffects } from '../match-with-full-data/store/effects';
import {
  matchWithFullDataFeatureKey,
  matchWithFullDataReducer,
} from '../match-with-full-data/store/reducers';
import { ItemMatchComponent } from '../match/item-match/item-match.component';
import { MatchEffects } from '../match/store/effects';
import { MatchDataEffects } from '../match/store/match-data/effects';
import {
  matchDataFeatureKey,
  matchDataReducer,
} from '../match/store/match-data/reducers';
import { matchFeatureKey, matchReducer } from '../match/store/reducers';
import { PersonEffects } from '../person/store/effects';
import { personFeatureKey, personReducer } from '../person/store/reducers';
import { PlayclockEffects } from '../playclock/store/effects';
import {
  playclockFeatureKey,
  playclockReducer,
} from '../playclock/store/reducers';
import { PlayerInMatchEffects } from '../player-match/store/effects';
import {
  playerInMatchFeatureKey,
  playerInMatchReducer,
} from '../player-match/store/reducers';
import { PlayerInTeamTournamentEffects } from '../player-team-tournament/store/effects';
import {
  playerInTeamTournamentFeatureKey,
  playerInTeamTournamentReducer,
} from '../player-team-tournament/store/reducers';
import { ItemPlayerComponent } from '../player/item-player/item-player.component';
import { PlayerEffects } from '../player/store/effects';
import { playerFeatureKey, playerReducer } from '../player/store/reducers';
import { ItemPositionComponent } from '../position/item-position/item-position.component';
import { PositionEffects } from '../position/store/effects';
import {
  positionFeatureKey,
  positionReducer,
} from '../position/store/reducers';
import { ScoreboardDataEffects } from '../scoreboard-data/store/effects';
import {
  scoreboardDataFeatureKey,
  scoreboardDataReducer,
} from '../scoreboard-data/store/reducers';
import { TeamTournamentEffects } from '../team-tournament/store/effects';
import {
  teamTournamentFeatureKey,
  teamTournamentReducer,
} from '../team-tournament/store/reducers';
import { ItemTeamComponent } from '../team/item-team/item-team.component';
import { TeamEffects } from '../team/store/effects';
import { teamFeatureKey, teamReducer } from '../team/store/reducers';
import { WithPlayersComponent } from './item-sport/with-players/with-players.component';
import { WithPositionsComponent } from './item-sport/with-positions/with-positions.component';
import {
  footballEventFeatureKey,
  footballEventReducer,
} from '../match-event/football-event/store/reducers';
import { FootballEventEffects } from '../match-event/football-event/store/effects';

export const SPORT_ROUTES: Routes = [
  {
    path: '',
    component: SportComponent,
    children: [
      {
        path: ':sport_id',
        component: ItemSportComponent,
        children: [
          {
            path: 'teams',
            component: WithTeamsComponent,
            providers: [
              provideState(sponsorFeatureKey, sponsorReducer),
              provideState(sponsorLineFeatureKey, sponsorLineReducer),
              provideState(teamFeatureKey, teamReducer),
              provideState(searchFeatureKey, searchReducer),
              provideState(paginationFeatureKey, paginationReducer),
              provideEffects(
                TeamEffects,
                SponsorEffects,
                SponsorLineEffects,
                SearchEffects,
              ),
            ],
            data: {
              breadcrumb: {
                caption: 'Teams',
                routerLink: 'sport/:sport_id',
              },
            },
          },

          {
            path: 'team/:team_id',
            component: ItemTeamComponent,
            providers: [
              provideState(teamFeatureKey, teamReducer),
              provideState(sponsorLineFeatureKey, sponsorLineReducer),
              provideState(sponsorFeatureKey, sponsorReducer),
              provideEffects(TeamEffects, SponsorEffects, SponsorLineEffects),
            ],
            data: {
              breadcrumb: {
                caption: 'Team',
                routerLink: 'team/:team_id',
              },
            },
          },

          {
            path: 'players',
            component: WithPlayersComponent,
            providers: [
              provideState(personFeatureKey, personReducer),
              provideState(playerFeatureKey, playerReducer),
              provideState(teamFeatureKey, teamReducer),
              provideState(searchFeatureKey, searchReducer),
              provideState(paginationFeatureKey, paginationReducer),
              provideEffects(
                TeamEffects,
                PersonEffects,
                PlayerEffects,
                SearchEffects,
              ),
            ],
            data: {
              breadcrumb: {
                caption: 'Players',
                routerLink: 'sport/:sport_id/players',
              },
            },
          },

          {
            path: 'player/:player_id',
            component: ItemPlayerComponent,
            providers: [
              provideState(personFeatureKey, personReducer),
              provideState(playerFeatureKey, playerReducer),
              provideEffects(PersonEffects, PlayerEffects),
            ],
            data: {
              breadcrumb: {
                caption: 'Player',
                routerLink: 'player/:player_id',
              },
            },
          },

          {
            path: 'positions',
            component: WithPositionsComponent,
            providers: [
              provideState(positionFeatureKey, positionReducer),
              provideEffects(PositionEffects),
            ],
            data: {
              breadcrumb: {
                caption: 'Positions',
                routerLink: 'sport/:sport_id/positions',
              },
            },
          },

          {
            path: 'position/:position_id',
            component: ItemPositionComponent,
            providers: [
              provideState(positionFeatureKey, positionReducer),
              provideEffects(PositionEffects),
            ],
            data: {
              breadcrumb: {
                caption: 'Position',
                routerLink: 'sport/:sport_id/position/:position_id',
              },
            },
          },

          {
            path: 'season/:season_id',
            component: ItemSportComponent,
            children: [
              {
                path: 'tournaments',
                component: ItemSportWithSeasonComponent,
                providers: [
                  provideState(tournamentFeatureKey, tournamentReducer),
                  provideState(seasonFeatureKey, seasonReducer),
                  provideState(sponsorFeatureKey, sponsorReducer),
                  provideState(sponsorLineFeatureKey, sponsorLineReducer),
                  provideEffects(
                    SeasonEffects,
                    TournamentEffects,
                    SponsorEffects,
                    SponsorLineEffects,
                  ),
                ],
                data: {
                  breadcrumb: {
                    caption: 'Tournaments',
                    routerLink: 'sport/season/:season_id',
                  },
                },
              },
              {
                path: 'tournament/:tournament_id',
                component: ItemTournamentComponent,
                providers: [
                  provideState(seasonFeatureKey, seasonReducer),
                  provideState(teamFeatureKey, teamReducer),
                  provideState(tournamentFeatureKey, tournamentReducer),
                  provideState(teamTournamentFeatureKey, teamTournamentReducer),
                  provideState(matchFeatureKey, matchReducer),
                  provideState(personFeatureKey, personReducer),
                  provideState(playerFeatureKey, playerReducer),
                  provideState(positionFeatureKey, positionReducer),
                  provideState(
                    playerInTeamTournamentFeatureKey,
                    playerInTeamTournamentReducer,
                  ),
                  provideState(
                    matchWithFullDataFeatureKey,
                    matchWithFullDataReducer,
                  ),
                  provideState(sponsorLineFeatureKey, sponsorLineReducer),
                  provideState(sponsorFeatureKey, sponsorReducer),
                  provideState(searchFeatureKey, searchReducer),
                  provideState(paginationFeatureKey, paginationReducer),
                  provideEffects(
                    SponsorLineEffects,
                    SponsorEffects,
                    SeasonEffects,
                    TournamentEffects,
                    TeamEffects,
                    TeamTournamentEffects,
                    MatchEffects,
                    MatchWithFullDataEffects,
                    PersonEffects,
                    PlayerEffects,
                    PositionEffects,
                    PlayerInTeamTournamentEffects,
                    SearchEffects,
                  ),
                ],
                data: {
                  breadcrumb: {
                    caption: 'Tournament',
                    routerLink: 'sport/tournament/:tournament_id',
                  },
                },
              },
              {
                path: 'tournament/:tournament_id/team/:team_id',
                component: ItemTeamComponent,
                providers: [
                  provideState(seasonFeatureKey, seasonReducer),
                  provideState(teamFeatureKey, teamReducer),
                  provideState(personFeatureKey, personReducer),
                  provideState(playerFeatureKey, playerReducer),
                  provideState(positionFeatureKey, positionReducer),
                  provideState(
                    playerInTeamTournamentFeatureKey,
                    playerInTeamTournamentReducer,
                  ),
                  provideState(tournamentFeatureKey, tournamentReducer),
                  provideState(teamTournamentFeatureKey, teamTournamentReducer),
                  provideEffects(
                    SeasonEffects,
                    TournamentEffects,
                    TeamEffects,
                    TeamTournamentEffects,
                    PersonEffects,
                    PlayerEffects,
                    PositionEffects,
                    PlayerInTeamTournamentEffects,
                  ),
                ],
                data: {
                  breadcrumb: {
                    caption: 'Team',
                    routerLink: 'sport/tournament/:tournament_id/team/:team_id',
                  },
                },
              },
              {
                path: 'tournament/:tournament_id/match/:match_id',
                component: ItemMatchComponent,
                providers: [
                  provideState(seasonFeatureKey, seasonReducer),
                  provideState(teamFeatureKey, teamReducer),
                  provideState(tournamentFeatureKey, tournamentReducer),
                  provideState(teamTournamentFeatureKey, teamTournamentReducer),
                  provideState(personFeatureKey, personReducer),
                  provideState(playerFeatureKey, playerReducer),
                  provideState(positionFeatureKey, positionReducer),
                  provideState(
                    playerInTeamTournamentFeatureKey,
                    playerInTeamTournamentReducer,
                  ),
                  provideState(playerInMatchFeatureKey, playerInMatchReducer),
                  provideState(matchFeatureKey, matchReducer),
                  provideState(
                    matchWithFullDataFeatureKey,
                    matchWithFullDataReducer,
                  ),
                  provideState(sponsorFeatureKey, sponsorReducer),
                  provideState(sponsorLineFeatureKey, sponsorLineReducer),
                  provideState(footballEventFeatureKey, footballEventReducer),
                  provideEffects(
                    SeasonEffects,
                    TournamentEffects,
                    TeamEffects,
                    TeamTournamentEffects,
                    PersonEffects,
                    PlayerEffects,
                    PositionEffects,
                    PlayerInTeamTournamentEffects,
                    PlayerInMatchEffects,
                    MatchEffects,
                    MatchWithFullDataEffects,
                    SponsorEffects,
                    SponsorLineEffects,
                    FootballEventEffects,
                  ),
                ],
                data: {
                  breadcrumb: {
                    caption: 'Match',
                  },
                },
              },
              {
                path: 'tournament/:tournament_id/match/:match_id/admin',
                component: MatchScoreboardAdminComponent,
                providers: [
                  provideState(webSocketFeatureKey, webSocketReducer),
                  provideState(matchFeatureKey, matchReducer),
                  provideState(matchDataFeatureKey, matchDataReducer),
                  provideState(gameclockFeatureKey, gameclockReducer),
                  provideState(sponsorFeatureKey, sponsorReducer),
                  provideState(sponsorLineFeatureKey, sponsorReducer),
                  provideState(playclockFeatureKey, playclockReducer),
                  provideState(scoreboardDataFeatureKey, scoreboardDataReducer),
                  provideState(tournamentFeatureKey, tournamentReducer),
                  provideState(footballEventFeatureKey, footballEventReducer),
                  provideEffects(
                    MatchDataEffects,
                    PlayclockEffects,
                    GameclockEffects,
                    SponsorEffects,
                    SponsorLineEffects,
                    ScoreboardDataEffects,
                    TournamentEffects,
                    FootballEventEffects,
                    WebSocketEffects,
                  ),
                ],
                data: {
                  breadcrumb: {
                    caption: 'Admin',
                    routerLink:
                      'sport/tournament/:tournament_id/match/:match_id/admin',
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
