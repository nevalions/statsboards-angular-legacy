import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  getArrayFormDataByIndexAndKey,
  getFormControlWithIndex,
  resetArrayKeyIndexValue,
  setArrayKeyIndexValue,
} from '../../../base/formHelpers';
import { IPlayerInMatchFullData } from '../../../type/player.type';
import { ITeam } from '../../../type/team.type';
import {
  IEventDirection,
  IEventHash,
  IEventStrongSide,
  IFootballEvent,
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IFootballPlayType,
  IFootballScoreResult,
} from '../../../type/football-event.type';
import { IMatchWithFullData } from '../../../type/match.type';
import {
  handleTeamChangeOnDown,
  handleTeamChangeOnFumble,
  handleTeamChangeOnInterception,
  handleTeamChangeOnTouchBack,
} from './football-event-on-change-helpers';
import { computeDistanceForDownDistance } from './football-event-calc-helpers';
import { isEnumValue } from '../../../base/helpers';
import {
  isPatOnePlay,
  isRunPlay,
} from './football-event-isPlayTypeOrResult-helper';

export const eventIdKey = 'eventId';
export const eventNumberKey = 'eventNumber';
export const eventQtrKey = 'eventQtr';
export const eventBallOnKey = 'eventBallOn';
export const eventBallMovedOnKey = 'eventBallMovedOn';
export const eventBallPickedOnKey = 'eventBallPickedOn';
export const eventBallKickedToKey = 'eventBallKickedTo';
export const eventBallReturnedToKey = 'eventBallReturnedTo';

export const eventDistanceMovedKey = 'eventDistanceMoved';
export const eventDistanceOnOffenceKey = 'eventDistanceOnOffence';
export const eventTeamKey = 'eventTeam';
export const eventQbKey = 'eventQb';
export const eventDownKey = 'eventDown';
export const eventDistanceKey = 'eventDistance';
export const eventHashKey = 'eventHash';
export const eventDirectionKey = 'eventDirection';
export const eventStrongSideKey = 'eventStrongSide';
export const eventPlayTypeKey = 'eventPlayType';
export const eventPlayResultKey = 'eventPlayResult';
export const eventScoreResultKey = 'eventScoreResult';
export const eventIsFumbleKey = 'eventIsFumble';
export const eventIsFumbleRecoveredKey = 'eventIsFumbleRecovered';
export const eventRunPlayerKey = 'eventRunPlayer';
export const eventReceiverPlayerKey = 'eventReceiverPlayer';
export const eventDroppedPlayerKey = 'eventDroppedPlayer';
export const eventKickPlayerKey = 'eventKickPlayer';
export const eventPuntPlayerKey = 'eventPuntPlayer';
//DEFENCE
export const eventTacklePlayerKey = 'eventTacklePlayer';
export const eventAssistTacklePlayerKey = 'eventAssistTacklePlayer';
export const eventDeflectedPlayerKey = 'eventDeflectedPlayer';
export const eventInterceptedPlayerKey = 'eventInterceptedPlayer';
export const eventSackPlayerKey = 'eventSackPlayer';
export const eventScorePlayerKey = 'eventScorePlayer';
export const eventDefenceScorePlayerKey = 'eventDefenceScorePlayer';
export const eventKickOffPlayerKey = 'eventKickOffPlayer';
export const eventReturnPlayerKey = 'eventReturnPlayer';
export const eventPatOnePlayerKey = 'eventPatOnePlayer';
export const eventFlaggedPlayerKey = 'eventFlaggedPlayer';
export const eventFumblePlayerKey = 'eventFumblePlayer';
export const eventFumbleRecoveredPlayerKey = 'eventFumbleRecoveredPlayer';

export const eventId = (index: number) => eventIdKey + index;
export const eventNumber = (index: number) => eventNumberKey + index;
export const eventQtr = (index: number) => eventQtrKey + index;
export const eventBallOn = (index: number) => eventBallOnKey + index;
export const eventBallMovedOn = (index: number) => eventBallMovedOnKey + index;
export const eventBallPickedOn = (index: number) =>
  eventBallPickedOnKey + index;
export const eventBallKickedTo = (index: number) =>
  eventBallKickedToKey + index;
export const eventBallReturnedTo = (index: number) =>
  eventBallReturnedToKey + index;
export const eventDistanceMoved = (index: number) =>
  eventDistanceMovedKey + index;
export const eventTeam = (index: number) => eventTeamKey + index;
export const eventQb = (index: number) => eventQbKey + index;
export const eventDown = (index: number) => eventDownKey + index;
export const eventDistance = (index: number) => eventDistanceKey + index;
export const eventDistanceOnOffence = (index: number) =>
  eventDistanceOnOffenceKey + index;
export const eventHash = (index: number) => eventHashKey + index;
export const eventDirection = (index: number) => eventDirectionKey + index;
export const eventStrongSide = (index: number) => eventStrongSideKey + index;

export const eventPlayType = (index: number) => eventPlayTypeKey + index;
export const eventPlayResult = (index: number) => eventPlayResultKey + index;
export const eventScoreResult = (index: number) => eventScoreResultKey + index;
export const eventIsFumble = (index: number) => eventIsFumbleKey + index;
export const eventIsFumbleRecovered = (index: number) =>
  eventIsFumbleRecoveredKey + index;
export const eventRunPlayer = (index: number) => eventRunPlayerKey + index;
export const eventReceiverPlayer = (index: number) =>
  eventReceiverPlayerKey + index;
export const eventDroppedPlayer = (index: number) =>
  eventDroppedPlayerKey + index;
