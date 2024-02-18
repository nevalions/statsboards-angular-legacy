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
import { SeasonService } from '../season/season.service';
import { SeasonEffects } from '../season/store/effects';
import { seasonFeatureKey, seasonReducer } from '../season/store/reducers';
import { sportFeatureKey, sportReducer } from './store/reducers';
import { SportEffects } from './store/effects';

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
      provideState(sportFeatureKey, sportReducer),
      provideEffects(
        SeasonEffects,
        TournamentEffects,
        SportEffects,
        // createTournamentEffect,
        // getTournamentsBySportAndSeasonEffect,
      ),
    ],
  },
];
