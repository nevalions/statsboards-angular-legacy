import {
  IEventHash,
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IFootballPlayType,
  IFootballScoreResult,
} from '../../../type/football-event.type';
import { ITeam } from '../../../type/team.type';
import { IPlayerInMatchFullData } from '../../../type/player.type';
import { IMatchWithFullData } from '../../../type/match.type';
import { computeDistanceForDownDistance } from './football-event-calc-helpers';

export function determineNewEventNumber(
  lastEvent: IFootballEventWithPlayers | null | undefined,
): number | null {
  return lastEvent?.event_number ? lastEvent.event_number + 1 : 1;
}

export function determineNewEventQtr(
  lastEvent: IFootballEventWithPlayers | null | undefined,
): number | null {
  return lastEvent?.event_qtr ?? 1;
}

export function determineNewEventTeam(
  lastEvent: IFootballEventWithPlayers | null | undefined,
): ITeam | null {
  return lastEvent?.offense_team ?? null;
}

export function determineNewEventQb(
  lastEvent: IFootballEventWithPlayers | null | undefined,
): IPlayerInMatchFullData | null {
  return lastEvent?.event_qb ?? null;
}

export function determineNewEventDown(
  lastEvent: IFootballEventWithPlayers | null | undefined,
): number | null {
  if (!lastEvent?.event_down) return null;
  if (lastEvent.play_result === IFootballPlayResult.Flag)
    return lastEvent.event_down;
  return lastEvent.event_down < 4
    ? lastEvent.event_down + 1
    : lastEvent.event_down;
}

export function determineNewEventPlayType(
  lastEvent: IFootballEventWithPlayers | null | undefined,
): IFootballPlayType | null {
  return lastEvent ? null : IFootballPlayType.Kickoff;
}

export function determineNewEventBallOn(
  lastEvent: IFootballEventWithPlayers | null | undefined,
): number | null {
  if (
    lastEvent &&
    lastEvent.ball_moved_to &&
    lastEvent.play_result !== IFootballPlayResult.PassIntercepted &&
    !lastEvent.is_fumble
  ) {
    return lastEvent.ball_moved_to;
  }
  return null;
}

export function computeCompDistance(
  lastEvent: IFootballEventWithPlayers | null | undefined,
  match: IMatchWithFullData | undefined | null,
): number | null {
  if (
    !lastEvent ||
    !match ||
    !match.match_data ||
    !match.match_data.field_length
  )
    return null;

  const { ball_on, ball_moved_to, event_distance } = lastEvent;
  const fieldLength = match.match_data.field_length / 2;

  return ball_on && ball_moved_to && event_distance
    ? computeDistanceForDownDistance(
        ball_on,
        ball_moved_to,
        event_distance,
        fieldLength,
      )
    : null;
}

// export function calculateNewEventDetails(
//   lastEvent: IFootballEventWithPlayers | null,
// ): {
//   newEventNumber: number;
//   newEventPlayType: IFootballPlayType | null;
// } {
//   if (lastEvent && lastEvent.event_number) {
//     return {
//       newEventNumber: lastEvent.event_number + 1,
//       newEventPlayType: lastEvent.play_type,
//     };
//   } else {
//     return {
//       newEventNumber: 1,
//       newEventPlayType: IFootballPlayType.Kickoff,
//     };
//   }
// }

export function computeDownDistance(
  lastEvent: IFootballEventWithPlayers | null | undefined,
  match: IMatchWithFullData | undefined | null,
): number | null {
  if (
    lastEvent &&
    match &&
    lastEvent.ball_on &&
    lastEvent.ball_moved_to &&
    lastEvent.event_distance &&
    match.match_data?.field_length
  ) {
    return computeDistanceForDownDistance(
      lastEvent.ball_on,
      lastEvent.ball_moved_to,
      lastEvent.event_distance,
      match.match_data.field_length / 2,
    );
  }
  return null;
}

