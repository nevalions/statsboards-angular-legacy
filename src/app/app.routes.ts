import { Routes } from '@angular/router';
import { SportComponent } from './components/sport/sport.component';
import { PageNotFoundComponent } from './pagenotfound/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { SeasonComponent } from './components/season/season.component';
import { TournamentComponent } from './components/tournament/tournament.component';
import { TeamComponent } from './components/team/team.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'seasons', component: SeasonComponent },
  { path: 'seasons/year/:year', component: SeasonComponent },
  {
    path: 'sports',
    component: SportComponent,
    loadChildren: () =>
      import('./components/sport/sport.routes').then((r) => r.SPORT_ROUTES),
  },

  {
    path: 'tournaments',
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

  { path: 'error404', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
];
