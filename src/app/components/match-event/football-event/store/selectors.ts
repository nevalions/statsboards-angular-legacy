import {
  IOffenceStats,
  IPlayerInMatchFullData,
  IPlayerInMatchFullDataWithOffenceStats,
  IPlayerInMatchFullDataWithQbStats,
  IQBStats,
} from '../../../../type/player.type';
import { createSelector } from '@ngrx/store';
import { selectAllMatchFootballEvents } from './reducers';
import { selectAllPlayersInMatchFullData } from '../../../player-match/store/reducers';
import {
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IFootballPlayType,
  IFootballScoreResult,
} from '../../../../type/football-event.type';
import { selectCurrentMatchWithFullData } from '../../../match-with-full-data/store/reducers';
import { computeDistance } from '../football-event-calc-helpers';
import { IMatchWithFullData } from '../../../../type/match.type';

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
const selectOverallDistanceForTeam = (
  teamIdSelector: (match: IMatchWithFullData) => number | undefined,
  playType: IFootballPlayType,
  playResult: IFootballPlayResult,
) =>
  createSelector(
    selectFootballEventsWithPlayers,
    selectCurrentMatchWithFullData,
    (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
      if (!match || !match.id) {
        return 0;
      }
      const teamId = teamIdSelector(match);
      if (!teamId) {
        return 0;
      }

      return eventsWithPlayers.reduce((totalDistance, event) => {
        if (
          event.offense_team?.id === teamId &&
          event.play_type &&
          event.play_result
        ) {
          if (
            event.play_type.value === playType &&
            event.play_result.value === playResult &&
            !event.is_fumble
          ) {
            return totalDistance + (event.distance_moved || 0);
          } else if (
            event.play_type.value === playType &&
            event.play_result.value === playResult &&
            event.is_fumble
          ) {
            // console.log('is fumble', event);
            return totalDistance + (event.distance_on_offence || 0);
          }
        }
        return totalDistance;
      }, 0);
    },
  );

// Selectors for overall run distance
export const selectOverallRunDistanceForTeamA = selectOverallDistanceForTeam(
  (match) => match?.match.team_a_id,
  IFootballPlayType.Run,
  IFootballPlayResult.Run,
);

export const selectOverallRunDistanceForTeamB = selectOverallDistanceForTeam(
  (match) => match?.match.team_b_id,
  IFootballPlayType.Run,
  IFootballPlayResult.Run,
);

// Selectors for overall pass distance
export const selectOverallPassDistanceForTeamA = selectOverallDistanceForTeam(
  (match) => match?.match.team_a_id,
  IFootballPlayType.Pass,
  IFootballPlayResult.PassCompleted,
);

export const selectOverallPassDistanceForTeamB = selectOverallDistanceForTeam(
  (match) => match?.match.team_b_id,
  IFootballPlayType.Pass,
  IFootballPlayResult.PassCompleted,
);

