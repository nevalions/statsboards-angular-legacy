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
import { SeasonComponent } from '../season/season.component';
import { ItemTournamentComponent } from '../tournament/item-tournament/item-tournament.component';
import { teamActions } from '../team/store/actions';
import { teamFeatureKey, teamReducer } from '../team/store/reducers';
import { TeamEffects } from '../team/store/effects';
import { TeamTournamentEffects } from '../team-tournament/store/effects';
import {
  teamTournamentFeatureKey,
  teamTournamentReducer,
} from '../team-tournament/store/reducers';

export const SPORT_ROUTES: Routes = [
  { path: '', component: SportComponent },
  {
    path: ':sport_id',
    component: ItemSportComponent,
  },
  {
    path: ':sport_id/teams',
    component: WithTeamsComponent,
    providers: [
      provideState(teamFeatureKey, teamReducer),
      provideEffects(TeamEffects),
    ],
  },
  {
    path: ':sport_id/season/:season_id/tournaments',
    component: ItemSportWithSeasonComponent,
    providers: [
      provideState(tournamentFeatureKey, tournamentReducer),
      provideState(seasonFeatureKey, seasonReducer),
      provideEffects(SeasonEffects, TournamentEffects),
    ],
  },
  {
    path: ':sport_id/season/:season_id/tournament/:tournament_id',
    component: ItemTournamentComponent,
    providers: [
      provideState(seasonFeatureKey, seasonReducer),
      provideState(teamFeatureKey, teamReducer),
      provideState(tournamentFeatureKey, tournamentReducer),
      provideState(teamTournamentFeatureKey, teamTournamentReducer),
      provideEffects(
        SeasonEffects,
        TournamentEffects,
        TeamEffects,
        TeamTournamentEffects,
      ),
    ],
  },
];
