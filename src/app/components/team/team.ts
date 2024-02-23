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
  teamsInTournament$: Observable<ITeam[]>;

  constructor(private store: Store<AppState>) {
    this.team$ = store.select((state) => state.team.currentTeam);
    this.teamsInSport$ = store.select((state) => state.team.allTeamsInSport);
    this.teamsInTournament$ = store.select(
      (state) => state.team.allTeamsInTournament,
    );
  }

  loadCurrentTeam() {
    this.store.dispatch(teamActions.getId());
  }

  loadAllTeamsInSport() {
    this.store.dispatch(teamActions.getTeamsBySportId());
  }

  loadAllTeamsInTournament() {
    this.store.dispatch(teamActions.getTeamsByTournamentId());
  }

  createTeam(team: ITeam) {
    this.store.dispatch(teamActions.create({ request: team }));
  }

  deleteTeam(id: number) {
    this.store.dispatch(teamActions.delete({ id }));
  }
}