export const eventScorePlayer = (index: number) => eventScorePlayerKey + index;
export const eventDefenceScorePlayer = (index: number) =>
  eventDefenceScorePlayerKey + index;
export const eventKickOffPlayer = (index: number) =>
  eventKickOffPlayerKey + index;
export const eventReturnPlayer = (index: number) =>
  eventReturnPlayerKey + index;
export const eventPatOnePlayer = (index: number) =>
  eventPatOnePlayerKey + index;
export const eventFlaggedPlayer = (index: number) =>
  eventFlaggedPlayerKey + index;

export const eventKickPlayer = (index: number) => eventKickPlayerKey + index;
export const eventPuntPlayer = (index: number) => eventPuntPlayerKey + index;

export const eventTacklePlayer = (index: number) =>
  eventTacklePlayerKey + index;
export const eventAssistTacklePlayer = (index: number) =>
  eventAssistTacklePlayerKey + index;
export const eventDeflectedPlayer = (index: number) =>
  eventDeflectedPlayerKey + index;
export const eventInterceptedPlayer = (index: number) =>
  eventInterceptedPlayerKey + index;
export const eventSackPlayer = (index: number) => eventSackPlayerKey + index;
export const eventFumblePlayer = (index: number) =>
  eventFumblePlayerKey + index;
export const eventFumbleRecoveredPlayer = (index: number) =>
  eventFumbleRecoveredPlayerKey + index;

