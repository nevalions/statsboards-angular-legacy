import { createSelector } from '@ngrx/store';
import { selectCurrentSportId } from '../../sport/store/reducers';

import { selectCurrentTeamId } from './reducers';
import { selectCurrentTournamentId } from '../../tournament/store/reducers';

export const selectTeamSportId = createSelector(
  selectCurrentTeamId,
  selectCurrentSportId,

  (teamId: number | null | undefined, sportId: number | null | undefined) => ({
    teamId,
    sportId,
  }),
);

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
