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
import * as createTournamentEffect from '../tournament/store/effects';
import * as getTournamentsBySportAndSeasonEffect from '../tournament/store/effects';
import { TournamentEffects } from '../tournament/store/effects';
import { SeasonService } from '../season/season.service';
import { SeasonEffects } from '../season/store/effects';
import { seasonFeatureKey, seasonReducer } from '../season/store/reducers';
import { sportFeatureKey, sportReducer } from './store/reducers';
import { SportEffects } from './store/effects';
import { SeasonComponent } from '../season/season.component';
import { ItemTournamentComponent } from '../tournament/item-tournament/item-tournament.component';
import { teamActions } from '../team/store/actions';
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
              provideState(teamFeatureKey, teamReducer),
              provideEffects(TeamEffects),
            ],
            data: {
              breadcrumb: {
                caption: 'Teams',
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
                  provideEffects(SeasonEffects, TournamentEffects),
                ],
                data: {
                  breadcrumb: {
                    caption: 'Tournaments',
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
                    caption: 'Tournament',
                  },
                },
              },
              {
                path: 'tournament/:tournament_id/team/:team_id',
                component: ItemTeamComponent,
                providers: [
                  provideState(seasonFeatureKey, seasonReducer),
                  provideState(teamFeatureKey, teamReducer),
                  provideState(tournamentFeatureKey, tournamentReducer),
                  provideState(teamTournamentFeatureKey, teamTournamentReducer),
                  provideEffects(
                    SeasonEffects,
                    TournamentEffects,
                    TeamEffects,
                    TeamTournamentEffects,
                  ),
                ],
                data: {
                  breadcrumb: {
                    caption: 'Team',
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
                  provideState(scoreboardDataFeatureKey, scoreboardDataReducer),
                  provideEffects(
                    MatchDataEffects,
                    ScoreboardDataEffects,
                    WebSocketEffects,
                  ),
                ],
                data: {
                  breadcrumb: {
                    caption: 'Admin',
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

//   {
//     path: ':sport_id',
//     component: ItemSportComponent,
//   },
//   {
//     path: ':sport_id/teams',
//     component: WithTeamsComponent,
//     providers: [
//       provideState(teamFeatureKey, teamReducer),
//       provideEffects(TeamEffects),
//     ],
//   },
//   {
//     path: ':sport_id/season/:season_id/tournaments',
//     component: ItemSportWithSeasonComponent,
//     providers: [
//       provideState(tournamentFeatureKey, tournamentReducer),
//       provideState(seasonFeatureKey, seasonReducer),
//       provideEffects(SeasonEffects, TournamentEffects),
//     ],
//   },
//   {
//     path: ':sport_id/season/:season_id/tournament/:tournament_id',
//     component: ItemTournamentComponent,
//     providers: [
//       provideState(seasonFeatureKey, seasonReducer),
//       provideState(teamFeatureKey, teamReducer),
//       provideState(tournamentFeatureKey, tournamentReducer),
//       provideState(teamTournamentFeatureKey, teamTournamentReducer),
//       provideEffects(
//         SeasonEffects,
//         TournamentEffects,
//         TeamEffects,
//         TeamTournamentEffects,
//       ),
//     ],
//   },
// ];
