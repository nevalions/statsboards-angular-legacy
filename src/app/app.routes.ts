import { Routes } from '@angular/router';
import { SportComponent } from './components/sport/sport.component';
import { PageNotFoundComponent } from './pagenotfound/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { SeasonComponent } from './components/season/season.component';
import { TournamentComponent } from './components/tournament/tournament.component';
import { TeamComponent } from './components/team/team.component';
import { MatchComponent } from './components/match/match.component';
import { breadcrumbResolver } from './resolvers/breadcrumb.resolver';
import { provideState } from '@ngrx/store';
import {
  tournamentFeatureKey,
  tournamentReducer,
} from './components/tournament/store/reducers';
import { provideEffects } from '@ngrx/effects';
import * as createTournamentEffect from './components/tournament/store/effects';
import {
  seasonFeatureKey,
  seasonReducer,
} from './components/season/store/reducers';
import {
  sportFeatureKey,
  sportReducer,
} from './components/sport/store/reducers';
import { SeasonEffects } from './components/season/store/effects';
import { TournamentEffects } from './components/tournament/store/effects';
import { SportEffects } from './components/sport/store/effects';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { breadcrumb: { caption: 'Home', routerLink: '/' } },
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
    path: 'teams',
    component: TeamComponent,
    loadChildren: () =>
      import('./components/team/team.routes').then((r) => r.TEAM_ROUTES),
  },

  {
    path: 'matches',
    component: MatchComponent,
    loadChildren: () =>
      import('./components/match/match.routes').then((r) => r.MATCH_ROUTES),
  },

  { path: 'error404', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
];
