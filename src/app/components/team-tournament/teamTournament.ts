import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/appstate';
import { ITeamTournament } from '../../type/team.type';
import { teamTournamentActions } from './store/actions';
import { selectAllTeamTournament } from './store/reducers';

@Injectable({
  providedIn: 'root',
})
export class TeamTournament {
  private store = inject<Store<AppState>>(Store);

  teamTournamentConnection$: Observable<ITeamTournament | null | undefined>;
  allTeamTournamentsConnections$: Observable<ITeamTournament[]>;

  constructor() {
    const store = this.store;

    this.teamTournamentConnection$ = store.select(
      (state) => state.teamTournament.currentTeamTournament,
    );
    this.allTeamTournamentsConnections$ = store.select(selectAllTeamTournament);
  }

  loadAllTeamTournamentsConnections() {
    this.store.dispatch(teamTournamentActions.getAll());
  }

  createTeamTournamentsConnection(teamTournament: ITeamTournament) {
    this.store.dispatch(
      teamTournamentActions.create({ request: teamTournament }),
    );
  }

  loadConnectionByTeamAndTournamentId(teamId: number, tournamentId: number) {
    this.store.dispatch(
      teamTournamentActions.getConnectionByTeamIdTournamentId({
        teamId: teamId,
        tournamentId: tournamentId,
      }),
    );
  }

  deleteTeamTournamentConnection(teamId: number, tournamentId: number) {
    this.store.dispatch(teamTournamentActions.delete({ teamId, tournamentId }));
  }
}
