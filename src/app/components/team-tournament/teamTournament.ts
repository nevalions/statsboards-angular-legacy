import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/appstate';
import { ITeamTournament } from '../../type/team.type';
import { teamTournamentActions } from './store/actions';

@Injectable({
  providedIn: 'root',
})
export class TeamTournament {
  teamTournamentConnection$: Observable<ITeamTournament | null | undefined>;
  allTeamTournamentsConnections$: Observable<ITeamTournament[]>;

  constructor(private store: Store<AppState>) {
    this.teamTournamentConnection$ = store.select(
      (state) => state.teamTournament.currentTeamTournament,
    );
    this.allTeamTournamentsConnections$ = store.select(
      (state) => state.teamTournament.allTeamTournament,
    );
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

  deleteTeamTournamentConnection() {
    this.store.dispatch(teamTournamentActions.delete());
  }
}
