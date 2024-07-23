import {
  IPlayerInMatchFullData,
  IPlayerInMatchFullDataWithQbStats,
} from '../../../../type/player.type';
import { createSelector } from '@ngrx/store';
import { selectAllMatchFootballEvents } from './reducers';
import { selectAllPlayersInMatchFullData } from '../../../player-match/store/reducers';
import {
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IFootballPlayType,
} from '../../../../type/football-event.type';
import { selectCurrentMatchWithFullData } from '../../../match-with-full-data/store/reducers';
import { computeDistance } from '../football-event-calc-helpers';

export function getMatchPlayerById(
  players: IPlayerInMatchFullData[],
  playerId: number | null | undefined,
): IPlayerInMatchFullData | null {
  if (playerId === null || playerId === undefined) {
    return null;
  }
  return players.find((player) => player.match_player.id === playerId) || null;
}

export const selectFootballEventsWithPlayers = createSelector(
  selectAllMatchFootballEvents,
  selectAllPlayersInMatchFullData,
  selectCurrentMatchWithFullData,
  (footballEvents, matchPlayers, match): IFootballEventWithPlayers[] => {
    const teamA = match?.teams_data?.team_a || null;
    const teamB = match?.teams_data?.team_b || null;
    const fieldLength = match?.match_data?.field_length || 100;

    return footballEvents.map((event, index) => {
      const nextEvent = footballEvents[index + 1];

      let distanceMoved: number | null = null;

      if (
        nextEvent &&
        nextEvent.ball_on !== undefined &&
        event.ball_on !== undefined &&
        nextEvent.ball_on !== null &&
        event.ball_on !== null
      ) {
        distanceMoved = computeDistance(
          nextEvent.ball_on,
          event.ball_on,
          fieldLength / 2,
        );
      }

      return {
        ...event,
        distance_moved: distanceMoved,
        offense_team:
          event.offense_team === teamA?.id
            ? teamA
            : event.offense_team === teamB?.id
              ? teamB
              : null,
        event_qb: getMatchPlayerById(matchPlayers, event.event_qb),
        run_player: getMatchPlayerById(matchPlayers, event.run_player),
        pass_received_player: getMatchPlayerById(
          matchPlayers,
          event.pass_received_player,
        ),
        pass_dropped_player: getMatchPlayerById(
          matchPlayers,
          event.pass_dropped_player,
        ),
        pass_deflected_player: getMatchPlayerById(
          matchPlayers,
          event.pass_deflected_player,
        ),
        pass_intercepted_player: getMatchPlayerById(
          matchPlayers,
          event.pass_intercepted_player,
        ),
        fumble_player: getMatchPlayerById(matchPlayers, event.fumble_player),
        fumble_recovered_player: getMatchPlayerById(
          matchPlayers,
          event.fumble_recovered_player,
        ),
        tackle_player: getMatchPlayerById(matchPlayers, event.tackle_player),
        assist_tackle_player: getMatchPlayerById(
          matchPlayers,
          event.assist_tackle_player,
        ),
        sack_player: getMatchPlayerById(matchPlayers, event.sack_player),
        score_player: getMatchPlayerById(matchPlayers, event.score_player),
        defence_score_player: getMatchPlayerById(
          matchPlayers,
          event.defence_score_player,
        ),
        kick_player: getMatchPlayerById(matchPlayers, event.kick_player),
        kickoff_player: getMatchPlayerById(matchPlayers, event.kickoff_player),
        return_player: getMatchPlayerById(matchPlayers, event.return_player),
        pat_one_player: getMatchPlayerById(matchPlayers, event.pat_one_player),
        flagged_player: getMatchPlayerById(matchPlayers, event.flagged_player),
        punt_player: getMatchPlayerById(matchPlayers, event.punt_player),
        event_hash: event.event_hash
          ? { value: event.event_hash.toLowerCase() }
          : null,
        play_direction: event.play_direction
          ? { value: event.play_direction.toLowerCase() }
          : null,
        play_type: event.play_type
          ? { value: event.play_type.toLowerCase() }
          : null,
        play_result: event.play_result
          ? { value: event.play_result.toLowerCase() }
          : null,
        score_result: event.score_result
          ? { value: event.score_result.toLowerCase() }
          : null,
      } as IFootballEventWithPlayers;
    });
  },
);

