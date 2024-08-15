import {
  IEventDirection,
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

export function determineNewEventDistance(
  lastEvent: IFootballEventWithPlayers | null | undefined,
): number | null {
  return lastEvent?.event_distance ?? null;
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

export function computeEventDistance(
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

export function determineNewEventDownDistanceOnCompute(
  lastEvent: IFootballEventWithPlayers | null | undefined,
  compDistance: number | null,
): { newEventDown: number | null; newEventDistance: number | null } {
  if (
    compDistance !== null &&
    compDistance !== undefined &&
    lastEvent?.event_distance
  ) {
    if (compDistance > 0) {
      return {
        newEventDown: lastEvent.event_down ?? null,
        newEventDistance: compDistance,
      };
    } else {
      return { newEventDown: 1, newEventDistance: 10 };
    }
  }
  return {
    newEventDown: lastEvent?.event_down ?? null,
    newEventDistance: lastEvent?.event_distance ?? null,
  };
}

export function handleScoringResults(
  lastEvent: IFootballEventWithPlayers | null | undefined,
  eventContext: {
    newEventDown: number | null;
    newEventDistance: number | null;
    newEventBallOn: number | null;
    newEventBallMovedOn: number | null;
    newEventTeam: ITeam | null;
    newEventPlayType: IFootballPlayType | null;
    newEventQb: IPlayerInMatchFullData | null;
  },
): {
  newEventDown: number | null;
  newEventDistance: number | null;
  newEventBallOn: number | null;
  newEventBallMovedOn: number | null;
  newEventTeam: ITeam | null;
  newEventPlayType: IFootballPlayType | null;
  newEventQb: IPlayerInMatchFullData | null;
} {
  if (lastEvent?.score_result) {
    switch (lastEvent.score_result) {
      case IFootballScoreResult.Td:
      case IFootballScoreResult.TdDefence:
        eventContext.newEventDown = null;
        eventContext.newEventDistance = null;
        eventContext.newEventBallOn = 3;
        break;
      case IFootballScoreResult.KickMissed:
        eventContext.newEventDown = 1;
        eventContext.newEventDistance = 10;
        break;
      case IFootballScoreResult.KickGood:
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
  return eventContext;
}

export function handlePlayTypeSpecifics(
  newEventPlayType: IFootballPlayType | null,
  playTypeChangeContext: {
    newEventDown: number | null;
    newEventDistance: number | null;
    newEventQb: IPlayerInMatchFullData | null;
    newEventBallOn: number | null;
  },
): {
  newEventDown: number | null;
  newEventDistance: number | null;
  newEventQb: IPlayerInMatchFullData | null;
  newEventBallOn: number | null;
} {
  switch (newEventPlayType) {
    case IFootballPlayType.Kickoff:
      // console.log('kickoff', newEventPlayType);
      playTypeChangeContext.newEventDistance = null;
      playTypeChangeContext.newEventDown = null;
      playTypeChangeContext.newEventQb = null;
      playTypeChangeContext.newEventBallOn = -35;
      // console.log('kickoff new data', playTypeChangeContext);
      break;
    case IFootballPlayType.PatOne:
    case IFootballPlayType.PatTwo:
      playTypeChangeContext.newEventDistance = null;
      playTypeChangeContext.newEventDown = null;
      playTypeChangeContext.newEventQb = null;
      playTypeChangeContext.newEventBallOn = 3;
      break;
  }
  return playTypeChangeContext;
}

export function handleEventHash(
  lastEvent: IFootballEventWithPlayers | null | undefined,
  newEventTeam: ITeam | null,
  newEventPlayType: IFootballPlayType | null,
): IEventHash | null {
  if (
    lastEvent &&
    lastEvent.offense_team === newEventTeam &&
    newEventPlayType !== IFootballPlayType.Kickoff
  ) {
    if (
      lastEvent.play_result === IFootballPlayResult.Run ||
      lastEvent.play_result === IFootballPlayResult.PassCompleted
    ) {
      if (lastEvent.play_direction === IEventDirection.LeftWide) {
        return IEventHash.Left;
      }
      if (lastEvent.play_direction === IEventDirection.RightWide) {
        return IEventHash.Right;
      }
      if (
        lastEvent.event_hash === IEventHash.Left &&
        lastEvent.play_direction === IEventDirection.Left
      ) {
        return IEventHash.Left;
      }
      if (
        lastEvent.event_hash === IEventHash.Right &&
        lastEvent.play_direction === IEventDirection.Right
      ) {
        return IEventHash.Right;
      }
      if (
        lastEvent.event_hash === IEventHash.Middle &&
        lastEvent.play_direction === IEventDirection.Middle
      ) {
        return IEventHash.Middle;
      }
      return lastEvent.event_hash ?? null;
    }
    return lastEvent.event_hash ?? null;
  }
  return null;
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
