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
  IFootballPlayResult,
  IFootballPlayType,
  IFootballScoreResult,
} from '../../../type/football-event.type';
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
export const eventBallPickedOnFumbleKey = 'eventBallPickedOnFumble';
export const eventBallReturnedToOnFumbleKey = 'eventBallReturnedToOnFumble';
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
export const eventBallPickedOnFumble = (index: number) =>
  eventBallPickedOnFumbleKey + index;
export const eventBallReturnedToOnFumble = (index: number) =>
  eventBallReturnedToOnFumbleKey + index;
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

// EventBallPickedOnFumble
export function getEventBallPickedOnFumble(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventBallPickedOnFumbleKey,
  );
}

export function getEventBallPickedOnFumbleFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(
    form,
    index,
    eventBallPickedOnFumbleKey,
    arrayName,
  );
}

export function setBallPickedOnFumble(
  eventsArray: FormArray,
  index: number,
  selectedItem: number,
): void {
  setArrayKeyIndexValue(
    eventsArray,
    index,
    selectedItem,
    eventBallPickedOnFumbleKey,
  );
}

// EventBallReturnedToOnFumble
export function getEventBallReturnedToOnFumble(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventBallReturnedToOnFumbleKey,
  );
}

export function getEventBallReturnedToOnFumbleFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControlWithIndex(
    form,
    index,
    eventBallReturnedToOnFumbleKey,
    arrayName,
  );
}

export function setBallReturnedToOnFumble(
  eventsArray: FormArray,
  index: number,
  selectedItem: number,
): void {
  setArrayKeyIndexValue(
    eventsArray,
    index,
    selectedItem,
    eventBallReturnedToOnFumbleKey,
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