//
// export const selectOverallRunDistanceForTeamA = createSelector(
//   selectFootballEventsWithPlayers,
//   selectCurrentMatchWithFullData,
//   (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
//     const teamId = match?.match.team_a_id;
//     // console.log('teamId', teamId);
//     return eventsWithPlayers.reduce((totalDistance, event) => {
//       // console.log(
//       //   'totalDistance',
//       //   totalDistance,
//       //   event.play_type,
//       //   IFootballPlayType.Run,
//       // );
//       if (event.offense_team?.id === teamId && event.play_type) {
//         if (
//           event.play_type.value === IFootballPlayType.Run &&
//           event.play_result?.value === IFootballPlayResult.Run
//         ) {
//           // console.log(event.play_type, IFootballPlayType.Run);
//           return totalDistance + (event.distance_moved || 0);
//         }
//       }
//       return totalDistance;
//     }, 0);
//   },
// );
//
// export const selectOverallRunDistanceForTeamB = createSelector(
//   selectFootballEventsWithPlayers,
//   selectCurrentMatchWithFullData,
//   (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
//     const teamId = match?.match.team_b_id;
//     return eventsWithPlayers.reduce((totalDistance, event) => {
//       if (event.offense_team?.id === teamId && event.play_type) {
//         if (
//           event.play_type.value === IFootballPlayType.Run &&
//           event.play_result?.value === IFootballPlayResult.Run
//         ) {
//           return totalDistance + (event.distance_moved || 0);
//         }
//       }
//       return totalDistance;
//     }, 0);
//   },
// );
//
// export const selectOverallPassDistanceForTeamA = createSelector(
//   selectFootballEventsWithPlayers,
//   selectCurrentMatchWithFullData,
//   (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
//     const teamId = match?.match.team_a_id;
//     return eventsWithPlayers.reduce((totalDistance, event) => {
//       if (event.offense_team?.id === teamId && event.play_type) {
//         if (
//           event.play_type.value === IFootballPlayType.Pass &&
//           event.play_result?.value === IFootballPlayResult.PassCompleted
//         ) {
//           return totalDistance + (event.distance_moved || 0);
//         }
//       }
//       return totalDistance;
//     }, 0);
//   },
// );
//
// export const selectOverallPassDistanceForTeamB = createSelector(
//   selectFootballEventsWithPlayers,
//   selectCurrentMatchWithFullData,
//   (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
//     const teamId = match?.match.team_b_id;
//     return eventsWithPlayers.reduce((totalDistance, event) => {
//       if (
//         event.offense_team?.id === teamId &&
//         event.play_type &&
//         event.play_result
//       ) {
//         if (
//           event.play_type.value === IFootballPlayType.Pass &&
//           event.play_result?.value === IFootballPlayResult.PassCompleted
//         ) {
//           return totalDistance + (event.distance_moved || 0);
//         }
//       }
//       return totalDistance;
//     }, 0);
//   },
// );

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
export function calculateOverallFlagYards(
  eventsWithPlayers: IFootballEventWithPlayers[],
  teamId: number | undefined,
): number {
  if (!teamId) return 0;

  return eventsWithPlayers.reduce((totalDistance, event) => {
    if (
      event.offense_team?.id === teamId &&
      event.play_result?.value === IFootballPlayResult.Flag
    ) {
      return totalDistance + (event.distance_moved || 0);
    }
    return totalDistance;
  }, 0);
}

export const selectOverallFlagYardsForTeamA = createSelector(
  selectFootballEventsWithPlayers,
  selectCurrentMatchWithFullData,
  (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
    const teamId = match?.match.team_a_id;
    return calculateOverallFlagYards(eventsWithPlayers, teamId);
  },
);

export const selectOverallFlagYardsForTeamB = createSelector(
  selectFootballEventsWithPlayers,
  selectCurrentMatchWithFullData,
  (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
    const teamId = match?.match.team_b_id;
    return calculateOverallFlagYards(eventsWithPlayers, teamId);
  },
);

// export const selectOverallFlagYardsForTeamA = createSelector(
//   selectFootballEventsWithPlayers,
//   selectCurrentMatchWithFullData,
//   (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
//     const teamId = match?.match.team_a_id;
//     return eventsWithPlayers.reduce((totalDistance, event) => {
//       // console.log('teamId', teamId, totalDistance, event.play_result?.value);
//       if (event.offense_team?.id === teamId && event.play_result) {
//         if (event.play_result.value === IFootballPlayResult.Flag) {
//           return totalDistance + (event.distance_moved || 0);
//         }
//       }
//       return totalDistance;
//     }, 0);
//   },
// );
//
// export const selectOverallFlagYardsForTeamB = createSelector(
//   selectFootballEventsWithPlayers,
//   selectCurrentMatchWithFullData,
//   (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
//     const teamId = match?.match.team_b_id;
//     return eventsWithPlayers.reduce((totalDistance, event) => {
//       if (event.offense_team?.id === teamId && event.play_result) {
//         if (event.play_result.value === IFootballPlayResult.Flag) {
//           return totalDistance + (event.distance_moved || 0);
//         }
//       }
//       return totalDistance;
//     }, 0);
//   },
// );

