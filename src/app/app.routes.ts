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
import {
  sponsorFeatureKey,
  sponsorReducer,
} from './components/adv/sponsor/store/reducers';
import { SponsorEffects } from './components/adv/sponsor/store/effects';
import { SponsorComponent } from './components/adv/sponsor/sponsor.component';
import { ItemSponsorComponent } from './components/adv/sponsor/item-sponsor/item-sponsor.component';
import {
  sponsorLineFeatureKey,
  sponsorLineReducer,
} from './components/adv/sponsor-line/store/reducers';
import { SponsorLineComponent } from './components/adv/sponsor-line/sponsor-line.component';
import { SponsorLineEffects } from './components/adv/sponsor-line/store/effects';
import { ItemSponsorLineComponent } from './components/adv/sponsor-line/item-sponsor-line/item-sponsor-line.component';
import { sponsorSponsorLineConnectionFeatureKey } from './components/adv/sponsor-sponsor-line-connection/store/reducers';
import { SponsorSponsorLineConnectionService } from './components/adv/sponsor-sponsor-line-connection.service';
import {
  tournamentFeatureKey,
  tournamentReducer,
} from './components/tournament/store/reducers';
import { TournamentEffects } from './components/tournament/store/effects';
import { AllPersonsComponent } from './components/person/all-persons/all-persons.component';
import {
  personFeatureKey,
  personReducer,
} from './components/person/store/reducers';
import { PersonEffects } from './components/person/store/effects';
import { ItemPersonComponent } from './components/person/item-person/item-person.component';

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
      provideState(tournamentFeatureKey, tournamentReducer),
      provideState(sponsorFeatureKey, sponsorReducer),
      provideState(sponsorLineFeatureKey, sponsorLineReducer),
      provideEffects(
        MatchEffects,
        PlayclockEffects,
        GameclockEffects,
        WebSocketEffects,
        SponsorEffects,
        SponsorLineEffects,
        TournamentEffects,
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
        component: SponsorComponent,
        providers: [
          provideState(sponsorFeatureKey, sponsorReducer),
          provideEffects(SponsorEffects),
        ],
        data: {
          breadcrumb: {
            caption: 'Sponsors List',
            routerLink: 'home/adv/sponsors',
          },
        },
      },
      {
        path: 'home/adv/sponsor/:sponsor_id',
        component: ItemSponsorComponent,
        providers: [
          provideState(sponsorFeatureKey, sponsorReducer),
          provideEffects(SponsorEffects),
        ],
        data: {
          breadcrumb: {
            caption: 'Sponsor',
            routerLink: 'home/adv/sponsor/:sponsor_id',
          },
        },
      },
      {
        path: 'home/adv/sponsors/lines',
        component: SponsorLineComponent,
        providers: [
          provideState(sponsorLineFeatureKey, sponsorLineReducer),
          provideEffects(SponsorLineEffects),
        ],
        data: {
          breadcrumb: {
            caption: 'Sponsors Lines List',
            routerLink: 'home/adv/sponsors/lines',
          },
        },
      },
      {
        path: 'home/adv/sponsors/line/:sponsor_line_id',
        component: ItemSponsorLineComponent,
        providers: [
          provideState(sponsorLineFeatureKey, sponsorLineReducer),
          provideState(
            sponsorSponsorLineConnectionFeatureKey,
            sponsorLineReducer,
          ),
          provideEffects(
            SponsorLineEffects,
            SponsorSponsorLineConnectionService,
          ),
        ],
        data: {
          breadcrumb: {
            caption: 'Sponsors Line',
            routerLink: 'home/adv/sponsors/line/:sponsor_line_id',
          },
        },
      },
      { path: 'seasons', component: SeasonComponent },
      { path: 'seasons/year/:year', component: SeasonComponent },

      {
        path: 'persons',
        component: AllPersonsComponent,
        providers: [
          provideState(personFeatureKey, personReducer),
          provideEffects(PersonEffects),
        ],
      },

      {
        path: 'person/:person_id',
        component: ItemPersonComponent,
        providers: [
          provideState(personFeatureKey, personReducer),
          provideEffects(PersonEffects),
        ],
      },

      // {
      //   path: 'player/:player_id',
      //   component: ItemPlayerComponent,
      //   providers: [
      //     provideState(personFeatureKey, personReducer),
      //     provideState(playerFeatureKey, playerReducer),
      //     provideEffects(PersonEffects, PlayerEffects),
      //   ],
      //   data: {
      //     breadcrumb: {
      //       caption: 'Player',
      //       routerLink: 'player/:player_id',
      //     },
      //   },
      // },

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
