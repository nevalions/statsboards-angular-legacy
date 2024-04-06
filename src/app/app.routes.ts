import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pagenotfound/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { SeasonComponent } from './components/season/season.component';
import { TournamentComponent } from './components/tournament/tournament.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ItemTeamComponent } from './components/team/item-team/item-team.component';
import { teamFeatureKey, teamReducer } from './components/team/store/reducers';
import { TeamEffects } from './components/team/store/effects';
import {
  matchFeatureKey,
  matchReducer,
} from './components/match/store/reducers';
import { MatchEffects } from './components/match/store/effects';
import {
  webSocketFeatureKey,
  webSocketReducer,
} from './store/websocket/websocket.reducers';
import { WebSocketEffects } from './store/websocket/websocket.effects';
import { MatchScoreboardDisplayComponent } from './components/match-scoreboard-display/match-scoreboard-display.component';
import { SportComponent } from './components/sport/sport.component';
import { LayoutComponent } from './components/layout/layout.component';
import {
  playclockFeatureKey,
  playclockReducer,
} from './components/playclock/store/reducers';
import { PlayclockEffects } from './components/playclock/store/effects';
import {
  gameclockFeatureKey,
  gameclockReducer,
} from './components/gameclock/store/reducers';
import { GameclockEffects } from './components/gameclock/store/effects';
import { fileFeatureKey, fileReducer } from './store/file/file.reducers';
import { FileEffects } from './store/file/file.effects';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'index' },
  {
    path: 'scoreboard/match/:match_id/hd',
    component: MatchScoreboardDisplayComponent,
    providers: [
      provideState(webSocketFeatureKey, webSocketReducer),
      provideState(playclockFeatureKey, playclockReducer),
      provideState(gameclockFeatureKey, gameclockReducer),
      provideState(matchFeatureKey, matchReducer),
      provideEffects(
        MatchEffects,
        PlayclockEffects,
        GameclockEffects,
        WebSocketEffects,
      ),
    ],
    data: {
      breadcrumb: {
        caption: 'HD',
        routerLink: 'scoreboard/match/:match_id/hd',
      },
    },
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'index',
        component: HomeComponent,
        data: { breadcrumb: { caption: 'Home', routerLink: 'index' } },
      },
      {
        path: 'home/adv/sponsors',
        component: HomeComponent,
        data: {
          breadcrumb: {
            caption: 'Sponsors List',
            routerLink: 'home/adv/sponsors',
          },
        },
      },
      {
        path: 'home/adv/sponsor/:sponsor',
        component: HomeComponent,
        data: {
          breadcrumb: {
            caption: 'Sponsor',
            routerLink: 'home/adv/sponsor/:sponsor',
          },
        },
      },
      {
        path: 'home/adv/sponsors/lines',
        component: HomeComponent,
        data: {
          breadcrumb: {
            caption: 'Sponsors Lines List',
            routerLink: 'home/adv/sponsors/lines',
          },
        },
      },
      {
        path: 'home/adv/sponsors/line/:sponsor_line',
        component: HomeComponent,
        data: {
          breadcrumb: {
            caption: 'Sponsors Line',
            routerLink: 'home/adv/sponsors/line/:sponsor_line',
          },
        },
      },
      { path: 'seasons', component: SeasonComponent },
      { path: 'seasons/year/:year', component: SeasonComponent },

      {
        path: 'sport',
        component: SportComponent,
        loadChildren: () =>
          import('./components/sport/sport.routes').then((r) => r.SPORT_ROUTES),
      },

      {
        path: 'tournament',
        component: TournamentComponent,
        loadChildren: () =>
          import('./components/tournament/tournament.routes').then(
            (r) => r.TOURNAMENT_ROUTES,
          ),
      },

      {
        path: 'team/:team_id',
        component: ItemTeamComponent,
        providers: [
          provideState(teamFeatureKey, teamReducer),
          provideEffects(TeamEffects),
        ],
        data: {
          breadcrumb: {
            caption: 'Team',
            routerLink: 'team/:team_id',
          },
        },
      },

      { path: 'error404', component: PageNotFoundComponent },
      { path: '**', component: PageNotFoundComponent },
    ],
    data: {
      breadcrumb: {
        caption: 'index',
        routerLink: '',
      },
    },
  },
];

// {
//   path: 'matches',
//   component: MatchComponent,
//   loadChildren: () =>
//     import('./components/match/match.routes').then((r) => r.MATCH_ROUTES),
// },

// {
//   path: 'sport/:sport_id',
//   component: ItemSportComponent,
// },
// {
//   path: 'sport/:sport_id/teams',
//   component: WithTeamsComponent,
//   providers: [
//     provideState(teamFeatureKey, teamReducer),
//     provideEffects(TeamEffects),
//   ],
//   data: {
//     breadcrumb: {
//       caption: 'Teams',
//       routerLink: 'sport/:sport_id/teams',
//     },
//   },
// },
