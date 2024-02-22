import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/appstate';
import { ITeam } from '../../type/team.type';
import { teamActions } from './store/actions';

@Injectable({
  providedIn: 'root',
})
export class Team {
  team$: Observable<ITeam | null | undefined>;
  teamsInSport$: Observable<ITeam[]>;

  constructor(private store: Store<AppState>) {
    this.team$ = store.select((state) => state.team.currentTeam);
    this.teamsInSport$ = store.select((state) => state.team.allTeamsInSport);
  }

  loadCurrentTeam(id: number) {
    this.store.dispatch(teamActions.get({ id }));
  }

  loadAllTeamsInSport() {
    this.store.dispatch(teamActions.getTeamsBySportId());
  }

  createTeam(team: ITeam) {
    this.store.dispatch(teamActions.create({ request: team }));
  }
}