export function createNewEvent(
  lastEvent: IFootballEventWithPlayers | null | undefined,
  newEventCount: number,
  match: IMatchWithFullData | undefined | null,
): Partial<IFootballEventWithPlayers> {
  let newEventNumber: number | null;
  let newEventQtr: number | null;
  let newEventTeam: ITeam | null = null;
  let newEventQb: IPlayerInMatchFullData | null = null;
  let newEventBallOn: number | null = null;
  let newEventBallMovedOn: number | null = null;
  let newEventBallPickedTo: number | null = null;
  let newEventBallKickedTo: number | null = null;
  let newEventBallReturnedTo: number | null = null;
  let newEventDown: number | null = null;
  let newEventDistance: number | null = null;
  let newEventHash: IEventHash | null = null;
  let newEventPlayType: IFootballPlayType | null = null;
  let compDistance: number | null = null;

  if (
    lastEvent &&
    lastEvent.ball_on &&
    lastEvent.ball_moved_to &&
    lastEvent.event_distance &&
    match &&
    match.match_data &&
    match.match_data.field_length
  ) {
    compDistance = computeDistanceForDownDistance(
      lastEvent.ball_on,
      lastEvent.ball_moved_to,
      lastEvent.event_distance,
      match.match_data.field_length / 2,
    );
  }

  if (lastEvent && lastEvent.event_number) {
    newEventNumber = lastEvent.event_number + 1;
  } else {
    newEventNumber = 1;
    newEventPlayType = IFootballPlayType.Kickoff;
  }

  if (lastEvent && lastEvent.event_qtr) {
    newEventQtr = lastEvent.event_qtr;
  } else {
    newEventQtr = 1;
  }

  if (
    lastEvent &&
    lastEvent.ball_moved_to &&
    lastEvent.play_result !== IFootballPlayResult.PassIntercepted &&
    lastEvent.is_fumble !== true
  ) {
    newEventBallOn = lastEvent.ball_moved_to;
    newEventBallMovedOn = lastEvent.ball_moved_to;
  }

  if (lastEvent && lastEvent.offense_team) {
    newEventTeam = lastEvent.offense_team;
  }

  if (lastEvent && lastEvent.event_qb) {
    newEventQb = lastEvent.event_qb;
  }

  if (lastEvent && lastEvent.event_down) {
    if (lastEvent.event_down < 4) {
      newEventDown = lastEvent.event_down + 1;
    } else {
      newEventDown = lastEvent.event_down;
    }
    if (lastEvent.play_result === IFootballPlayResult.Flag) {
      newEventDown = lastEvent.event_down;
    }
  }

  if (
    compDistance !== null &&
    compDistance !== undefined &&
    lastEvent?.event_distance
  ) {
    // console.log('distance', compDistance, lastEvent.event_distance);
    // newEventDistance = lastEvent.event_distance;
    if (compDistance > 0) {
      newEventDistance = compDistance;
    } else {
      newEventDown = 1;
      newEventDistance = 10;
    }
  }

  if (lastEvent && lastEvent.score_result) {
    if (
      lastEvent.score_result === IFootballScoreResult.Td ||
      lastEvent.score_result === IFootballScoreResult.TdDefence
    ) {
      newEventDown = null;
      newEventDistance = null;
      newEventBallOn = 3;
    }
  }

  if (newEventPlayType === IFootballPlayType.Kickoff) {
    newEventDistance = null;
    newEventDown = null;
    newEventQb = null;
    newEventBallOn = -35;
  } else if (newEventPlayType === IFootballPlayType.PatOne) {
    newEventDistance = null;
    newEventDown = null;
    newEventQb = null;
    newEventBallOn = 3;
  } else if (newEventPlayType === IFootballPlayType.PatTwo) {
    newEventDistance = null;
    newEventDown = null;
    newEventBallOn = 3;
  }

  if (lastEvent && lastEvent.play_result) {
    if (match) {
      const {
        newEventBallOn: newBallOn,
        newEventDown: newDown,
        newEventDistance: newDistance,
        newEventTeam: newTeam,
        newEventQb: newQb,
      } = handleTeamChangeOnTouchBack(match, lastEvent);
      if (
        (lastEvent.play_result === IFootballPlayResult.PuntReturn ||
          lastEvent.play_result === IFootballPlayResult.KickOffReturn ||
          lastEvent.play_result === IFootballPlayResult.KickedOut) &&
        !lastEvent.is_fumble
      ) {
        newEventDown = newDown;
        newEventDistance = newDistance;
        newEventTeam = newTeam;
        newEventQb = newQb;

        if (
          lastEvent.ball_returned_to !== null &&
          lastEvent.ball_returned_to !== undefined
        ) {
          newEventBallOn = -lastEvent.ball_returned_to;
          newEventBallMovedOn = -lastEvent.ball_returned_to;
        }
      }

      if (lastEvent.play_result === IFootballPlayResult.TouchBack) {
        newEventBallOn = newBallOn;
        newEventBallMovedOn = newBallOn;
        newEventDown = newDown;
        newEventDistance = newDistance;
        newEventTeam = newTeam;
        newEventQb = newQb;
      }

      if (lastEvent.score_result === IFootballScoreResult.KickGood) {
        newEventPlayType = IFootballPlayType.Kickoff;
      }

      if (lastEvent.score_result === IFootballScoreResult.KickMissed) {
        newEventDown = 1;
        newEventDistance = 10;
        newEventTeam = newTeam;
      }

      if (
        lastEvent.score_result === IFootballScoreResult.PatOneMissed ||
        lastEvent.score_result === IFootballScoreResult.PatOneGood ||
        lastEvent.score_result === IFootballScoreResult.PatOneReturn ||
        lastEvent.score_result === IFootballScoreResult.PatTwoMissed ||
        lastEvent.score_result === IFootballScoreResult.PatTwoGood ||
        lastEvent.score_result === IFootballScoreResult.PatTwoReturn
      ) {
        // newEventTeam = newTeam;
        newEventPlayType = IFootballPlayType.Kickoff;
      }

      if (lastEvent.score_result === IFootballScoreResult.TdDefence) {
        newEventTeam = newTeam;
        newEventBallOn = 3;
        newEventBallMovedOn = null;
        newEventDown = null;
        newEventDistance = null;
        newEventQb = null;
      }

      if (
        lastEvent.offense_team &&
        lastEvent.score_result === IFootballScoreResult.Safety
      ) {
        newEventTeam = lastEvent.offense_team;
        newEventPlayType = IFootballPlayType.Kickoff;
      }

      if (newEventPlayType === IFootballPlayType.Kickoff) {
        newEventDown = null;
        newEventDistance = null;
        newEventQb = null;
        newEventBallOn = -35;
      }
    }
  }

  if (lastEvent && lastEvent.play_type) {
    if (match) {
      const {
        newEventBallOn: newBallOn,
        newEventDown: newDown,
        newEventDistance: newDistance,
        newEventTeam: newTeam,
      } = handleTeamChangeOnDown(match, lastEvent);
      // console.log('handleDict', newBallOn, newDown, newDistance, newTeam?.id);
      // console.log('last and new event', lastEvent.offense_team?.id, newEventTeam?.id, lastEvent.event_down)
      if (
        lastEvent.event_down === 4 &&
        (lastEvent.play_type === IFootballPlayType.Pass ||
          lastEvent.play_type === IFootballPlayType.Run)
      ) {
        // console.log(
        //   'last 4th down',
        //   lastEvent.distance_moved,
        //   lastEvent.event_distance,
        // );
        if (
          lastEvent.distance_moved !== null &&
          lastEvent.distance_moved !== undefined &&
          lastEvent.event_distance !== null &&
          lastEvent.event_distance !== undefined &&
          lastEvent.distance_moved < lastEvent.event_distance
        ) {
          newEventTeam = newTeam;
          newEventBallOn = newBallOn;
          newEventBallMovedOn = newBallOn;
          newEventDown = newDown;
          newEventDistance = newDistance;
          newEventQb = null;
        }
      }
    }
  }

  if (lastEvent && lastEvent.play_result) {
    if (match) {
      const { newEventBallOn: newBallOn, newEventTeam: newTeam } =
        handleTeamChangeOnFumble(match, lastEvent);
      if (lastEvent.is_fumble && !lastEvent.score_result) {
        if (
          lastEvent.fumble_recovered_player?.match_player.team_id !==
            lastEvent.offense_team?.id &&
          lastEvent.offense_team?.id &&
          lastEvent.ball_returned_to !== null &&
          lastEvent.ball_returned_to !== undefined
        ) {
          newEventBallOn = -lastEvent.ball_returned_to;
          newEventBallMovedOn = -lastEvent.ball_returned_to;
          newEventTeam = newTeam;
          newEventDown = 1;
          newEventDistance = 10;
          newEventQb = null;
        }
        if (
          lastEvent.event_qb &&
          lastEvent.fumble_recovered_player?.match_player.team_id ===
            lastEvent.offense_team?.id &&
          lastEvent.offense_team?.id &&
          lastEvent.ball_returned_to !== null &&
          lastEvent.ball_returned_to !== undefined
        ) {
          newEventBallOn = lastEvent.ball_returned_to;
          newEventBallMovedOn = lastEvent.ball_returned_to;
          newEventQb = lastEvent.event_qb;
        }
      }
    }
  }

  if (lastEvent && lastEvent.play_result) {
    if (match) {
      const { newEventBallOn: newBallOn, newEventTeam: newTeam } =
        handleTeamChangeOnInterception(match, lastEvent);
      if (
        lastEvent.play_result === IFootballPlayResult.PassIntercepted &&
        !lastEvent.score_result
      ) {
        if (
          lastEvent.ball_returned_to !== null &&
          lastEvent.ball_returned_to !== undefined
        ) {
          newEventBallOn = -lastEvent.ball_returned_to;
          newEventBallMovedOn = -lastEvent.ball_returned_to;
          newEventTeam = newTeam;
          newEventDown = 1;
          newEventDistance = 10;
          newEventQb = null;
        }
      }
    }
  }

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
        newEventHash = IEventHash.Left;
      }
      if (lastEvent.play_direction === IEventDirection.RightWide) {
        newEventHash = IEventHash.Right;
      }
      if (
        lastEvent.event_hash === IEventHash.Left &&
        lastEvent.play_direction === IEventDirection.Left
      ) {
        newEventHash = IEventHash.Left;
      }
      if (
        lastEvent.event_hash === IEventHash.Right &&
        lastEvent.play_direction === IEventDirection.Right
      ) {
        newEventHash = IEventHash.Right;
      }
      if (
        lastEvent.event_hash === IEventHash.Middle &&
        lastEvent.play_direction === IEventDirection.Middle
      ) {
        newEventHash = IEventHash.Middle;
      }
    }
  }

  return {
    id: null,
    event_number: newEventNumber,
    event_qtr: newEventQtr,
    ball_on: newEventBallOn,
    ball_moved_to: newEventBallMovedOn,
    ball_picked_on: newEventBallPickedTo,
    ball_kicked_to: newEventBallKickedTo,
    ball_returned_to: newEventBallReturnedTo,
    offense_team: newEventTeam,
    event_qb: newEventQb,
    event_down: newEventDown,
    event_distance: newEventDistance,
    event_hash: newEventHash,
    play_direction: null,
    play_type: newEventPlayType,
    play_result: null,
    score_result: null,
    is_fumble: false,
    is_fumble_recovered: false,
  };
}

