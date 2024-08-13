import { FormArray } from '@angular/forms';
import { IFootballEvent } from '../../../type/football-event.type';
import {
  getEventAssistTacklePlayer,
  getEventBallKickedTo,
  getEventBallMovedOn,
  getEventBallOn,
  getEventBallPickedOn,
  getEventBallPickedOnFumble,
  getEventBallReturnedTo,
  getEventBallReturnedToOnFumble,
  getEventDefenceScorePlayer,
  getEventDeflectedPlayer,
  getEventDirection,
  getEventDistance,
  getEventDistanceMoved,
  getEventDistanceOnOffence,
  getEventDown,
  getEventDroppedPlayer,
  getEventFlaggedPlayer,
  getEventFumblePlayer,
  getEventFumbleRecoveredPlayer,
  getEventHash,
  getEventId,
  getEventInterceptedPlayer,
  getEventIsFumble,
  getEventIsFumbleRecovered,
  getEventKickOffPlayer,
  getEventKickPlayer,
  getEventNumber,
  getEventPatOnePlayer,
  getEventPlayResult,
  getEventPlayType,
  getEventPuntPlayer,
  getEventQb,
  getEventReceiverPlayer,
  getEventReturnPlayer,
  getEventRunPlayer,
  getEventSackPlayer,
  getEventScorePlayer,
  getEventScoreResult,
  getEventStrongSide,
  getEventTacklePlayer,
  getEventTeam,
  getQtr,
} from './football-event-helpers';

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
  const eventBallPickedOnFumble = getEventBallPickedOnFumble(
    eventsArray,
    index,
  );
  const eventBallReturnedToOnFumble = getEventBallReturnedToOnFumble(
    eventsArray,
    index,
  );
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

  if (eventBallPickedOnFumble !== undefined) {
    newEventData.ball_picked_on_fumble = eventBallPickedOnFumble;
  }

  if (eventBallReturnedToOnFumble !== undefined) {
    newEventData.ball_returned_to_on_fumble = eventBallReturnedToOnFumble;
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
