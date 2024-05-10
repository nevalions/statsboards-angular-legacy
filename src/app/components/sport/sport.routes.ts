import { Routes } from '@angular/router';
import { SportComponent } from './sport.component';
import { ItemSportComponent } from './item-sport/item-sport.component';
import { WithTeamsComponent } from './item-sport/with-teams/with-teams.component';
import { ItemSportWithSeasonComponent } from './item-sport/item-sport-with-season/item-sport-with-season.component';
import { provideState } from '@ngrx/store';
import {
  tournamentFeatureKey,
  tournamentReducer,
} from '../tournament/store/reducers';
import { provideEffects } from '@ngrx/effects';
import { TournamentEffects } from '../tournament/store/effects';
import { SeasonEffects } from '../season/store/effects';
import { seasonFeatureKey, seasonReducer } from '../season/store/reducers';
import { ItemTournamentComponent } from '../tournament/item-tournament/item-tournament.component';

import { teamFeatureKey, teamReducer } from '../team/store/reducers';
import { TeamEffects } from '../team/store/effects';
import { TeamTournamentEffects } from '../team-tournament/store/effects';
import {
  teamTournamentFeatureKey,
  teamTournamentReducer,
} from '../team-tournament/store/reducers';
import { matchFeatureKey, matchReducer } from '../match/store/reducers';
import {
  matchWithFullDataFeatureKey,
  matchWithFullDataReducer,
} from '../match-with-full-data/store/reducers';
import { MatchEffects } from '../match/store/effects';
import { MatchWithFullDataEffects } from '../match-with-full-data/store/effects';
import { ItemTeamComponent } from '../team/item-team/item-team.component';
import { ItemMatchComponent } from '../match/item-match/item-match.component';
import { MatchScoreboardAdminComponent } from '../match-scoreboard-admin/match-scoreboard-admin.component';
import {
  webSocketFeatureKey,
  webSocketReducer,
} from '../../store/websocket/websocket.reducers';
import {
  matchDataFeatureKey,
  matchDataReducer,
} from '../match/store/match-data/reducers';
import {
  scoreboardDataFeatureKey,
  scoreboardDataReducer,
} from '../scoreboard-data/store/reducers';
import { MatchDataEffects } from '../match/store/match-data/effects';
import { ScoreboardDataEffects } from '../scoreboard-data/store/effects';
import { WebSocketEffects } from '../../store/websocket/websocket.effects';
import {
  playclockFeatureKey,
  playclockReducer,
} from '../playclock/store/reducers';
import { PlayclockEffects } from '../playclock/store/effects';
import {
  gameclockFeatureKey,
  gameclockReducer,
} from '../gameclock/store/reducers';
import { GameclockEffects } from '../gameclock/store/effects';
import {
  sponsorFeatureKey,
  sponsorReducer,
} from '../adv/sponsor/store/reducers';
import {
  sponsorLineFeatureKey,
  sponsorLineReducer,
} from '../adv/sponsor-line/store/reducers';
import { SponsorEffects } from '../adv/sponsor/store/effects';
import { SponsorLineEffects } from '../adv/sponsor-line/store/effects';
import { WithPlayersComponent } from './item-sport/with-players/with-players.component';
import { personFeatureKey, personReducer } from '../person/store/reducers';
import { playerFeatureKey, playerReducer } from '../player/store/reducers';
import { PersonEffects } from '../person/store/effects';
import { PlayerEffects } from '../player/store/effects';
import { ItemPlayerComponent } from '../player/item-player/item-player.component';
import {
  searchFeatureKey,
  searchReducer,
} from '../../store/search/search.reducers';
import { SearchEffects } from '../../store/search/search.effects';
import {
  paginationFeatureKey,
  paginationReducer,
} from '../../store/pagination/pagination.reducers';
import { WithPositionsComponent } from './item-sport/with-positions/with-positions.component';
import { ItemPositionComponent } from '../position/item-position/item-position.component';
import {
  positionFeatureKey,
  positionReducer,
} from '../position/store/reducers';
import { PositionEffects } from '../position/store/effects';
import {
  playerInTeamTournamentFeatureKey,
  playerInTeamTournamentReducer,
} from '../player-team-tournament/store/reducers';
import { PlayerInTeamTournamentEffects } from '../player-team-tournament/store/effects';

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
                  provideState(matchFeatureKey, matchReducer),
                  provideState(
                    matchWithFullDataFeatureKey,
                    matchWithFullDataReducer,
                  ),
                  provideEffects(
                    SeasonEffects,
                    TournamentEffects,
                    TeamEffects,
                    TeamTournamentEffects,
                    MatchEffects,
                    MatchWithFullDataEffects,
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
                  provideEffects(
                    MatchDataEffects,
                    PlayclockEffects,
                    GameclockEffects,
                    SponsorEffects,
                    SponsorLineEffects,
                    ScoreboardDataEffects,
                    TournamentEffects,
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
