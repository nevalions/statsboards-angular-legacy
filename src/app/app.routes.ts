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
import { ItemTeamComponent } from './components/team/item-team/item-team.component';
import { teamFeatureKey, teamReducer } from './components/team/store/reducers';
import { TeamEffects } from './components/team/store/effects';
import { ItemSportComponent } from './components/sport/item-sport/item-sport.component';
import { WithTeamsComponent } from './components/sport/item-sport/with-teams/with-teams.component';
import { ItemSportWithSeasonComponent } from './components/sport/item-sport/item-sport-with-season/item-sport-with-season.component';
import { ItemTournamentComponent } from './components/tournament/item-tournament/item-tournament.component';
import {
  teamTournamentFeatureKey,
  teamTournamentReducer,
} from './components/team-tournament/store/reducers';
import { TeamTournamentEffects } from './components/team-tournament/store/effects';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { breadcrumb: { caption: 'Home', routerLink: '/' } },
  },
  { path: 'seasons', component: SeasonComponent },
  { path: 'seasons/year/:year', component: SeasonComponent },
  // {
  //   path: 'sport',
  //   component: SportComponent,
  //   loadChildren: () =>
  //     import('./components/sport/sport.routes').then((r) => r.SPORT_ROUTES),
  // },

  {
    path: 'sport/:sport_id',
    component: ItemSportComponent,
  },
  {
    path: 'sport/:sport_id/teams',
    component: WithTeamsComponent,
    providers: [
      provideState(teamFeatureKey, teamReducer),
      provideEffects(TeamEffects),
    ],
  },
  {
    path: 'sport/:sport_id/season/:season_id/tournaments',
    component: ItemSportWithSeasonComponent,
    providers: [
      provideState(tournamentFeatureKey, tournamentReducer),
      provideState(seasonFeatureKey, seasonReducer),
      provideEffects(SeasonEffects, TournamentEffects),
    ],
  },
  {
    path: 'sport/:sport_id/season/:season_id/tournament/:tournament_id',
    component: ItemTournamentComponent,
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
  },

  {
    path: 'tournament',
    component: TournamentComponent,
    loadChildren: () =>
      import('./components/tournament/tournament.routes').then(
        (r) => r.TOURNAMENT_ROUTES,
      ),
  },

  // {
  //   path: 'teams',
  //   component: TeamComponent,
  //   loadChildren: () =>
  //     import('./components/team/team.routes').then((r) => r.TEAM_ROUTES),
  // },

  {
    path: 'team/:team_id',
    component: ItemTeamComponent,
    providers: [
      provideState(teamFeatureKey, teamReducer),
      provideEffects(TeamEffects),
    ],
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
