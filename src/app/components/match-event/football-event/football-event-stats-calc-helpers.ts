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

  eventsWithPlayers.forEach((event, index) => {
    if (event.offense_team?.id === teamId) {
      const nextEvent = eventsWithPlayers[index + 1];

      if (event.event_down) {
        if (event.event_down === 3) {
          thirdDownAttempts++;
          if (
            nextEvent &&
            nextEvent.event_down === 1 &&
            nextEvent.offense_team?.id === teamId
          ) {
            thirdDownConversions++;
          }
        } else if (event.event_down === 4) {
          fourthDownAttempts++;
          if (
            nextEvent &&
            nextEvent.event_down === 1 &&
            nextEvent.offense_team?.id === teamId
          ) {
            fourthDownConversions++;
          }
        }

        if (
          event.event_down === 1 &&
          nextEvent &&
          nextEvent.offense_team?.id === teamId
        ) {
          if (!isNewDrive) {
            firstDownGained++;
          }
          isNewDrive = false;
        }

        if (nextEvent && nextEvent.offense_team?.id !== teamId) {
          isNewDrive = true;
        }
      }
    }
  });

  return {
    third_down_attempts: thirdDownAttempts,
    third_down_conversions: thirdDownConversions,
    fourth_down_attempts: fourthDownAttempts,
    fourth_down_conversions: fourthDownConversions,
    first_down_gained: firstDownGained,
  };
}
