import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IEnumObject } from '../../../type/base.type';
import {
  getArrayFormDataByIndexAndKey,
  getFormControl,
  resetArrayKeyIndexValue,
  setArrayKeyIndexValue,
  setArrayValue,
} from '../../../base/formHelpers';
import { IPlayerInMatchFullData } from '../../../type/player.type';
import { ITeam } from '../../../type/team.type';
import {
  IFootballEvent,
  IFootballEventWithPlayers,
  IFootballPlayResult,
} from '../../../type/football-event.type';

export const eventIdKey = 'eventId';
export const eventNumberKey = 'eventNumber';
export const eventQtrKey = 'eventQtr';
export const eventBallOnKey = 'eventBallOn';
export const eventTeamKey = 'eventTeam';
export const eventQbKey = 'eventQb';
export const eventDownKey = 'eventDown';
export const eventDistanceKey = 'eventDistance';
export const eventHashKey = 'eventHash';
export const eventPlayTypeKey = 'eventPlayType';
export const eventPlayResultKey = 'eventPlayResult';
export const eventRunPlayerKey = 'eventRunPlayer';
export const eventReceiverPlayerKey = 'eventReceiverPlayer';
export const eventKickPlayerKey = 'eventKickPlayer';
export const eventPuntPlayerKey = 'eventPuntPlayer';

export const eventId = (index: number) => eventIdKey + index;
export const eventNumber = (index: number) => eventNumberKey + index;
export const eventQtr = (index: number) => eventQtrKey + index;
export const eventBallOn = (index: number) => eventBallOnKey + index;
export const eventTeam = (index: number) => eventTeamKey + index;
export const eventQb = (index: number) => eventQbKey + index;
export const eventDown = (index: number) => eventDownKey + index;
export const eventDistance = (index: number) => eventDistanceKey + index;
export const eventHash = (index: number) => eventHashKey + index;
export const eventPlayType = (index: number) => eventPlayTypeKey + index;
export const eventPlayResult = (index: number) => eventPlayResultKey + index;
export const eventRunPlayer = (index: number) => eventRunPlayerKey + index;
export const eventReceiverPlayer = (index: number) =>
  eventReceiverPlayerKey + index;

export const eventKickPlayer = (index: number) => eventKickPlayerKey + index;
export const eventPuntPlayer = (index: number) => eventPuntPlayerKey + index;

export function createNewEvent(
  lastEvent: IFootballEventWithPlayers | undefined,
  newEventCount: number,
): Partial<IFootballEventWithPlayers> {
  let newEventNumber: number | null;
  let newEventQtr: number | null;
  let newEventTeam: ITeam | null = null;
  let newEventQb: IPlayerInMatchFullData | null = null;
  let newEventBallOn: number | null = null;
  let newEventDown: number | null;
  let newEventDistance: number | null;

  if (lastEvent && lastEvent.event_number) {
    newEventNumber = lastEvent.event_number + 1;
  } else {
    newEventNumber = 1;
  }

  if (lastEvent && lastEvent.event_qtr) {
    newEventQtr = lastEvent.event_qtr;
  } else {
    newEventQtr = 1;
  }

  if (lastEvent && lastEvent.ball_on) {
    newEventBallOn = lastEvent.ball_on;
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
  } else {
    newEventDown = 1;
  }

  if (lastEvent && lastEvent.event_distance) {
    newEventDistance = lastEvent.event_distance;
  } else {
    newEventDistance = 10;
  }

  return {
    id: null,
    event_number: newEventNumber,
    event_qtr: newEventQtr,
    ball_on: newEventBallOn,
    offense_team: newEventTeam,
    event_qb: newEventQb,
    event_down: newEventDown,
    event_distance: newEventDistance,
    event_hash: null,
    play_type: null,
    play_result: null,
  };
}

