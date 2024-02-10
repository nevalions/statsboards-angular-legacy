import { Routes } from '@angular/router';
import { TournamentComponent } from './tournament.component';
import { ItemTournamentComponent } from './item-tournament/item-tournament.component';
import { BreadcrumbGuard } from '../../guard/breadcrumb.guard';
import { inject } from '@angular/core';

export const TOURNAMENT_ROUTES: Routes = [
  { path: '', component: TournamentComponent },
  {
    path: 'id/:id',
    component: ItemTournamentComponent,
    data: { breadcrumbs: [{ caption: 'Tournament' }] },
    children: [
      {
        path: 'teams',
        redirectTo: '',
      },
    ],
  },
];
