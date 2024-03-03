import { createSelector } from '@ngrx/store';
import { selectCurrentMatchId } from './reducers';
import { selectCurrentTournamentId } from '../../tournament/store/reducers';
import { selectCurrentSportId } from '../../sport/store/reducers';
import { selectCurrentSeasonId } from '../../season/store/reducers';
import { selectCurrentMatchWithFullData } from '../../match-with-full-data/store/reducers';
import { selectAllTeams } from '../../team/store/reducers';

export const selectMatchIdAndTournamentId = createSelector(
  selectCurrentMatchId,
  selectCurrentTournamentId,
  (matchId, tournamentId) => ({ matchId, tournamentId }),
);

export const selectMatchTournamentSportSeasonId = createSelector(
  selectCurrentMatchId,
  selectCurrentTournamentId,
  selectCurrentSportId,
  selectCurrentSeasonId,
  (
    matchId: number | null | undefined,
    tournamentId: number | null | undefined,
    sportId: number | null | undefined,
    seasonId: number | null | undefined,
  ) => ({ matchId, tournamentId, sportId, seasonId }),
);

export const selectCurrentMatchWithTeams = createSelector(
  selectCurrentMatchWithFullData,
  selectAllTeams,
  (currentMatch, allTeams) => {
    if (!currentMatch || !allTeams) {
      return null;
    }

    return {
      ...currentMatch,
      teams_data: {
        team_a: allTeams.find(
          (team) => team.id === currentMatch.match.team_a_id,
        ),
        team_b: allTeams.find(
          (team) => team.id === currentMatch.match.team_b_id,
        ),
      },
    };
  },
);
