import { createSelector } from '@ngrx/store';
import { selectFootballEventsWithPlayers } from './selectors';
import {
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IQBStats,
} from '../../../../type/football-event.type';
import {
  IPlayerInMatchFullData,
  IPlayerInMatchFullDataWithQbStats,
} from '../../../../type/player.type';
import {
  calculatePassAvr,
  calculateQbPassDistanceAndTd,
  calculateQbRating,
  calculateQbRunDistanceAndFumbleAndTd,
  calculateRunAvrQb,
} from '../football-event-stats-calc-helpers';
import { IMatchWithFullData } from '../../../../type/match.type';
import { selectCurrentMatchWithFullData } from '../../../match-with-full-data/store/reducers';
import { selectSelectedFootballQbInMatchId } from '../../../player-match/store/reducers';

export const selectQuarterbackStats = createSelector(
  selectFootballEventsWithPlayers,
  (events: IFootballEventWithPlayers[]): Record<number, IQBStats> => {
    const qbStats: Record<number, IQBStats> = {};

    events.forEach((event) => {
      if (event.event_qb?.match_player.id) {
        const qbId = event.event_qb.match_player.id;
        if (!qbStats[qbId]) {
          qbStats[qbId] = {
            id: qbId,
            passes: 0,
            passes_completed: 0,
            pass_yards: 0,
            pass_td: 0,
            pass_avr: 0,
            run_attempts: 0,
            run_yards: 0,
            run_avr: 0,
            run_td: 0,
            fumble: 0,
            interception: 0,
            qb_rating: 0,
          };
        }

        calculateQbPassDistanceAndTd(event, qbId, qbStats);
        calculateQbRunDistanceAndFumbleAndTd(event, qbId, qbStats);

        if (event.play_result === IFootballPlayResult.PassIntercepted) {
          qbStats[qbId].interception++;
        }

        qbStats[qbId].qb_rating = calculateQbRating(qbStats[qbId]);
        qbStats[qbId].pass_avr = calculatePassAvr(qbStats[qbId]);
        qbStats[qbId].run_avr = calculateRunAvrQb(qbStats[qbId]);
      }
    });

    return qbStats;
  },
);

const selectAllQuarterbacksWithStats = (
  teamIdSelector: (match: IMatchWithFullData) => number | undefined,
) =>
  createSelector(
    selectFootballEventsWithPlayers,
    selectCurrentMatchWithFullData,
    selectQuarterbackStats,
    (events, match, qbStats): IPlayerInMatchFullDataWithQbStats[] => {
      if (!match || !match.id) {
        return [];
      }

      const teamId = teamIdSelector(match);
      if (!teamId) {
        return [];
      }
      // Deduplicate and get all quarterbacks for the team
      const qbs = events
        .filter(
          (event) =>
            event.event_qb &&
            event.offense_team?.id === teamId &&
            event.event_qb.match_player.id,
        )
        .map((event) => event.event_qb!)
        .reduce((uniqueQbs, qb) => {
          if (
            !uniqueQbs.some((q) => q.match_player.id === qb.match_player.id)
          ) {
            uniqueQbs.push(qb);
          }
          return uniqueQbs;
        }, [] as IPlayerInMatchFullData[]);

      // Map to IPlayerInMatchFullDataWithQbStats
      return qbs.map((qb) => ({
        ...qb,
        qb_stats: {
          id: qb.match_player.id!,
          passes: qbStats[qb.match_player.id!]?.passes || 0,
          passes_completed: qbStats[qb.match_player.id!]?.passes_completed || 0,
          pass_yards: qbStats[qb.match_player.id!]?.pass_yards || 0,
          pass_avr: qbStats[qb.match_player.id!]?.pass_avr || 0,
          pass_td: qbStats[qb.match_player.id!]?.pass_td || 0,
          run_attempts: qbStats[qb.match_player.id!]?.run_attempts || 0,
          run_yards: qbStats[qb.match_player.id!]?.run_yards || 0,
          run_td: qbStats[qb.match_player.id!]?.run_td || 0,
          run_avr: qbStats[qb.match_player.id!]?.run_avr || 0,
          fumble: qbStats[qb.match_player.id!]?.fumble || 0,
          interception: qbStats[qb.match_player.id!]?.interception || 0,
          qb_rating: qbStats[qb.match_player.id!]?.qb_rating || 0,
        },
      }));
    },
  );

export const selectAllQuarterbacksWithStatsTeamA =
  selectAllQuarterbacksWithStats(
    (match: IMatchWithFullData) => match.match.team_a_id,
  );

export const selectAllQuarterbacksWithStatsTeamB =
  selectAllQuarterbacksWithStats(
    (match: IMatchWithFullData) => match.match.team_b_id,
  );

export const selectLowerSelectedFootballQbStats = createSelector(
  selectAllQuarterbacksWithStatsTeamA,
  selectAllQuarterbacksWithStatsTeamB,
  selectSelectedFootballQbInMatchId,
  (
    qbsWithStatsHome,
    qbsWithStatsAway,
    selectedQbId,
  ): IPlayerInMatchFullDataWithQbStats | null => {
    // console.log('qbSelectorWithStats HOME', qbsWithStatsHome, selectedQbId);
    const allQbs = [...qbsWithStatsHome, ...qbsWithStatsAway];
    // console.log('all qbs with stats', allQbs, selectedQbId);
    if (selectedQbId && allQbs.length > 0) {
      const qb = allQbs.find((q) => q.match_player.id === selectedQbId);
      if (qb) {
        // console.log('SELECTED qbSelectorWithStats', qb);
        return qb;
      }
    }
    return null;
  },
);
