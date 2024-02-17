import { Routes } from '@angular/router';
import { SportComponent } from './sport.component';
import { ItemSportComponent } from './item-sport/item-sport.component';
import { WithTeamsComponent } from './item-sport/with-teams/with-teams.component';
import { ItemSportWithSeasonComponent } from './item-sport/item-sport-with-season/item-sport-with-season.component';
import { provideState } from '@ngrx/store';
import {
  tournamentFeatureKey,
  tournamentReducer,
} from '../tournament/store/reducers';
import { provideEffects } from '@ngrx/effects';
import * as createTournamentEffect from '../tournament/store/effects';
import * as getTournamentsBySportAndSeasonEffect from '../tournament/store/effects';
import { TournamentEffects } from '../tournament/store/effects';
import { SeasonService } from '../../services/season.service';
import { SeasonEffects } from '../season/store/effects';
import { seasonFeatureKey, seasonReducer } from '../season/store/reducers';

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
  {
    path: 'id/:id/seasons/:year/tournaments',
    component: ItemSportWithSeasonComponent,
    providers: [
      provideState(tournamentFeatureKey, tournamentReducer),
      provideState(seasonFeatureKey, seasonReducer),
      provideEffects(
        SeasonEffects,
        TournamentEffects,
        // createTournamentEffect,
        // getTournamentsBySportAndSeasonEffect,
      ),
    ],
  },
];
