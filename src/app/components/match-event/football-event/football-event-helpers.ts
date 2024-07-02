import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IEnumObject } from '../../../type/base.type';
import { IFootballPlayType } from '../../../type/football-event.type';
import {
  getArrayFormDataByIndexAndKey,
  getFormControl,
} from '../../../base/formHelpers';

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