export function extractEventData(
  eventsArray: FormArray,
  index: number,
): Partial<IFootballEvent> {
  const eventId = getEventId(eventsArray, index);
  const eventNumber = getEventNumber(eventsArray, index);
  const eventQtr = getQtr(eventsArray, index);
  const eventBallOn = getBallOn(eventsArray, index);
  const eventTeam = getEventTeam(eventsArray, index);
  const eventQb = getEventQb(eventsArray, index);
  const eventDown = getEventDown(eventsArray, index);
  const eventDistance = getEventDistance(eventsArray, index);
  const eventHash = getEventHash(eventsArray, index);
  const eventPlayType = getEventPlayType(eventsArray, index);
  const eventPlayResult = getEventPlayResult(eventsArray, index);
  const eventRunPlayer = getEventRunPlayer(eventsArray, index);
  const eventReceiverPlayer = getEventReceiverPlayer(eventsArray, index);
  const eventKickPlayer = getEventKickPlayer(eventsArray, index);
  const eventPuntPlayer = getEventPuntPlayer(eventsArray, index);

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

  if (eventTeam) {
    newEventData.offense_team = eventTeam.id;
  }

  if (eventQb) {
    newEventData.event_qb = eventQb.match_player.id;
  }

  if (eventDown !== undefined) {
    newEventData.event_down = eventDown;
  }

  if (eventDistance !== undefined) {
    newEventData.event_distance = eventDistance;
  }

  if (eventHash && eventHash.value) {
    newEventData.event_hash = eventHash.value.toLowerCase();
  }

  if (eventPlayType && eventPlayType.value) {
    newEventData.play_type = eventPlayType.value.toLowerCase();
  }

  if (eventPlayResult && eventPlayResult.value) {
    newEventData.play_result = eventPlayResult.value.toLowerCase();
  }

  if (eventRunPlayer) {
    newEventData.run_player = eventRunPlayer.match_player.id;
  }

  if (eventReceiverPlayer) {
    newEventData.pass_received_player = eventReceiverPlayer.match_player.id;
  }

  if (eventKickPlayer) {
    newEventData.kick_player = eventKickPlayer.match_player.id;
  }

  if (eventPuntPlayer) {
    newEventData.punt_player = eventPuntPlayer.match_player.id;
  }

  return newEventData;
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
  return getFormControl(form, index, eventNumberKey, arrayName);
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
  return getFormControl(form, index, eventQtrKey, arrayName);
}

// BallOn
export function getBallOn(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventBallOnKey,
  );
}

export function getBallOnFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControl(form, index, eventBallOnKey, arrayName);
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
  return getFormControl(form, index, eventTeamKey, arrayName);
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
  return getFormControl(form, index, eventQbKey, arrayName);
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
  return getFormControl(form, index, eventDownKey, arrayName);
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
  return getFormControl(form, index, eventDistanceKey, arrayName);
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
): IEnumObject | null | undefined {
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
  return getFormControl(form, index, eventHashKey, arrayName);
}

// EventPlayType
export function getEventPlayType(
  eventsArray: FormArray,
  index: number,
): IEnumObject | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventPlayTypeKey,
  );
}

export function getEventPlayTypeFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControl(form, index, eventPlayTypeKey, arrayName);
}

export function setPlayType(
  eventsArray: FormArray,
  index: number,
  selectedType: IEnumObject,
): void {
  setArrayValue(eventsArray, index, selectedType, eventPlayTypeKey);
}

// EventPlayResult
export function getEventPlayResult(
  eventsArray: FormArray,
  index: number,
): IEnumObject | null | undefined {
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
  return getFormControl(form, index, eventPlayResultKey, arrayName);
}

export function resetPlayResult(eventsArray: FormArray, index: number): void {
  resetArrayKeyIndexValue(eventsArray, index, eventPlayResultKey);
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
  return getFormControl(form, index, eventRunPlayerKey, arrayName);
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
  return getFormControl(form, index, eventReceiverPlayerKey, arrayName);
}

export function resetReceiverPlayer(
  eventsArray: FormArray,
  index: number,
): void {
  resetArrayKeyIndexValue(eventsArray, index, eventReceiverPlayerKey);
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
  return getFormControl(form, index, eventKickPlayerKey, arrayName);
}

export function resetKickPlayer(eventsArray: FormArray, index: number): void {
  resetArrayKeyIndexValue(eventsArray, index, eventKickPlayerKey);
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
  return getFormControl(form, index, eventPuntPlayerKey, arrayName);
}

export function resetPuntPlayer(eventsArray: FormArray, index: number): void {
  resetArrayKeyIndexValue(eventsArray, index, eventPuntPlayerKey);
}

// export function onPlayTypeChange(
//   eventsArray: FormArray,
//   selectedType: IEnumObject,
//   index: number,
// ): void {
//   if (!selectedType) {
//     return;
//   }
//   console.log('selected type', selectedType);
//   if (selectedType.value) {
//     console.log('selected type value', selectedType.value);
//
//     switch (selectedType.value.toLowerCase()) {
//       case IFootballPlayType.Pass.toLowerCase():
//         resetRunPlayer(eventsArray, index);
//         break;
//       case IFootballPlayType.Run.toLowerCase():
//         resetReceiverPlayer(eventsArray, index);
//         break;
//     }
//
//     setPlayType(eventsArray, index, selectedType);
//   } else {
//     resetRunPlayer(eventsArray, index);
//     resetReceiverPlayer(eventsArray, index);
//     setPlayType(eventsArray, index, selectedType);
//   }
// }
