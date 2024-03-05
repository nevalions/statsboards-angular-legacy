import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pagenotfound/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { SeasonComponent } from './components/season/season.component';
import { TournamentComponent } from './components/tournament/tournament.component';
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
import { SeasonEffects } from './components/season/store/effects';
import { TournamentEffects } from './components/tournament/store/effects';
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
import { ItemMatchComponent } from './components/match/item-match/item-match.component';
import {
  matchFeatureKey,
  matchReducer,
} from './components/match/store/reducers';
import { MatchEffects } from './components/match/store/effects';
import { MatchWithFullDataEffects } from './components/match-with-full-data/store/effects';
import {
  matchWithFullDataFeatureKey,
  matchWithFullDataReducer,
} from './components/match-with-full-data/store/reducers';
import { MatchScoreboardAdminComponent } from './components/match-scoreboard-admin/match-scoreboard-admin.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  {
    path: 'home',
    component: HomeComponent,
    data: { breadcrumb: { caption: 'Home' } },
  },
  { path: 'seasons', component: SeasonComponent },
  { path: 'seasons/year/:year', component: SeasonComponent },

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
    data: {
      breadcrumb: {
        caption: 'Teams',
        routerLink: 'sport/:sport_id/teams',
      },
    },
  },
  {
    path: 'sport/:sport_id/season/:season_id/tournaments',
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
    path: 'sport/:sport_id/season/:season_id/tournament/:tournament_id',
    component: ItemTournamentComponent,
    providers: [
      provideState(seasonFeatureKey, seasonReducer),
      provideState(teamFeatureKey, teamReducer),
      provideState(tournamentFeatureKey, tournamentReducer),
      provideState(teamTournamentFeatureKey, teamTournamentReducer),
      provideState(matchFeatureKey, matchReducer),
      provideState(matchWithFullDataFeatureKey, matchWithFullDataReducer),
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
    path: 'sport/:sport_id/season/:season_id/tournament/:tournament_id/team/:team_id',
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
    path: 'sport/:sport_id/season/:season_id/tournament/:tournament_id/match/:match_id',
    component: ItemMatchComponent,
    providers: [
      provideState(seasonFeatureKey, seasonReducer),
      provideState(teamFeatureKey, teamReducer),
      provideState(tournamentFeatureKey, tournamentReducer),
      provideState(teamTournamentFeatureKey, teamTournamentReducer),
      provideState(matchFeatureKey, matchReducer),
      provideState(matchWithFullDataFeatureKey, matchWithFullDataReducer),
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
    path: 'sport/:sport_id/season/:season_id/tournament/:tournament_id/match/:match_id/admin',
    component: MatchScoreboardAdminComponent,
    data: {
      breadcrumb: {
        caption: 'Admin',
      },
    },
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
      },
    },
  },

  { path: 'error404', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
];
// {
//   path: 'matches',
//   component: MatchComponent,
//   loadChildren: () =>
//     import('./components/match/match.routes').then((r) => r.MATCH_ROUTES),
// },
// {
//   path: 'sport',
//   component: SportComponent,
//   loadChildren: () =>
//     import('./components/sport/sport.routes').then((r) => r.SPORT_ROUTES),
// },
