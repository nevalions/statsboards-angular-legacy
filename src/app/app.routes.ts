import { Routes } from '@angular/router';
import {SportComponent} from "./components/sport/sport.component";
import {ItemSportComponent} from "./components/sport/item-sport/item-sport.component";
import {PageNotFoundComponent} from "./pagenotfound/page-not-found.component";
import {AppComponent} from "./app.component";
import {HomeComponent} from "./components/home/home.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sports', component: SportComponent },
  { path: 'sports/id/:id', component: ItemSportComponent },
  { path: 'error404', component: PageNotFoundComponent },

  { path: '**', component: PageNotFoundComponent},
];