export function extractEventData(
  eventsArray: FormArray,
  index: number,
): Partial<IFootballEvent> {
  const eventId = getEventId(eventsArray, index);
  const eventNumber = getEventNumber(eventsArray, index);
  const eventQtr = getQtr(eventsArray, index);
  const eventBallOn = getEventBallOn(eventsArray, index);
  const eventBallMovedOn = getEventBallMovedOn(eventsArray, index);
  const eventBallPickedOn = getEventBallPickedOn(eventsArray, index);
  const eventBallKickedTo = getEventBallKickedTo(eventsArray, index);
  const eventBallReturnedTo = getEventBallReturnedTo(eventsArray, index);
  const eventDistanceMoved = getEventDistanceMoved(eventsArray, index);
  const eventDistanceOnOffence = getEventDistanceOnOffence(eventsArray, index);
  const eventTeam = getEventTeam(eventsArray, index);
  const eventQb = getEventQb(eventsArray, index);
  const eventDown = getEventDown(eventsArray, index);
  const eventDistance = getEventDistance(eventsArray, index);
  const eventHash = getEventHash(eventsArray, index);
  const eventDirection = getEventDirection(eventsArray, index);
  const eventStrongSide = getEventStrongSide(eventsArray, index);
  const eventPlayType = getEventPlayType(eventsArray, index);
  const eventPlayResult = getEventPlayResult(eventsArray, index);
  const eventScoreResult = getEventScoreResult(eventsArray, index);
  const eventIsFumble = getEventIsFumble(eventsArray, index);
  const eventIsFumbleRecovered = getEventIsFumbleRecovered(eventsArray, index);
  const eventRunPlayer = getEventRunPlayer(eventsArray, index);
  const eventReceiverPlayer = getEventReceiverPlayer(eventsArray, index);
  const eventDroppedPlayer = getEventDroppedPlayer(eventsArray, index);
  const eventScorePlayer = getEventScorePlayer(eventsArray, index);
  const eventDefenceScorePlayer = getEventDefenceScorePlayer(
    eventsArray,
    index,
  );
  const eventKickOffPlayer = getEventKickOffPlayer(eventsArray, index);
  const eventReturnPlayer = getEventReturnPlayer(eventsArray, index);
  const eventPatOnePlayer = getEventPatOnePlayer(eventsArray, index);
  const eventFlaggedPlayer = getEventFlaggedPlayer(eventsArray, index);
  const eventKickPlayer = getEventKickPlayer(eventsArray, index);
  const eventPuntPlayer = getEventPuntPlayer(eventsArray, index);
  const eventTacklePlayer = getEventTacklePlayer(eventsArray, index);
  const eventAssistTacklePlayer = getEventAssistTacklePlayer(
    eventsArray,
    index,
  );
  const eventDeflectedPlayer = getEventDeflectedPlayer(eventsArray, index);
  const eventInterceptedPlayer = getEventInterceptedPlayer(eventsArray, index);
  const eventSackPlayer = getEventSackPlayer(eventsArray, index);
  const eventFumblePlayer = getEventFumblePlayer(eventsArray, index);
  const eventFumbleRecoveredPlayer = getEventFumbleRecoveredPlayer(
    eventsArray,
    index,
  );

  const newEventData: Partial<IFootballEvent> = {};

  if (eventId !== null && eventId !== undefined) {
    newEventData.id = eventId;
  }

  if (eventNumber !== undefined) {
    newEventData.event_number = eventNumber;
  }

  if (eventQtr !== undefined) {
    newEventData.event_qtr = eventQtr;
  }

  if (eventBallOn !== undefined) {
    newEventData.ball_on = eventBallOn;
  }

  if (eventBallMovedOn !== undefined) {
    newEventData.ball_moved_to = eventBallMovedOn;
  }

  if (eventBallPickedOn !== undefined) {
    newEventData.ball_picked_on = eventBallPickedOn;
  }

  if (eventBallKickedTo !== undefined) {
    newEventData.ball_kicked_to = eventBallKickedTo;
  }

  if (eventBallReturnedTo !== undefined) {
    newEventData.ball_returned_to = eventBallReturnedTo;
  }

  if (eventDistanceOnOffence || eventDistanceOnOffence === 0) {
    newEventData.distance_on_offence = eventDistanceOnOffence;
  } else {
    newEventData.distance_on_offence = 0;
  }

  if (eventTeam) {
    newEventData.offense_team = eventTeam.id;
  }

  newEventData.event_qb = eventQb?.match_player?.id ?? null;

  if (eventDown !== undefined) {
    newEventData.event_down = eventDown;
  }

  if (eventDistance !== undefined) {
    newEventData.event_distance = eventDistance;
  }

  if (eventHash) {
    newEventData.event_hash = eventHash.toLowerCase();
  } else {
    newEventData.event_hash = null;
  }

  if (eventDirection) {
    newEventData.play_direction = eventDirection.toLowerCase();
  } else {
    newEventData.play_direction = null;
  }

  if (eventStrongSide) {
    newEventData.event_strong_side = eventStrongSide.toLowerCase();
  } else {
    newEventData.event_strong_side = null;
  }

  if (eventPlayType) {
    newEventData.play_type = eventPlayType.toLowerCase();
  } else {
    newEventData.play_type = null;
  }

  if (eventPlayResult) {
    newEventData.play_result = eventPlayResult.toLowerCase();
  } else {
    newEventData.play_result = null;
  }

  if (eventScoreResult) {
    newEventData.score_result = eventScoreResult.toLowerCase();
  } else {
    newEventData.score_result = null;
  }

  newEventData.is_fumble = eventIsFumble ?? false;
  newEventData.is_fumble_recovered = eventIsFumbleRecovered ?? false;

  newEventData.run_player = eventRunPlayer?.match_player?.id ?? null;
  newEventData.pass_received_player =
    eventReceiverPlayer?.match_player?.id ?? null;
  newEventData.pass_dropped_player =
    eventDroppedPlayer?.match_player?.id ?? null;
  newEventData.score_player = eventScorePlayer?.match_player?.id ?? null;
  newEventData.defence_score_player =
    eventDefenceScorePlayer?.match_player?.id ?? null;
  newEventData.kickoff_player = eventKickOffPlayer?.match_player?.id ?? null;
  newEventData.return_player = eventReturnPlayer?.match_player?.id ?? null;
  newEventData.pat_one_player = eventPatOnePlayer?.match_player?.id ?? null;
  newEventData.flagged_player = eventFlaggedPlayer?.match_player?.id ?? null;
  newEventData.kick_player = eventKickPlayer?.match_player?.id ?? null;
  newEventData.punt_player = eventPuntPlayer?.match_player?.id ?? null;
  newEventData.tackle_player = eventTacklePlayer?.match_player?.id ?? null;
  newEventData.assist_tackle_player =
    eventAssistTacklePlayer?.match_player?.id ?? null;
  newEventData.pass_deflected_player =
    eventDeflectedPlayer?.match_player?.id ?? null;
  newEventData.pass_intercepted_player =
    eventInterceptedPlayer?.match_player?.id ?? null;
  newEventData.sack_player = eventSackPlayer?.match_player?.id ?? null;
  newEventData.fumble_player = eventFumblePlayer?.match_player?.id ?? null;
  newEventData.fumble_recovered_player =
    eventFumbleRecoveredPlayer?.match_player?.id ?? null;

  return newEventData;
}

