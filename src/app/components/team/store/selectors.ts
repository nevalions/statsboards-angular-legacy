import { createSelector } from '@ngrx/store';

import {
  selectAllTeamsInSport,
  selectAllTeamsInTournament,
  selectCurrentTeam,
  selectCurrentTeamId,
} from './reducers';
import {
  selectCurrentTournament,
  selectCurrentTournamentId,
} from '../../tournament/store/reducers';
import { ITeam } from '../../../type/team.type';
import { ITournament } from '../../../type/tournament.type';

export const selectTeamTournamentId = createSelector(
  selectCurrentTeamId,
  selectCurrentTournamentId,

  (
    teamId: number | null | undefined,
    tournamentId: number | null | undefined,
  ) => ({
    teamId,
    tournamentId,
  }),
);

export const selectCurrentTeamAndTournament = createSelector(
  selectCurrentTeam,
  selectCurrentTournament,
  (
    team: ITeam | null | undefined,
    tournament: ITournament | null | undefined,
  ) => ({
    team,
    tournament,
  }),
);

export const selectAvailableTeamsToAddToTournament = createSelector(
  selectAllTeamsInTournament,
  selectAllTeamsInSport,
  (teamsInTournament: ITeam[] | null, teamsInSport: ITeam[] | null) => {
    if (!teamsInTournament?.length && teamsInSport?.length) {
      return teamsInSport;
    }
    if (teamsInTournament?.length && teamsInSport?.length) {
      const teamInTournamentIds = teamsInTournament.map((team) => team.id);
      return teamsInSport.filter(
        (team) => !teamInTournamentIds.includes(team.id),
      );
    }
    return [];
  },
);
