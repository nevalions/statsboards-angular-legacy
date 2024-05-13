import { createSelector } from '@ngrx/store';
import { selectCurrentSportId } from '../../sport/store/reducers';

import { selectCurrentTeam, selectCurrentTeamId } from './reducers';
import {
  selectCurrentTournament,
  selectCurrentTournamentId,
} from '../../tournament/store/reducers';
import { ITeam } from '../../../type/team.type';
import { ITournament } from '../../../type/tournament.type';

// export const selectTeamSportId = createSelector(
//   selectCurrentTeamId,
//   selectCurrentSportId,
//
//   (teamId: number | null | undefined, sportId: number | null | undefined) => ({
//     teamId,
//     sportId,
//   }),
// );

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