export function toggleFootballEnumValue(
  value: string,
  eventsArray: FormArray,
  index: number,
  type:
    | 'hash'
    | 'direction'
    | 'strongSide'
    | 'playType'
    | 'playResult'
    | 'scoreResult',
): void {
  if (type === 'hash') {
    const currentHash = getEventHash(eventsArray, index);
    setEventHash(eventsArray, index, currentHash === value ? null : value);
  }
  if (type === 'direction') {
    const currentDirection = getEventDirection(eventsArray, index);
    setEventDirection(
      eventsArray,
      index,
      currentDirection === value ? null : value,
    );
  }
  if (type === 'strongSide') {
    const currentStrongSide = getEventStrongSide(eventsArray, index);
    setEventStrongSide(
      eventsArray,
      index,
      currentStrongSide === value ? null : value,
    );
  }
  if (type === 'playType') {
    const currentPlayType = getEventPlayType(eventsArray, index);
    setEventPlayType(
      eventsArray,
      index,
      currentPlayType === value ? null : value,
    );
    if (isPatOnePlay(eventsArray, index)) {
      setEventPlayResult(eventsArray, index, IFootballPlayResult.PatOne);
    }
    if (isRunPlay(eventsArray, index)) {
      setEventPlayResult(eventsArray, index, IFootballPlayResult.Run);
    }
  }
  if (type === 'playResult') {
    const currentPlayResult = getEventPlayResult(eventsArray, index);
    setEventPlayResult(
      eventsArray,
      index,
      currentPlayResult === value ? null : value,
    );
  }
  if (type === 'scoreResult') {
    const currentScoreResult = getEventScoreResult(eventsArray, index);
    setEventScoreResult(
      eventsArray,
      index,
      currentScoreResult === value ? null : value,
    );
  }
}

// EVENT ID
export function getEventId(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(eventsArray, index, eventIdKey);
}

// EVENT NUMBER
export function getEventNumber(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventNumberKey,
  );
}

export function getEventNumberFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventNumberKey, arrayName);
}