// STATS OFFENCE

export const selectOverallRunDistanceForTeamA = createSelector(
  selectFootballEventsWithPlayers,
  selectCurrentMatchWithFullData,
  (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
    const teamId = match?.match.team_a_id;
    // console.log('teamId', teamId);
    return eventsWithPlayers.reduce((totalDistance, event) => {
      // console.log(
      //   'totalDistance',
      //   totalDistance,
      //   event.play_type,
      //   IFootballPlayType.Run,
      // );
      if (event.offense_team?.id === teamId && event.play_type) {
        if (
          event.play_type.value === IFootballPlayType.Run &&
          event.play_result?.value === IFootballPlayResult.Run
        ) {
          // console.log(event.play_type, IFootballPlayType.Run);
          return totalDistance + (event.distance_moved || 0);
        }
      }
      return totalDistance;
    }, 0);
  },
);

export const selectOverallRunDistanceForTeamB = createSelector(
  selectFootballEventsWithPlayers,
  selectCurrentMatchWithFullData,
  (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
    const teamId = match?.match.team_b_id;
    return eventsWithPlayers.reduce((totalDistance, event) => {
      if (event.offense_team?.id === teamId && event.play_type) {
        if (
          event.play_type.value === IFootballPlayType.Run &&
          event.play_result?.value === IFootballPlayResult.Run
        ) {
          return totalDistance + (event.distance_moved || 0);
        }
      }
      return totalDistance;
    }, 0);
  },
);

export const selectOverallPassDistanceForTeamA = createSelector(
  selectFootballEventsWithPlayers,
  selectCurrentMatchWithFullData,
  (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
    const teamId = match?.match.team_a_id;
    return eventsWithPlayers.reduce((totalDistance, event) => {
      if (event.offense_team?.id === teamId && event.play_type) {
        if (
          event.play_type.value === IFootballPlayType.Pass &&
          event.play_result?.value === IFootballPlayResult.PassCompleted
        ) {
          return totalDistance + (event.distance_moved || 0);
        }
      }
      return totalDistance;
    }, 0);
  },
);

export const selectOverallPassDistanceForTeamB = createSelector(
  selectFootballEventsWithPlayers,
  selectCurrentMatchWithFullData,
  (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
    const teamId = match?.match.team_b_id;
    return eventsWithPlayers.reduce((totalDistance, event) => {
      if (
        event.offense_team?.id === teamId &&
        event.play_type &&
        event.play_result
      ) {
        if (
          event.play_type.value === IFootballPlayType.Pass &&
          event.play_result?.value === IFootballPlayResult.PassCompleted
        ) {
          return totalDistance + (event.distance_moved || 0);
        }
      }
      return totalDistance;
    }, 0);
  },
);

export const selectOverallOffenceDistanceForTeamA = createSelector(
  selectOverallRunDistanceForTeamA,
  selectOverallPassDistanceForTeamA,
  (runYards, passYards): number => {
    return runYards + passYards;
  },
);

export const selectOverallOffenceDistanceForTeamB = createSelector(
  selectOverallRunDistanceForTeamB,
  selectOverallPassDistanceForTeamB,
  (runYards, passYards): number => {
    return runYards + passYards;
  },
);

// FLAGS
export const selectOverallFlagYardsForTeamA = createSelector(
  selectFootballEventsWithPlayers,
  selectCurrentMatchWithFullData,
  (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
    const teamId = match?.match.team_a_id;
    return eventsWithPlayers.reduce((totalDistance, event) => {
      // console.log('teamId', teamId, totalDistance, event.play_result?.value);
      if (event.offense_team?.id === teamId && event.play_result) {
        if (event.play_result.value === IFootballPlayResult.Flag) {
          return totalDistance + (event.distance_moved || 0);
        }
      }
      return totalDistance;
    }, 0);
  },
);

export const selectOverallFlagYardsForTeamB = createSelector(
  selectFootballEventsWithPlayers,
  selectCurrentMatchWithFullData,
  (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
    const teamId = match?.match.team_b_id;
    return eventsWithPlayers.reduce((totalDistance, event) => {
      if (event.offense_team?.id === teamId && event.play_result) {
        if (event.play_result.value === IFootballPlayResult.Flag) {
          return totalDistance + (event.distance_moved || 0);
        }
      }
      return totalDistance;
    }, 0);
  },
);

