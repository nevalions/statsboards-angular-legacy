import { FormArray } from '@angular/forms';
import { IEnumObject } from '../../../type/base.type';
import { IFootballPlayType } from '../../../type/football-event.type';

export const eventId = (index: number) => `eventId${index}`;
export const eventNumber = (index: number) => `eventNumber${index}`;
export const eventQtr = (index: number) => `eventQtr${index}`;
export const eventBallOn = (index: number) => `eventBallOn${index}`;
export const eventTeam = (index: number) => `eventTeam${index}`;
export const eventQb = (index: number) => `eventQb${index}`;
export const eventDown = (index: number) => `eventDown${index}`;
export const eventDistance = (index: number) => `eventDistance${index}`;
export const eventHash = (index: number) => `eventHash${index}`;
export const eventPlayType = (index: number) => `eventPlayType${index}`;
export const eventPlayResult = (index: number) => `eventPlayResult${index}`;
export const eventRunPlayer = (index: number) => `eventRunPlayer${index}`;
export const eventReceiverPlayer = (index: number) =>
  `eventReceiverPlayer${index}`;

export function resetRunPlayer(eventsArray: FormArray, index: number): void {
  eventsArray.controls[index].get(`eventRunPlayer${index}`)?.setValue(null);
}

export function resetReceiverPlayer(
  eventsArray: FormArray,
  index: number,
): void {
  eventsArray.controls[index]
    .get(`eventReceiverPlayer${index}`)
    ?.setValue(null);
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
