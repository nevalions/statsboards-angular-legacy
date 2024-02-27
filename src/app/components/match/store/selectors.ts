import { createSelector } from '@ngrx/store';
import { selectCurrentMatchId } from './reducers';
import { selectCurrentTournamentId } from '../../tournament/store/reducers';

export const selectMatchIdAndTournamentId = createSelector(
  selectCurrentMatchId,
  selectCurrentTournamentId,
  (matchId, tournamentId) => ({ matchId, tournamentId }),
);