// QB
// export const selectAllQuarterbacksTeamA = createSelector(
//   selectFootballEventsWithPlayers,
//   selectCurrentMatchWithFullData,
//   (events, match) => {
//     const teamId = match?.match.team_a_id;
//     if (!teamId) {
//       return [];
//     }
//     if (events && events.length > 0) {
//       const qbIds = events
//         .filter(
//           (event) =>
//             event.event_qb &&
//             event.event_qb.match_player.id &&
//             event.offense_team?.id === teamId,
//         )
//         .map((event) => event.event_qb!.match_player.id);
//
//       // Deduplicate QB IDs
//       const uniqueQbIds = Array.from(new Set(qbIds));
//
//       // Assuming you have a selector to get all players, you can filter them
//       // by the unique QB IDs to get the details
//       return events
//         .flatMap((event) => (event.event_qb ? [event.event_qb] : []))
//         .filter(
//           (qb, index, self) =>
//             uniqueQbIds.includes(qb.match_player.id!) &&
//             self.findIndex((q) => q.match_player.id === qb.match_player.id) ===
//               index,
//         );
//     } else {
//       return [];
//     }
//   },
// );

export const selectPassesPerQuarterback = createSelector(
  selectFootballEventsWithPlayers,
  (
    events: IFootballEventWithPlayers[],
  ): Record<
    number,
    {
      passes: number;
      passes_completed: number;
      pass_yards: number;
      run_attempts: number;
      run_yards: number;
    }
  > => {
    // Create an object to store the count of passes and completed passes per quarterback
    const qbStats: Record<
      number,
      {
        passes: number;
        passes_completed: number;
        pass_yards: number;
        run_attempts: number;
        run_yards: number;
      }
    > = {};

    events.forEach((event) => {
      if (
        // event.play_type?.value === IFootballPlayType.Pass &&
        event.event_qb?.match_player.id
      ) {
        const qbId = event.event_qb.match_player.id;
        if (!qbStats[qbId]) {
          qbStats[qbId] = {
            passes: 0,
            passes_completed: 0,
            pass_yards: 0,
            run_attempts: 0,
            run_yards: 0,
          };
        }

        if (
          event.play_type?.value === IFootballPlayType.Pass &&
          event.play_result?.value !== IFootballPlayResult.Flag
        ) {
          // Increment the total pass count for the quarterback
          qbStats[qbId].passes++;

          // Increment the completed pass count if the pass was completed
          if (event.play_result?.value === IFootballPlayResult.PassCompleted) {
            qbStats[qbId].passes_completed++;
            if (event.distance_moved) {
              qbStats[qbId].pass_yards += event.distance_moved;
            }
          }
        }

        if (
          event.play_type?.value === IFootballPlayType.Run &&
          event.play_result?.value !== IFootballPlayResult.Flag
        ) {
          if (event.run_player?.match_player.id === qbId) {
            // console.log('run player ok', event.run_player, qbStats[qbId]);
            qbStats[qbId].run_attempts++;
            if (event.distance_moved) {
              qbStats[qbId].run_yards += event.distance_moved;
            }
          }
        }
      }
    });

    return qbStats;
  },
);

// Selector to get all quarterbacks for team A and include their stats
export const selectAllQuarterbacksWithStatsTeamA = createSelector(
  selectFootballEventsWithPlayers,
  selectCurrentMatchWithFullData,
  selectPassesPerQuarterback,
  (events, match, qbStats): IPlayerInMatchFullDataWithQbStats[] => {
    const teamId = match?.match.team_a_id;
    if (!teamId) {
      return [];
    }

    // Deduplicate and get all quarterbacks for team A
    const qbs = events
      .filter(
        (event) =>
          event.event_qb &&
          event.offense_team?.id === teamId &&
          event.event_qb.match_player.id,
      )
      .map((event) => event.event_qb!)
      .reduce((uniqueQbs, qb) => {
        if (!uniqueQbs.some((q) => q.match_player.id === qb.match_player.id)) {
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
        run_attempts: qbStats[qb.match_player.id!]?.run_attempts || 0,
        run_yards: qbStats[qb.match_player.id!]?.run_yards || 0,
      },
    }));
  },
);
