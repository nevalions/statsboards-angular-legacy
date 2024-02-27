import { createSelector } from '@ngrx/store';
import { selectCurrentTeamId } from '../../team/store/reducers';
import { selectCurrentTournamentId } from '../../tournament/store/reducers';
import { selectCurrentTeamTournament } from './reducers';

export const selectTeamIdTournamentIdConnectionId = createSelector(
  selectCurrentTeamTournament,
  (connection) => {
    if (connection) {
      return {
        connectionId: connection.id,
        teamId: connection.team_id,
        tournamentId: connection.tournament_id,
      };
    } else {
      return {
        connectionId: null,
        teamId: null,
        tournamentId: null,
      };
    }
  },
);

export const selectTeamIdTournamentId = createSelector(
  selectCurrentTeamId,
  selectCurrentTournamentId,
  (
    teamId: number | null | undefined,
    tournamentId: number | null | undefined,
  ) => ({ teamId, tournamentId }),
);