export function calculateQbRunDistanceAndFumbleAndTd(
  event: IFootballEventWithPlayers,
  playerId: number,
  stats: Record<number, IQBStats>,
): void {
  if (
    event.play_type?.value === IFootballPlayType.Run &&
    event.play_result?.value !== IFootballPlayResult.Flag
  ) {
    if (event.run_player?.match_player.id === playerId) {
      stats[playerId].run_attempts++;
      if (!event.is_fumble) {
        if (event.distance_moved) {
          stats[playerId].run_yards += event.distance_moved;
        }
        if (event.score_result?.value === IFootballScoreResult.Td) {
          stats[playerId].run_td++;
        }
      } else {
        stats[playerId].fumble++;
        if (event.distance_on_offence) {
          stats[playerId].run_yards += event.distance_on_offence;
        }
      }
    }
  }
}

export function calculateQbPassDistanceAndTd(
  event: IFootballEventWithPlayers,
  playerId: number,
  stats: Record<number, IQBStats>,
): void {
  if (
    event.play_type?.value === IFootballPlayType.Pass &&
    event.play_result?.value !== IFootballPlayResult.Flag
  ) {
    stats[playerId].passes++;

    if (event.play_result?.value === IFootballPlayResult.PassCompleted) {
      stats[playerId].passes_completed++;
      if (!event.is_fumble) {
        if (event.distance_moved) {
          stats[playerId].pass_yards += event.distance_moved;
        }
        if (event.score_result?.value === IFootballScoreResult.Td) {
          stats[playerId].pass_td++;
        }
      } else {
        if (event.distance_on_offence) {
          stats[playerId].pass_yards += event.distance_on_offence;
        }
      }
    }
  }
}

export function calculateOffenceRunDistanceAndFumbleAndTd(
  event: IFootballEventWithPlayers,
  playerId: number,
  stats: Record<number, IOffenceStats>,
): void {
  if (
    event.play_type?.value === IFootballPlayType.Run &&
    event.play_result?.value !== IFootballPlayResult.Flag
  ) {
    if (event.run_player?.match_player.id === playerId) {
      stats[playerId].run_attempts++;
      if (!event.is_fumble) {
        if (event.distance_moved) {
          stats[playerId].run_yards += event.distance_moved;
        }
        if (event.score_result?.value === IFootballScoreResult.Td) {
          stats[playerId].run_td++;
        }
      } else {
        stats[playerId].fumble++;
        if (event.distance_on_offence) {
          stats[playerId].run_yards += event.distance_on_offence;
        }
      }
    }
  }
}

export function calculateOffencePassDistanceAndFumbleAndTd(
  event: IFootballEventWithPlayers,
  playerId: number,
  stats: Record<number, IOffenceStats>,
): void {
  if (
    event.play_type?.value === IFootballPlayType.Pass &&
    event.play_result?.value !== IFootballPlayResult.Flag
  ) {
    if (
      event.pass_received_player?.match_player.id === playerId &&
      event.play_result?.value === IFootballPlayResult.PassCompleted
    ) {
      stats[playerId].pass_attempts++;
      stats[playerId].pass_received++;
      if (!event.is_fumble) {
        if (event.distance_moved) {
          stats[playerId].pass_yards += event.distance_moved;
        }
        if (event.score_result?.value === IFootballScoreResult.Td) {
          stats[playerId].pass_td++;
        }
      } else {
        stats[playerId].fumble++;
        if (event.distance_on_offence) {
          stats[playerId].pass_yards += event.distance_on_offence;
        }
      }
    } else if (
      event.play_result?.value === IFootballPlayResult.PassIncomplete ||
      event.play_result?.value === IFootballPlayResult.PassDropped ||
      event.play_result?.value === IFootballPlayResult.PassDeflected
    ) {
      stats[playerId].pass_attempts++;
    }
  }
}