// QTR
export function getQtr(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(eventsArray, index, eventQtrKey);
}

export function getQtrFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventQtrKey, arrayName);
}

// BallOn
export function getEventBallOn(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventBallOnKey,
  );
}

export function getEventBallOnFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventBallOnKey, arrayName);
}

export function setEventBallOn(
  eventsArray: FormArray,
  index: number,
  selectedItem: number,
): void {
  setArrayKeyIndexValue(eventsArray, index, selectedItem, eventBallOnKey);
}

// BallMovedOn
export function getEventBallMovedOn(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventBallMovedOnKey,
  );
}

export function getEventBallMovedOnFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventBallMovedOnKey, arrayName);
}

export function setEventBallMovedOn(
  eventsArray: FormArray,
  index: number,
  selectedItem: number,
): void {
  setArrayKeyIndexValue(eventsArray, index, selectedItem, eventBallMovedOnKey);
}

export function resetEventBallMovedOn(
  eventsArray: FormArray,
  index: number,
): void {
  resetArrayKeyIndexValue(eventsArray, index, eventBallMovedOnKey);
}

// EventBallPickedOn
export function getEventBallPickedOn(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventBallPickedOnKey,
  );
}

export function getEventBallPickedOnFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventBallPickedOnKey, arrayName);
}

export function setBallPickedOn(
  eventsArray: FormArray,
  index: number,
  selectedItem: number,
): void {
  setArrayKeyIndexValue(eventsArray, index, selectedItem, eventBallPickedOnKey);
}

// EventBallKickedTo
export function getEventBallKickedTo(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventBallKickedToKey,
  );
}

export function getEventBallKickedToFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventBallKickedToKey, arrayName);
}

export function setBallKickedTo(
  eventsArray: FormArray,
  index: number,
  selectedItem: number,
): void {
  setArrayKeyIndexValue(eventsArray, index, selectedItem, eventBallKickedToKey);
}

// EventBallReturnedTo
export function getEventBallReturnedTo(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventBallReturnedToKey,
  );
}

export function getEventBallReturnedToFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(
    form,
    index,
    eventBallReturnedToKey,
    arrayName,
  );
}

export function setBallReturnedTo(
  eventsArray: FormArray,
  index: number,
  selectedItem: number,
): void {
  setArrayKeyIndexValue(
    eventsArray,
    index,
    selectedItem,
    eventBallReturnedToKey,
  );
}

// EventDistanceMoved
export function getEventDistanceMoved(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventDistanceMovedKey,
  );
}

export function getEventDistanceMovedFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventDistanceMovedKey, arrayName);
}

export function setEventDistanceMoved(
  eventsArray: FormArray,
  index: number,
  selectedItem: number,
): void {
  setArrayKeyIndexValue(
    eventsArray,
    index,
    selectedItem,
    eventDistanceMovedKey,
  );
}

// EventDistanceOnOffence
export function getEventDistanceOnOffence(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventDistanceOnOffenceKey,
  );
}

export function getEventDistanceOnOffenceFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(
    form,
    index,
    eventDistanceOnOffenceKey,
    arrayName,
  );
}

export function setDistanceOnOffence(
  eventsArray: FormArray,
  index: number,
  selectedItem: number,
): void {
  setArrayKeyIndexValue(
    eventsArray,
    index,
    selectedItem,
    eventDistanceOnOffenceKey,
  );
}

// EventTeam
export function getEventTeam(
  eventsArray: FormArray,
  index: number,
): ITeam | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventTeamKey,
  );
}

export function getEventTeamFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventTeamKey, arrayName);
}

// EventQb
export function getEventQb(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(eventsArray, index, eventQbKey);
}

export function getEventQbFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventQbKey, arrayName);
}

export function resetQb(eventsArray: FormArray, index: number): void {
  resetArrayKeyIndexValue(eventsArray, index, eventQbKey);
}

// EventDown
export function getEventDown(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventDownKey,
  );
}

export function getEventDownFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventDownKey, arrayName);
}

export function setDown(
  eventsArray: FormArray,
  index: number,
  selectedItem: number,
): void {
  setArrayKeyIndexValue(eventsArray, index, selectedItem, eventDownKey);
}

// EventDistance
export function getEventDistance(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventDistanceKey,
  );
}

export function getEventDistanceFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventDistanceKey, arrayName);
}

export function setDistance(
  eventsArray: FormArray,
  index: number,
  selectedItem: number,
): void {
  setArrayKeyIndexValue(eventsArray, index, selectedItem, eventDistanceKey);
}

// EventHash
export function getEventHash(
  eventsArray: FormArray,
  index: number,
): IEventHash | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventHashKey,
  );
}

export function getEventHashFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventHashKey, arrayName);
}

export function setEventHash(
  eventsArray: FormArray,
  index: number,
  selectedItem: IEventHash | string | null,
): void {
  if (selectedItem && isEnumValue(IEventHash, selectedItem.toString())) {
    setArrayKeyIndexValue(eventsArray, index, selectedItem, eventHashKey);
  } else {
    setArrayKeyIndexValue(eventsArray, index, null, eventHashKey);
  }
}

// EventDirection
export function getEventDirection(
  eventsArray: FormArray,
  index: number,
): IEventDirection | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventDirectionKey,
  );
}

export function getEventDirectionFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventDirectionKey, arrayName);
}

export function setEventDirection(
  eventsArray: FormArray,
  index: number,
  selectedItem: IEventDirection | string | null,
): void {
  if (selectedItem && isEnumValue(IEventDirection, selectedItem.toString())) {
    setArrayKeyIndexValue(eventsArray, index, selectedItem, eventDirectionKey);
  } else {
    setArrayKeyIndexValue(eventsArray, index, null, eventDirectionKey);
  }
}