export function handleScoringResults(
  lastEvent: IFootballEventWithPlayers | null | undefined,
  match: IMatchWithFullData | undefined | null,
  eventContext: {
    newEventDown: number | null;
    newEventDistance: number | null;
    newEventBallOn: number | null;
    newEventBallMovedOn: number | null;
    newEventTeam: ITeam | null;
    newEventPlayType: IFootballPlayType | null;
    newEventQb: IPlayerInMatchFullData | null;
  },
): void {
  if (lastEvent?.score_result) {
    switch (lastEvent.score_result) {
      case IFootballScoreResult.Td:
      case IFootballScoreResult.TdDefence:
        eventContext.newEventDown = null;
        eventContext.newEventDistance = null;
        eventContext.newEventBallOn = 3;
        break;
      case IFootballScoreResult.KickGood:
        eventContext.newEventPlayType = IFootballPlayType.Kickoff;
        break;
      case IFootballScoreResult.KickMissed:
        eventContext.newEventDown = 1;
        eventContext.newEventDistance = 10;
        break;
      case IFootballScoreResult.PatOneMissed:
      case IFootballScoreResult.PatOneGood:
      case IFootballScoreResult.PatOneReturn:
      case IFootballScoreResult.PatTwoMissed:
      case IFootballScoreResult.PatTwoGood:
      case IFootballScoreResult.PatTwoReturn:
        eventContext.newEventPlayType = IFootballPlayType.Kickoff;
        break;
      case IFootballScoreResult.Safety:
        if (lastEvent.offense_team) {
          eventContext.newEventTeam = lastEvent.offense_team;
          eventContext.newEventPlayType = IFootballPlayType.Kickoff;
        }
        break;
    }
  }
}

export function handlePlayTypeSpecifics(
  newEventPlayType: IFootballPlayType | null,
  eventContext: {
    newEventDown: number | null;
    newEventDistance: number | null;
    newEventQb: IPlayerInMatchFullData | null;
    newEventBallOn: number | null;
  },
): void {
  switch (newEventPlayType) {
    case IFootballPlayType.Kickoff:
      eventContext.newEventDistance = null;
      eventContext.newEventDown = null;
      eventContext.newEventQb = null;
      eventContext.newEventBallOn = -35;
      break;
    case IFootballPlayType.PatOne:
    case IFootballPlayType.PatTwo:
      eventContext.newEventDistance = null;
      eventContext.newEventDown = null;
      eventContext.newEventQb = null;
      eventContext.newEventBallOn = 3;
      break;
  }
}

export function handleEventHash(
  lastEvent: IFootballEventWithPlayers | null | undefined,
  newEventTeam: ITeam | null,
  newEventPlayType: IFootballPlayType | null,
  newEventHash: IEventHash | null,
): void {
  const playDirection = lastEvent?.play_direction || null;

  // if (lastEvent?.event_hash) {
  //   if (
  //     (playDirection === PlayDirection.LEFT_TO_RIGHT && lastEvent.event_hash === IEventHash.Left) ||
  //     (playDirection === PlayDirection.RIGHT_TO_LEFT && lastEvent.event_hash === IEventHash.Right)
  //   ) {
  //     newEventHash = IEventHash.Left;
  //   } else if (
  //     (playDirection === PlayDirection.LEFT_TO_RIGHT && lastEvent.event_hash === IEventHash.Right) ||
  //     (playDirection === PlayDirection.RIGHT_TO_LEFT && lastEvent.event_hash === IEventHash.Left)
  //   ) {
  //     newEventHash = IEventHash.Right;
  //   } else {
  //     newEventHash = IEventHash.Middle;
  //   }
  // }
}

export function isOffenseTeamRecoveryOnFumble(
  lastEvent: IFootballEventWithPlayers | null,
): boolean {
  if (
    lastEvent &&
    lastEvent.event_qb &&
    lastEvent.fumble_recovered_player?.match_player.team_id ===
      lastEvent.offense_team?.id &&
    lastEvent.offense_team?.id &&
    lastEvent.ball_returned_to_on_fumble !== null &&
    lastEvent.ball_returned_to_on_fumble !== undefined
  ) {
    return true;
  }
  return false;
}

export function isDefenceTeamOnFumbleRecovery(
  lastEvent: IFootballEventWithPlayers | null,
): boolean {
  if (
    lastEvent &&
    lastEvent.fumble_recovered_player?.match_player.team_id !==
      lastEvent.offense_team?.id &&
    lastEvent.offense_team?.id &&
    lastEvent.ball_returned_to_on_fumble !== null &&
    lastEvent.ball_returned_to_on_fumble !== undefined
  ) {
    return true;
  }
  return false;
}
