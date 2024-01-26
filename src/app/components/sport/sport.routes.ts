import {Routes} from "@angular/router";
import {SportComponent} from "./sport.component";
import {ItemSportComponent} from "./item-sport/item-sport.component";
import {WithTeamsComponent} from "./item-sport/with-teams/with-teams.component";

export const SPORT_ROUTES: Routes = [
  { path: '', component: SportComponent },
  {
    path: 'id/:id',
    component: ItemSportComponent,
    children: [
      {
        path: 'teams',
        component: WithTeamsComponent,
      },
    ],
  },
];