//QB
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
            run_attempts: 0,
            run_yards: 0,
            run_td: 0,
            fumble: 0,
            interception: 0,
          };
        }

        // if (
        //   event.play_type?.value === IFootballPlayType.Pass &&
        //   event.play_result?.value !== IFootballPlayResult.Flag
        // ) {
        //   qbStats[qbId].passes++;
        //
        //   if (event.play_result?.value === IFootballPlayResult.PassCompleted) {
        //     qbStats[qbId].passes_completed++;
        //     if (!event.is_fumble) {
        //       if (event.distance_moved) {
        //         qbStats[qbId].pass_yards += event.distance_moved;
        //       }
        //       if (event.score_result?.value === IFootballScoreResult.Td) {
        //         qbStats[qbId].pass_td++;
        //       }
        //     } else {
        //       if (event.distance_on_offence) {
        //         qbStats[qbId].pass_yards += event.distance_on_offence;
        //       }
        //     }
        //   }
        // }

        // Calculate qb run distance
        calculateQbPassDistanceAndTd(event, qbId, qbStats);
        // Calculate qb run distance
        calculateQbRunDistanceAndFumbleAndTd(event, qbId, qbStats);

        // if (
        //   event.play_type?.value === IFootballPlayType.Run &&
        //   event.play_result?.value !== IFootballPlayResult.Flag
        // ) {
        //   if (event.run_player?.match_player.id === qbId) {
        //     // console.log('run player ok', event.run_player, qbStats[qbId]);
        //     qbStats[qbId].run_attempts++;
        //     if (!event.is_fumble) {
        //       if (event.distance_moved) {
        //         qbStats[qbId].run_yards += event.distance_moved;
        //       }
        //     } else {
        //       if (event.distance_on_offence) {
        //         qbStats[qbId].run_yards += event.distance_on_offence;
        //       }
        //     }
        //   }
        // }

        // Process interception
        if (event.play_result?.value === IFootballPlayResult.PassIntercepted) {
          qbStats[qbId].interception++;
        }
        // // Process fumbles
        // if (
        //   event.is_fumble &&
        //   event.event_qb?.match_player.id === qbId &&
        //   event.run_player?.match_player.id === qbId
        // ) {
        //   qbStats[qbId].fumble++;
        // }
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
          pass_td: qbStats[qb.match_player.id!]?.pass_td || 0,
          run_attempts: qbStats[qb.match_player.id!]?.run_attempts || 0,
          run_yards: qbStats[qb.match_player.id!]?.run_yards || 0,
          run_td: qbStats[qb.match_player.id!]?.run_td || 0,
          fumble: qbStats[qb.match_player.id!]?.fumble || 0,
          interception: qbStats[qb.match_player.id!]?.interception || 0,
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

