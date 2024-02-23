import { createSelector } from '@ngrx/store';
import { selectCurrentTournamentId } from './reducers';
import { selectCurrentSportId } from '../../sport/store/reducers';
import { selectCurrentSeasonId } from '../../season/store/reducers';

export const selectTournamentSportIdSeasonId = createSelector(
  selectCurrentTournamentId,
  selectCurrentSportId,
  selectCurrentSeasonId,
  (
    tournamentId: number | null | undefined,
    sportId: number | null | undefined,
    seasonId: number | null | undefined,
  ) => ({ tournamentId, sportId, seasonId }),
);
