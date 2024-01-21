import { Routes } from '@angular/router';
import {SportComponent} from "./components/sport/sport.component";
import {ItemSportComponent} from "./components/sport/item-sport/item-sport.component";
import {PageNotFoundComponent} from "./pagenotfound/page-not-found.component";
import {HomeComponent} from "./components/home/home.component";
import {SeasonComponent} from "./components/season/season.component";
import {ItemSportWithSeasonComponent} from "./components/sport/item-sport/item-sport-with-season/item-sport-with-season.component";
import {TournamentComponent} from "./components/tournament/tournament.component";
import {ItemTournamentComponent} from "./components/tournament/item-tournament/item-tournament.component";
import {WithTeamsComponent} from "./components/sport/item-sport/with-teams/with-teams.component";
import {TeamComponent} from "./components/team/team.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'seasons', component: SeasonComponent},
  { path: 'seasons/year/:year' , component: SeasonComponent },
  { path: 'seasons/year/:year/sports/id/:id/tournaments', component: ItemSportWithSeasonComponent},
  { path: 'sports', component: SportComponent },
  {
    path: 'sports/id/:id',
    component: ItemSportComponent,
    children: [
      {
        path: 'teams',
        component: WithTeamsComponent,
      },
    ],
  },
  { path: 'tournaments', component: TournamentComponent },
  {
    path: 'tournaments/id/:id',
    component: ItemTournamentComponent,
    children: [
      {
        path: 'teams',
        redirectTo: '',
      }
    ]
  }
  ,
  { path: 'teams', component: TeamComponent },
  { path: 'teams/id/:id', redirectTo: '' },

  { path: 'error404', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent},
];
