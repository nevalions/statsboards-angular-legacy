import { Routes } from '@angular/router';
import { TournamentComponent } from './tournament.component';
import { ItemTournamentComponent } from './item-tournament/item-tournament.component';
import { inject } from '@angular/core';
import { provideState } from '@ngrx/store';
import { tournamentFeatureKey, tournamentReducer } from './store/reducers';
import { provideEffects } from '@ngrx/effects';
import * as deleteTournamentEffect from './store/effects';
import * as getTournamentByIdEffect from './store/effects';
import { TournamentEffects } from './store/effects';
// import * as navigateOnTournamentDeletion$ from './store/effects';

export const TOURNAMENT_ROUTES: Routes = [
  { path: '', component: TournamentComponent },
  // {
  //   path: ':tournament_id/season/:season_id',
  //   component: ItemTournamentComponent,
  //   providers: [
  //     provideState(tournamentFeatureKey, tournamentReducer),
  //     provideEffects(TournamentEffects),
  //   ],
  //   data: { breadcrumbs: [{ caption: 'Tournament' }] },
  //   children: [
  //     {
  //       path: 'teams',
  //       redirectTo: '',
  //     },
  //   ],
  // },
];
