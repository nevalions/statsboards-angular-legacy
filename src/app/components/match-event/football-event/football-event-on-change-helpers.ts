import { FormArray } from '@angular/forms';
import { IEnumObject } from '../../../type/base.type';
import {
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IFootballPlayType,
} from '../../../type/football-event.type';
import {
  getEventDown,
  resetKickPlayer,
  resetPlayResult,
  resetPuntPlayer,
  resetQb,
  resetReceiverPlayer,
  resetRunPlayer,
  setDistance,
  setDown,
  setPlayType,
} from './football-event-helpers';
import { ITeam } from '../../../type/team.type';
import { calculateDistance, isFirstDown } from './football-event-calc-helpers';
import { setArrayKeyIndexValue } from '../../../base/formHelpers';

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
  }
}

export function onDownChange(
  eventsArray: FormArray,
  down: number,
  index: number,
): void {
  let previousDown = null;
  if (index > 0) {
    previousDown = getEventDown(eventsArray, index - 1);
  }
  // console.log('downs', down, previousDown);
  if (down === 1 && previousDown !== 1) {
    // console.log('first down on down change');
    setDistance(eventsArray, index, 10);
  }
  setDown(eventsArray, index, down);
}

export function onBallOnChange(
  events: IFootballEventWithPlayers[] | null,
  eventsArray: FormArray,
  ballOn: number,
  index: number,
): void {
  // console.log(events, eventsArray, ballOn, index);
  const updatedDown = isFirstDown(events, ballOn, index);
  const currentDown = getEventDown(eventsArray, index);

  let updatedDistance;
  if (updatedDown === 1 && currentDown !== 1) {
    updatedDistance = 10;
  } else {
    updatedDistance = calculateDistance(events, ballOn, index);
  }

  if (updatedDistance) {
    setDistance(eventsArray, index, updatedDistance);
  }

  if (updatedDown) {
    setDown(eventsArray, index, updatedDown);
  }

  // console.log(currentDown, updatedDown, updatedDown);
}

export function onPlayTypeChange(
  eventsArray: FormArray,
  selectedType: IEnumObject,
  index: number,
  setFilteredPlayResults: (results: IEnumObject[]) => void,
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
        resetPuntPlayer(eventsArray, index);
        resetKickPlayer(eventsArray, index);
        break;
      case IFootballPlayType.Run.toLowerCase():
        resetPuntPlayer(eventsArray, index);
        resetReceiverPlayer(eventsArray, index);
        resetKickPlayer(eventsArray, index);
        break;
      case IFootballPlayType.Kick.toLowerCase():
        resetPuntPlayer(eventsArray, index);
        resetRunPlayer(eventsArray, index);
        resetReceiverPlayer(eventsArray, index);
        break;
      case IFootballPlayType.Punt.toLowerCase():
        resetRunPlayer(eventsArray, index);
        resetReceiverPlayer(eventsArray, index);
        resetKickPlayer(eventsArray, index);
    }

    setPlayType(eventsArray, index, selectedType);
  } else {
    console.log('else play type');
    resetPuntPlayer(eventsArray, index);
    resetRunPlayer(eventsArray, index);
    resetReceiverPlayer(eventsArray, index);
    resetKickPlayer(eventsArray, index);
    setPlayType(eventsArray, index, selectedType);
  }

  resetPlayResult(eventsArray, index);

  const filteredResults = filterPlayResultsByType(
    selectedType.value as IFootballPlayType,
  );
  setFilteredPlayResults(
    filteredResults.map((result) => ({
      value: result,
      label: result,
    })),
  );
}

export function filterPlayResultsByType(
  playType: IFootballPlayType,
): IFootballPlayResult[] {
  console.log('filterPlayResultsByType', playType);
  switch (playType) {
    case IFootballPlayType.Run:
      return [
        IFootballPlayResult.None,
        IFootballPlayResult.Run,
        IFootballPlayResult.Flag,
      ];
    case IFootballPlayType.Pass:
      return [
        IFootballPlayResult.None,
        IFootballPlayResult.PassCompleted,
        IFootballPlayResult.PassDropped,
        IFootballPlayResult.PassDeflected,
        IFootballPlayResult.PassIntercepted,
        IFootballPlayResult.Flag,
      ];
    case IFootballPlayType.Kick:
      return [
        IFootballPlayResult.None,
        IFootballPlayResult.KickGood,
        IFootballPlayResult.KickMissed,
        IFootballPlayResult.Flag,
      ];
    case IFootballPlayType.Kickoff:
      return [
        IFootballPlayResult.None,
        IFootballPlayResult.KickOffReturn,
        IFootballPlayResult.Flag,
      ];
    case IFootballPlayType.Punt:
      return [
        IFootballPlayResult.None,
        IFootballPlayResult.PuntReturn,
        IFootballPlayResult.Flag,
      ];
    case IFootballPlayType.PatOne:
      return [
        IFootballPlayResult.None,
        IFootballPlayResult.PatOneGood,
        IFootballPlayResult.PatOneMissed,
        IFootballPlayResult.Flag,
      ];
    case IFootballPlayType.PatTwo:
      return [
        IFootballPlayResult.None,
        IFootballPlayResult.PatTwoGood,
        IFootballPlayResult.PatTwoMissed,
        IFootballPlayResult.Flag,
      ];
    default:
      return [];
  }
}

export function incrementNumber(
  array: FormArray,
  index: number,
  num: number,
  step: number,
  arrayKey: string,
): number | null {
  if (num !== undefined && num !== null) {
    const newValue = num + step;
    setArrayKeyIndexValue(array, index, newValue, arrayKey);
    return newValue;
  }
  return null;
}
