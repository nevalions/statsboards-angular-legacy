import { Routes } from '@angular/router';
import { TournamentComponent } from './tournament.component';
import { ItemTournamentComponent } from './item-tournament/item-tournament.component';

export const TOURNAMENT_ROUTES: Routes = [
  { path: '', component: TournamentComponent },
  {
    path: 'id/:id',
    component: ItemTournamentComponent,
    children: [
      {
        path: 'teams',
        redirectTo: '',
      },
    ],
  },
];