// EventStrongSide
export function getEventStrongSide(
  eventsArray: FormArray,
  index: number,
): IEventDirection | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventStrongSideKey,
  );
}

export function getEventStrongSideFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventStrongSideKey, arrayName);
}

export function setEventStrongSide(
  eventsArray: FormArray,
  index: number,
  selectedItem: IEventStrongSide | string | null,
): void {
  if (selectedItem && isEnumValue(IEventStrongSide, selectedItem.toString())) {
    setArrayKeyIndexValue(eventsArray, index, selectedItem, eventStrongSideKey);
  } else {
    setArrayKeyIndexValue(eventsArray, index, null, eventStrongSideKey);
  }
}

// EventPlayType
export function getEventPlayType(
  eventsArray: FormArray,
  index: number,
): IFootballPlayType | null | undefined {
  const playType = getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventPlayTypeKey,
  );
  // console.log('playType', playType);
  return playType;
}

export function getEventPlayTypeFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventPlayTypeKey, arrayName);
}

export function setEventPlayType(
  eventsArray: FormArray,
  index: number,
  selectedType: IFootballPlayType | string | null,
): void {
  if (selectedType && isEnumValue(IFootballPlayType, selectedType.toString())) {
    setArrayKeyIndexValue(eventsArray, index, selectedType, eventPlayTypeKey);
  } else {
    setArrayKeyIndexValue(eventsArray, index, null, eventPlayTypeKey);
  }
}

// EventPlayResult
export function getEventPlayResult(
  eventsArray: FormArray,
  index: number,
): IFootballPlayResult | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventPlayResultKey,
  );
}

export function getEventPlayResultFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventPlayResultKey, arrayName);
}

export function setEventPlayResult(
  eventsArray: FormArray,
  index: number,
  selectedItem: IFootballPlayResult | string | null,
): void {
  if (
    selectedItem &&
    isEnumValue(IFootballPlayResult, selectedItem.toString())
  ) {
    setArrayKeyIndexValue(eventsArray, index, selectedItem, eventPlayResultKey);
  } else {
    setArrayKeyIndexValue(eventsArray, index, null, eventPlayResultKey);
  }
}

export function resetPlayResult(eventsArray: FormArray, index: number): void {
  resetArrayKeyIndexValue(eventsArray, index, eventPlayResultKey);
}

// EventScoreResult
export function getEventScoreResult(
  eventsArray: FormArray,
  index: number,
): IFootballScoreResult | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventScoreResultKey,
  );
}

export function getEventScoreResultFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventScoreResultKey, arrayName);
}

export function setEventScoreResult(
  eventsArray: FormArray,
  index: number,
  selectedItem: IFootballScoreResult | string | null,
): void {
  if (
    selectedItem &&
    isEnumValue(IFootballScoreResult, selectedItem.toString())
  ) {
    setArrayKeyIndexValue(
      eventsArray,
      index,
      selectedItem,
      eventScoreResultKey,
    );
  } else {
    setArrayKeyIndexValue(eventsArray, index, null, eventScoreResultKey);
  }
}

export function resetScoreResult(eventsArray: FormArray, index: number): void {
  resetArrayKeyIndexValue(eventsArray, index, eventScoreResultKey);
}

// EventIsFumble
export function getEventIsFumble(
  eventsArray: FormArray,
  index: number,
): boolean | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventIsFumbleKey,
  );
}

export function getEventIsFumbleFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventIsFumbleKey, arrayName);
}

// EventIsFumbleRecovered
export function getEventIsFumbleRecovered(
  eventsArray: FormArray,
  index: number,
): boolean | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventIsFumbleRecoveredKey,
  );
}

export function getEventIsFumbleRecoveredFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(
    form,
    index,
    eventIsFumbleRecoveredKey,
    arrayName,
  );
}

// EventRunPlayer
export function getEventRunPlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventRunPlayerKey,
  );
}

export function getEventRunPlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventRunPlayerKey, arrayName);
}

export function resetRunPlayer(eventsArray: FormArray, index: number): void {
  resetArrayKeyIndexValue(eventsArray, index, eventRunPlayerKey);
}

// EventReceiverPlayer
export function getEventReceiverPlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventReceiverPlayerKey,
  );
}

export function getEventReceiverPlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(
    form,
    index,
    eventReceiverPlayerKey,
    arrayName,
  );
}

export function resetReceiverPlayer(
  eventsArray: FormArray,
  index: number,
): void {
  resetArrayKeyIndexValue(eventsArray, index, eventReceiverPlayerKey);
}

// EventDroppedPlayer
export function getEventDroppedPlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventDroppedPlayerKey,
  );
}

export function getEventDroppedPlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventDroppedPlayerKey, arrayName);
}

export function resetDroppedPlayer(
  eventsArray: FormArray,
  index: number,
): void {
  resetArrayKeyIndexValue(eventsArray, index, eventDroppedPlayerKey);
}

// EventScorePlayer
export function getEventScorePlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventScorePlayerKey,
  );
}

export function getEventScorePlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventScorePlayerKey, arrayName);
}

export function setScorePlayer(
  eventsArray: FormArray,
  index: number,
  selectedItem: IPlayerInMatchFullData | null | undefined,
): void {
  setArrayKeyIndexValue(eventsArray, index, selectedItem, eventScorePlayerKey);
}

