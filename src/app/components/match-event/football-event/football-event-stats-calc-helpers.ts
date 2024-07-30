import {
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IFootballPlayType,
  IFootballScoreResult,
  IOffenceStats,
  IQBStats,
  ITeamFootballMatchStats,
} from '../../../type/football-event.type';

export function calculateQbRunDistanceAndFumbleAndTd(
  event: IFootballEventWithPlayers,
  playerId: number,
  stats: Record<number, IQBStats>,
): void {
  if (
    event.play_type === IFootballPlayType.Run &&
    event.play_result !== IFootballPlayResult.Flag
  ) {
    if (event.run_player?.match_player.id === playerId) {
      stats[playerId].run_attempts++;
      if (!event.is_fumble) {
        if (event.distance_moved) {
          stats[playerId].run_yards += event.distance_moved;
        }
        if (event.score_result === IFootballScoreResult.Td) {
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
    event.play_type === IFootballPlayType.Pass &&
    event.play_result !== IFootballPlayResult.Flag
  ) {
    stats[playerId].passes++;

    if (event.play_result === IFootballPlayResult.PassCompleted) {
      stats[playerId].passes_completed++;
      if (!event.is_fumble) {
        if (event.distance_moved) {
          stats[playerId].pass_yards += event.distance_moved;
        }
        if (event.score_result === IFootballScoreResult.Td) {
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

export function calculateQbRating(stats: IQBStats): number {
  const { passes, pass_yards, pass_td, passes_completed, interception } = stats;
  if (passes === 0) {
    return 0;
  }
  const qbRating =
    (8.4 * pass_yards +
      330 * pass_td +
      100 * passes_completed -
      200 * interception) /
    passes;
  return parseFloat(qbRating.toFixed(2));
}

export function calculatePassAvr(stats: IQBStats): number {
  const { passes, passes_completed } = stats;
  if (passes === 0) {
    return 0;
  }
  const passAvr = (passes_completed / passes) * 100;
  return parseFloat(passAvr.toFixed(2));
}

export function calculateRunAvrQb(stats: IQBStats): number {
  const { run_yards, run_attempts } = stats;
  if (run_attempts === 0) {
    return 0;
  }
  const runPerAtt = run_yards / run_attempts;
  return parseFloat(runPerAtt.toFixed(2));
}

export function calculateFootballOffenceRunDistanceAndFumbleAndTd(
  event: IFootballEventWithPlayers,
  playerId: number,
  stats: Record<number, IOffenceStats>,
): void {
  if (
    event.play_type === IFootballPlayType.Run &&
    event.play_result !== IFootballPlayResult.Flag
  ) {
    if (event.run_player?.match_player.id === playerId) {
      stats[playerId].run_attempts++;
      if (!event.is_fumble) {
        if (event.distance_moved) {
          stats[playerId].run_yards += event.distance_moved;
        }
        if (event.score_result === IFootballScoreResult.Td) {
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

export function calculateRunAvrOffence(stats: IOffenceStats): number {
  const { run_yards, run_attempts } = stats;
  if (run_attempts === 0) {
    return 0;
  }
  const runPerAtt = run_yards / run_attempts;
  return parseFloat(runPerAtt.toFixed(2));
}

export function calculateFootballOffencePassDistanceAndFumbleAndTd(
  event: IFootballEventWithPlayers,
  playerId: number,
  stats: Record<number, IOffenceStats>,
): void {
  if (
    event.play_type === IFootballPlayType.Pass &&
    event.play_result !== IFootballPlayResult.Flag
  ) {
    if (
      event.pass_received_player?.match_player.id === playerId &&
      event.play_result === IFootballPlayResult.PassCompleted
    ) {
      stats[playerId].pass_attempts++;
      stats[playerId].pass_received++;
      if (!event.is_fumble) {
        if (event.distance_moved) {
          stats[playerId].pass_yards += event.distance_moved;
        }
        if (event.score_result === IFootballScoreResult.Td) {
          stats[playerId].pass_td++;
        }
      } else {
        stats[playerId].fumble++;
        if (event.distance_on_offence) {
          stats[playerId].pass_yards += event.distance_on_offence;
        }
      }
    } else if (
      event.play_result === IFootballPlayResult.PassIncomplete ||
      event.play_result === IFootballPlayResult.PassDropped ||
      event.play_result === IFootballPlayResult.PassDeflected
    ) {
      stats[playerId].pass_attempts++;
    }
  }
}

export function calculateFootballDownStats(
  eventsWithPlayers: IFootballEventWithPlayers[],
  teamId: number | undefined,
): Partial<ITeamFootballMatchStats> {
  if (!teamId) return {};

  let thirdDownAttempts = 0;
  let thirdDownConversions = 0;
  let fourthDownAttempts = 0;
  let fourthDownConversions = 0;
  let firstDownGained = 0;
  let isNewDrive = true;

  for (let i = 0; i < eventsWithPlayers.length; i++) {
    const event = eventsWithPlayers[i];
    const prevEvent = eventsWithPlayers[i - 1];

    if (event.offense_team?.id === teamId) {
      if (prevEvent && prevEvent.offense_team?.id === teamId) {
        if (prevEvent.event_down) {
          if (prevEvent.event_down === 3) {
            thirdDownAttempts++;
            if (event.event_down === 1) {
              thirdDownConversions++;
            }
          } else if (prevEvent.event_down === 4) {
            fourthDownAttempts++;
            if (event.event_down === 1) {
              fourthDownConversions++;
            }
          }
        }
      }

      if (event.event_down === 1) {
        if (!isNewDrive) {
          firstDownGained++;
        }
        isNewDrive = false;
      }

      if (prevEvent && prevEvent.offense_team?.id !== teamId) {
        isNewDrive = true;
      }
    }
  }

  return {
    third_down_attempts: thirdDownAttempts,
    third_down_conversions: thirdDownConversions,
    fourth_down_attempts: fourthDownAttempts,
    fourth_down_conversions: fourthDownConversions,
    first_down_gained: firstDownGained,
  };
}
