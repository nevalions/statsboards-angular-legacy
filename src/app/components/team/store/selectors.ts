import { createSelector } from '@ngrx/store';
import { selectCurrentSportId } from '../../sport/store/reducers';

import { selectCurrentTeamId } from './reducers';

export const selectTeamSportId = createSelector(
  selectCurrentTeamId,
  selectCurrentSportId,

  (teamId: number | null | undefined, sportId: number | null | undefined) => ({
    teamId,
    sportId,
  }),
);