export function resetScorePlayer(eventsArray: FormArray, index: number): void {
  resetArrayKeyIndexValue(eventsArray, index, eventScorePlayerKey);
}

// EventDefenceScorePlayer
export function getEventDefenceScorePlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventDefenceScorePlayerKey,
  );
}

export function getEventDefenceScorePlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(
    form,
    index,
    eventDefenceScorePlayerKey,
    arrayName,
  );
}

export function resetDefenceScorePlayer(
  eventsArray: FormArray,
  index: number,
): void {
  resetArrayKeyIndexValue(eventsArray, index, eventDefenceScorePlayerKey);
}

// EventKickPlayer
export function getEventKickPlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventKickPlayerKey,
  );
}

export function getEventKickPlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventKickPlayerKey, arrayName);
}

export function resetKickPlayer(eventsArray: FormArray, index: number): void {
  resetArrayKeyIndexValue(eventsArray, index, eventKickPlayerKey);
}

// EventReturnPlayer
export function getEventReturnPlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventReturnPlayerKey,
  );
}

export function getEventReturnPlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventReturnPlayerKey, arrayName);
}

export function resetReturnPlayer(eventsArray: FormArray, index: number): void {
  resetArrayKeyIndexValue(eventsArray, index, eventReturnPlayerKey);
}

// EventKickOffPlayer
export function getEventKickOffPlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventKickOffPlayerKey,
  );
}

export function getEventKickOffPlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventKickOffPlayerKey, arrayName);
}

export function resetKickOffPlayer(
  eventsArray: FormArray,
  index: number,
): void {
  resetArrayKeyIndexValue(eventsArray, index, eventKickOffPlayerKey);
}

// EventPatOnePlayer
export function getEventPatOnePlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventPatOnePlayerKey,
  );
}

export function getEventPatOnePlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventPatOnePlayerKey, arrayName);
}

export function resetPatOnePlayer(eventsArray: FormArray, index: number): void {
  resetArrayKeyIndexValue(eventsArray, index, eventPatOnePlayerKey);
}

// EventFlaggedPlayer
export function getEventFlaggedPlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventFlaggedPlayerKey,
  );
}

export function getEventFlaggedPlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventFlaggedPlayerKey, arrayName);
}

export function resetFlaggedPlayer(
  eventsArray: FormArray,
  index: number,
): void {
  resetArrayKeyIndexValue(eventsArray, index, eventFlaggedPlayerKey);
}

// EventPuntPlayer
export function getEventPuntPlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventPuntPlayerKey,
  );
}

export function getEventPuntPlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventPuntPlayerKey, arrayName);
}

export function resetPuntPlayer(eventsArray: FormArray, index: number): void {
  resetArrayKeyIndexValue(eventsArray, index, eventPuntPlayerKey);
}

// EventTacklePlayer
export function getEventTacklePlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventTacklePlayerKey,
  );
}

export function getEventTacklePlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventTacklePlayerKey, arrayName);
}

export function resetTacklePlayer(eventsArray: FormArray, index: number): void {
  resetArrayKeyIndexValue(eventsArray, index, eventTacklePlayerKey);
}

// EventAssistTacklePlayer
export function getEventAssistTacklePlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventAssistTacklePlayerKey,
  );
}

export function getEventAssistTacklePlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(
    form,
    index,
    eventAssistTacklePlayerKey,
    arrayName,
  );
}

export function resetAssistTacklePlayer(
  eventsArray: FormArray,
  index: number,
): void {
  resetArrayKeyIndexValue(eventsArray, index, eventAssistTacklePlayerKey);
}

// EventDeflectedPlayer
export function getEventDeflectedPlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventDeflectedPlayerKey,
  );
}

export function getEventDeflectedPlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(
    form,
    index,
    eventDeflectedPlayerKey,
    arrayName,
  );
}

export function resetDeflectedPlayer(
  eventsArray: FormArray,
  index: number,
): void {
  resetArrayKeyIndexValue(eventsArray, index, eventDeflectedPlayerKey);
}

// EventInterceptedPlayer
export function getEventInterceptedPlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventInterceptedPlayerKey,
  );
}

export function getEventInterceptedPlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(
    form,
    index,
    eventInterceptedPlayerKey,
    arrayName,
  );
}

export function resetInterceptedPlayer(
  eventsArray: FormArray,
  index: number,
): void {
  resetArrayKeyIndexValue(eventsArray, index, eventInterceptedPlayerKey);
}

// EventSackPlayer
export function getEventSackPlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventSackPlayerKey,
  );
}

export function getEventSackPlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventSackPlayerKey, arrayName);
}

export function resetSackPlayer(eventsArray: FormArray, index: number): void {
  resetArrayKeyIndexValue(eventsArray, index, eventSackPlayerKey);
}

// EventFumblePlayer
export function getEventFumblePlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventFumblePlayerKey,
  );
}

export function getEventFumblePlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(form, index, eventFumblePlayerKey, arrayName);
}

export function resetFumblePlayer(eventsArray: FormArray, index: number): void {
  resetArrayKeyIndexValue(eventsArray, index, eventFumblePlayerKey);
}

// EventFumbleRecoveredPlayer
export function getEventFumbleRecoveredPlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventFumbleRecoveredPlayerKey,
  );
}

export function getEventFumbleRecoveredPlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(
    form,
    index,
    eventFumbleRecoveredPlayerKey,
    arrayName,
  );
}

export function resetFumbleRecoveredPlayer(
  eventsArray: FormArray,
  index: number,
): void {
  resetArrayKeyIndexValue(eventsArray, index, eventFumbleRecoveredPlayerKey);
}
