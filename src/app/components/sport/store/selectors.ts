import { createSelector } from '@ngrx/store';
import { selectCurrentSportId } from './reducers';
import { selectCurrentSeasonId } from '../../season/store/reducers';

export const selectSportIdAndSeasonId = createSelector(
  selectCurrentSportId,
  selectCurrentSeasonId,
  (sportId, seasonId) => ({ sportId, seasonId }),
);
