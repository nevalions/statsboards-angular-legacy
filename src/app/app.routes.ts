import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { ItemSponsorLineComponent } from './components/adv/sponsor-line/item-sponsor-line/item-sponsor-line.component';
import { SponsorLineComponent } from './components/adv/sponsor-line/sponsor-line.component';
import { SponsorLineEffects } from './components/adv/sponsor-line/store/effects';
import {
  sponsorLineFeatureKey,
  sponsorLineReducer,
} from './components/adv/sponsor-line/store/reducers';
import { SponsorSponsorLineConnectionService } from './components/adv/sponsor-sponsor-line-connection.service';
import { sponsorSponsorLineConnectionFeatureKey } from './components/adv/sponsor-sponsor-line-connection/store/reducers';
import { ItemSponsorComponent } from './components/adv/sponsor/item-sponsor/item-sponsor.component';
import { SponsorComponent } from './components/adv/sponsor/sponsor.component';
import { SponsorEffects } from './components/adv/sponsor/store/effects';
import {
  sponsorFeatureKey,
  sponsorReducer,
} from './components/adv/sponsor/store/reducers';
import { GameclockEffects } from './components/gameclock/store/effects';
import {
  gameclockFeatureKey,
  gameclockReducer,
} from './components/gameclock/store/reducers';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { MatchScoreboardDisplayComponent } from './components/match-scoreboard-display/match-scoreboard-display.component';
import { MatchWithFullDataEffects } from './components/match-with-full-data/store/effects';
import {
  matchWithFullDataFeatureKey,
  matchWithFullDataReducer,
} from './components/match-with-full-data/store/reducers';
import { MatchEffects } from './components/match/store/effects';
import {
  matchFeatureKey,
  matchReducer,
} from './components/match/store/reducers';
import { AllPersonsComponent } from './components/person/all-persons/all-persons.component';
import { ItemPersonComponent } from './components/person/item-person/item-person.component';
import { PersonEffects } from './components/person/store/effects';
import {
  personFeatureKey,
  personReducer,
} from './components/person/store/reducers';
import { PlayclockEffects } from './components/playclock/store/effects';
import {
  playclockFeatureKey,
  playclockReducer,
} from './components/playclock/store/reducers';
import { PlayerInMatchEffects } from './components/player-match/store/effects';
import {
  playerInMatchFeatureKey,
  playerInMatchReducer,
} from './components/player-match/store/reducers';
import { PositionEffects } from './components/position/store/effects';
import {
  positionFeatureKey,
  positionReducer,
} from './components/position/store/reducers';
import { SeasonComponent } from './components/season/season.component';
import { seasonFeatureKey } from './components/season/store/reducers';
import { SportComponent } from './components/sport/sport.component';
import { TeamEffects } from './components/team/store/effects';
import { teamFeatureKey, teamReducer } from './components/team/store/reducers';
import { TournamentEffects } from './components/tournament/store/effects';
import {
  tournamentFeatureKey,
  tournamentReducer,
} from './components/tournament/store/reducers';
import { TournamentComponent } from './components/tournament/tournament.component';
import { PageNotFoundComponent } from './pagenotfound/page-not-found.component';
import {
  paginationFeatureKey,
  paginationReducer,
} from './store/pagination/pagination.reducers';
import { SearchEffects } from './store/search/search.effects';
import {
  searchFeatureKey,
  searchReducer,
} from './store/search/search.reducers';
import { WebSocketEffects } from './store/websocket/websocket.effects';
import {
  webSocketFeatureKey,
  webSocketReducer,
} from './store/websocket/websocket.reducers';
import {
  footballEventFeatureKey,
  footballEventReducer,
} from './components/match-event/football-event/store/reducers';
import { FootballEventEffects } from './components/match-event/football-event/store/effects';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'index' },
  {
    path: 'scoreboard/match/:match_id/hd',
    component: MatchScoreboardDisplayComponent,
    providers: [
      provideState(seasonFeatureKey, searchReducer),
      provideState(webSocketFeatureKey, webSocketReducer),
      provideState(teamFeatureKey, teamReducer),
      provideState(playclockFeatureKey, playclockReducer),
      provideState(gameclockFeatureKey, gameclockReducer),
      provideState(matchFeatureKey, matchReducer),
      provideState(matchWithFullDataFeatureKey, matchWithFullDataReducer),
      provideState(tournamentFeatureKey, tournamentReducer),
      provideState(sponsorFeatureKey, sponsorReducer),
      provideState(sponsorLineFeatureKey, sponsorLineReducer),
      provideState(positionFeatureKey, positionReducer),
      provideState(playerInMatchFeatureKey, playerInMatchReducer),
      provideState(footballEventFeatureKey, footballEventReducer),
      provideEffects(
        SearchEffects,
        MatchEffects,
        TeamEffects,
        MatchWithFullDataEffects,
        PlayclockEffects,
        GameclockEffects,
        WebSocketEffects,
        SponsorEffects,
        SponsorLineEffects,
        TournamentEffects,
        PositionEffects,
        PlayerInMatchEffects,
        FootballEventEffects,
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
          provideState(searchFeatureKey, searchReducer),
          provideState(paginationFeatureKey, paginationReducer),
          provideEffects(PersonEffects, SearchEffects),
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