//Offence
export const selectOffenseStats = createSelector(
  selectFootballEventsWithPlayers,
  (events: IFootballEventWithPlayers[]): Record<number, IOffenceStats> => {
    const offenseStats: Record<number, IOffenceStats> = {};

    events.forEach((event) => {
      const playerId =
        event.run_player?.match_player.id ||
        event.pass_received_player?.match_player.id;
      if (playerId) {
        if (!offenseStats[playerId]) {
          offenseStats[playerId] = {
            id: playerId,
            pass_attempts: 0,
            pass_received: 0,
            pass_yards: 0,
            pass_td: 0,
            run_attempts: 0,
            run_yards: 0,
            run_td: 0,
            fumble: 0,
          };
        }

        // // Process passing plays
        // if (
        //   event.play_type?.value === IFootballPlayType.Pass &&
        //   event.play_result?.value !== IFootballPlayResult.Flag
        // ) {
        //   offenseStats[playerId].pass_attempts++;
        //
        //   if (event.play_result?.value === IFootballPlayResult.PassCompleted) {
        //     offenseStats[playerId].pass_received++;
        //     if (event.distance_moved) {
        //       offenseStats[playerId].pass_yards += event.distance_moved;
        //     }
        //   }
        //   if (event.score_result?.value === IFootballScoreResult.Td) {
        //     offenseStats[playerId].pass_td++;
        //   }
        // }

        calculateOffencePassDistanceAndFumbleAndTd(
          event,
          playerId,
          offenseStats,
        );

        // Calculate run distance
        calculateOffenceRunDistanceAndFumbleAndTd(
          event,
          playerId,
          offenseStats,
        );

        // // Process running plays
        // if (
        //   event.play_type?.value === IFootballPlayType.Run &&
        //   event.play_result?.value !== IFootballPlayResult.Flag
        // ) {
        //   if (event.play_result?.value === IFootballPlayResult.Run) {
        //     if (event.run_player?.match_player.id === playerId) {
        //       offenseStats[playerId].run_attempts++;
        //       if (event.distance_moved) {
        //         offenseStats[playerId].run_yards += event.distance_moved;
        //       }
        //       if (event.score_result?.value === IFootballScoreResult.Td) {
        //         offenseStats[playerId].run_td++;
        //       }
        //
        //       // Process fumbles
        //       if (event.is_fumble) {
        //         offenseStats[playerId].fumble++;
        //       }
        //     }
        //   }
        // }
      }
    });

    return offenseStats;
  },
);

const selectAllPlayersWithOffenseStats = (
  teamIdSelector: (match: IMatchWithFullData) => number | undefined,
) =>
  createSelector(
    selectFootballEventsWithPlayers,
    selectCurrentMatchWithFullData,
    selectOffenseStats,
    (events, match, offenseStats): IPlayerInMatchFullDataWithOffenceStats[] => {
      if (!match || !match.id) {
        return [];
      }

      const teamId = teamIdSelector(match);
      if (!teamId) {
        return [];
      }

      // Deduplicate and get all offensive players for the team
      const players = events
        .filter(
          (event) =>
            (event.run_player || event.pass_received_player) &&
            event.offense_team?.id === teamId,
        )
        .map((event) => event.run_player || event.pass_received_player)
        .reduce((uniquePlayers, player) => {
          if (
            !uniquePlayers.some(
              (p) => p.match_player.id === player?.match_player.id,
            )
          ) {
            if (player) {
              uniquePlayers.push(player);
            }
          }
          return uniquePlayers;
        }, [] as IPlayerInMatchFullData[]);

      // Map to IPlayerInMatchFullDataWithOffenceStats
      return players.map((player) => ({
        ...player,
        off_stats: {
          id: player.match_player.id!,
          pass_attempts:
            offenseStats[player.match_player.id!]?.pass_attempts || 0,
          pass_received:
            offenseStats[player.match_player.id!]?.pass_received || 0,
          pass_yards: offenseStats[player.match_player.id!]?.pass_yards || 0,
          pass_td: offenseStats[player.match_player.id!]?.pass_td || 0,
          run_attempts:
            offenseStats[player.match_player.id!]?.run_attempts || 0,
          run_yards: offenseStats[player.match_player.id!]?.run_yards || 0,
          run_td: offenseStats[player.match_player.id!]?.run_td || 0,
          fumble: offenseStats[player.match_player.id!]?.fumble || 0,
        },
      }));
    },
  );

export const selectAllPlayersWithOffenseStatsTeamA =
  selectAllPlayersWithOffenseStats(
    (match: IMatchWithFullData) => match.match.team_a_id,
  );

export const selectAllPlayersWithOffenseStatsTeamB =
  selectAllPlayersWithOffenseStats(
    (match: IMatchWithFullData) => match.match.team_b_id,
  );
