import { FormArray } from '@angular/forms';
import { IEnumObject } from '../../../type/base.type';
import { IFootballPlayType } from '../../../type/football-event.type';
import {
  resetQb,
  resetReceiverPlayer,
  resetRunPlayer,
  setDown,
  setPlayType,
} from './football-event-helpers';
import { ITeam } from '../../../type/team.type';

export function onTeamChange(
  eventsArray: FormArray,
  selectedTeam: ITeam,
  index: number,
): void {
  let previousTeam = null;
  if (index > 0) {
    previousTeam = eventsArray.controls[index - 1].get(
      `eventTeam${index - 1}`,
    )?.value;
  }
  // console.log('teams', selectedTeam, previousTeam);
  if (!previousTeam || selectedTeam.id !== previousTeam.id) {
    // console.log('first down team change');
    setDown(eventsArray, index, 1);
    resetQb(eventsArray, index);
    // this.eventsArray.controls[index].get(`eventDown${index}`)?.setValue(1);
    // this.eventsArray.controls[index].get(`eventQb${index}`)?.setValue(null);
  }
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
