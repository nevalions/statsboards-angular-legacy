import { Routes } from '@angular/router';
import {SportComponent} from "./components/sport/sport.component";
import {ItemSportComponent} from "./components/sport/item-sport/item-sport.component";
import {PageNotFoundComponent} from "./pagenotfound/page-not-found.component";
import {HomeComponent} from "./components/home/home.component";
import {SeasonComponent} from "./components/season/season.component";
import {
  ItemSportWithSeasonComponent
} from "./components/sport/item-sport/item-sport-with-season/item-sport-with-season.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'seasons', component: SeasonComponent},
  { path: 'seasons/year/:year' , component: SeasonComponent },
  { path: 'seasons/year/:year/sports/id/:id/tournaments', component: ItemSportWithSeasonComponent },
  { path: 'sports', component: SportComponent },
  { path: 'sports/id/:id', component: ItemSportComponent },
  { path: 'error404', component: PageNotFoundComponent },

  { path: '**', component: PageNotFoundComponent},
];
