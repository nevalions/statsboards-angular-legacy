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

export function setPlayType(
  eventsArray: FormArray,
  index: number,
  selectedType: IEnumObject,
): void {
  setArrayValue(eventsArray, index, selectedType, eventPlayTypeKey);
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
