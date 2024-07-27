import {
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IFootballPlayType,
  IFootballScoreResult,
  IOffenceStats,
  IQBStats,
} from '../../../type/football-event.type';

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
