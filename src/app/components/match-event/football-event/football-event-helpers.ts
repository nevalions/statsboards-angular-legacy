import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IEnumObject } from '../../../type/base.type';
import { IFootballPlayType } from '../../../type/football-event.type';
import {
  getArrayFormDataByIndexAndKey,
  getFormControl,
} from '../../../base/formHelpers';
import { IPlayerInMatchFullData } from '../../../type/player.type';
import { ITeam } from '../../../type/team.type';

export const eventIdString = 'eventId';
export const eventNumberString = 'eventNumber';
export const eventQtrString = 'eventQtr';
export const eventBallOnString = 'eventBallOn';
export const eventTeamString = 'eventTeam';
export const eventQbString = 'eventQb';
export const eventDownString = 'eventDown';
export const eventDistanceString = 'eventDistance';
export const eventHashString = 'eventHash';
export const eventPlayTypeString = 'eventPlayType';
export const eventPlayResultString = 'eventPlayResult';
export const eventRunPlayerString = 'eventRunPlayer';
export const eventReceiverPlayerString = 'eventReceiverPlayer';

export const eventId = (index: number) => eventIdString + index;
export const eventNumber = (index: number) => eventNumberString + index;
export const eventQtr = (index: number) => eventQtrString + index;
export const eventBallOn = (index: number) => eventBallOnString + index;
export const eventTeam = (index: number) => eventTeamString + index;
export const eventQb = (index: number) => eventQbString + index;
export const eventDown = (index: number) => eventDownString + index;
export const eventDistance = (index: number) => eventDistanceString + index;
export const eventHash = (index: number) => eventHashString + index;
export const eventPlayType = (index: number) => eventPlayTypeString + index;
export const eventPlayResult = (index: number) => eventPlayResultString + index;
export const eventRunPlayer = (index: number) => eventRunPlayerString + index;
export const eventReceiverPlayer = (index: number) =>
  eventReceiverPlayerString + index;

// EVENT NUMBER
export function getEventNumber(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventNumberString,
  );
}

export function getEventNumberFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControl(form, index, eventNumberString, arrayName);
}

// QTR
export function getQtr(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventQtrString,
  );
}

export function getQtrFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControl(form, index, eventQtrString, arrayName);
}

// BallOn
export function getBallOn(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventBallOnString,
  );
}

export function getBallOnFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControl(form, index, eventBallOnString, arrayName);
}

// EventTeam
export function getEventTeam(
  eventsArray: FormArray,
  index: number,
): ITeam | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventTeamString,
  );
}

export function getEventTeamFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControl(form, index, eventTeamString, arrayName);
}

// EventQb
export function getEventQb(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventQbString,
  );
}

export function getEventQbFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControl(form, index, eventQbString, arrayName);
}

// EventDown
export function getEventDown(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventDownString,
  );
}

export function getEventDownFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControl(form, index, eventDownString, arrayName);
}

// EventDistance
export function getEventDistance(
  eventsArray: FormArray,
  index: number,
): number | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventDistanceString,
  );
}

export function getEventDistanceFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControl(form, index, eventDistanceString, arrayName);
}

// EventHash
export function getEventHash(
  eventsArray: FormArray,
  index: number,
): IEnumObject | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventHashString,
  );
}

export function getEventHashFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControl(form, index, eventHashString, arrayName);
}

// EventPlayType
export function getEventPlayType(
  eventsArray: FormArray,
  index: number,
): IEnumObject | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventPlayTypeString,
  );
}

export function getEventPlayTypeFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControl(form, index, eventPlayTypeString, arrayName);
}

// EventPlayResult
export function getEventPlayResult(
  eventsArray: FormArray,
  index: number,
): IEnumObject | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventPlayResultString,
  );
}

export function getEventPlayResultFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControl(form, index, eventPlayResultString, arrayName);
}

// EventRunPlayer
export function getEventRunPlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventRunPlayerString,
  );
}

export function getEventRunPlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControl(form, index, eventRunPlayerString, arrayName);
}

// EventReceiverPlayer
export function getEventReceiverPlayer(
  eventsArray: FormArray,
  index: number,
): IPlayerInMatchFullData | null | undefined {
  return getArrayFormDataByIndexAndKey<number>(
    eventsArray,
    index,
    eventReceiverPlayerString,
  );
}

export function getEventReceiverPlayerFormControl(
  form: FormGroup,
  arrayName: string,
  index: number,
): FormControl | null | undefined {
  return getFormControl(form, index, eventReceiverPlayerString, arrayName);
}

export function resetRunPlayer(eventsArray: FormArray, index: number): void {
  eventsArray.controls[index].get(eventRunPlayer(index))?.setValue(null);
}

export function resetReceiverPlayer(
  eventsArray: FormArray,
  index: number,
): void {
  eventsArray.controls[index].get(eventReceiverPlayer(index))?.setValue(null);
}

export function setPlayType(
  eventsArray: FormArray,
  index: number,
  selectedType: IEnumObject,
): void {
  eventsArray.controls[index].get(`eventPlayType`)?.setValue(selectedType);
}

export function onPlayTypeChange(
  eventsArray: FormArray,
  selectedType: IEnumObject,
  index: number,
): void {
  if (!selectedType) {
    return;
  }
  console.log('selected type', selectedType);
  if (selectedType.value) {
    console.log('selected type value', selectedType.value);

    switch (selectedType.value.toLowerCase()) {
      case IFootballPlayType.Pass.toLowerCase():
        resetRunPlayer(eventsArray, index);
        break;
      case IFootballPlayType.Run.toLowerCase():
        resetReceiverPlayer(eventsArray, index);
        break;
    }

    setPlayType(eventsArray, index, selectedType);
  } else {
    resetRunPlayer(eventsArray, index);
    resetReceiverPlayer(eventsArray, index);
    setPlayType(eventsArray, index, selectedType);
  }
}
