import { FormArray } from '@angular/forms';
import { IEnumObject } from '../../../type/base.type';
import {
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IFootballPlayType,
  IFootballScoreResult,
} from '../../../type/football-event.type';
import {
  getEventDown,
  resetDeflectedPlayer,
  resetDroppedPlayer,
  resetInterceptedPlayer,
  resetKickPlayer,
  resetPlayResult,
  resetPuntPlayer,
  resetQb,
  resetReceiverPlayer,
  resetRunPlayer,
  resetSackPlayer,
  resetScoreResult,
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
  max: number,
): void {
  // console.log(events, eventsArray, ballOn, index);
  const updatedDown = isFirstDown(events, ballOn, index, max);
  const currentDown = getEventDown(eventsArray, index);

  console.log('updatedDown', updatedDown);
  console.log('currentDown', currentDown);

  let updatedDistance;
  if (updatedDown === 1 && currentDown !== 1) {
    updatedDistance = 10;
  } else {
    updatedDistance = calculateDistance(events, ballOn, index, max);
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
  setFilteredScoreResults: (results: IEnumObject[]) => void,
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
        resetDeflectedPlayer(eventsArray, index);
        resetDroppedPlayer(eventsArray, index);
        resetInterceptedPlayer(eventsArray, index);
        resetSackPlayer(eventsArray, index);
        resetKickPlayer(eventsArray, index);
        break;
      case IFootballPlayType.Kick.toLowerCase():
        resetPuntPlayer(eventsArray, index);
        resetRunPlayer(eventsArray, index);
        resetReceiverPlayer(eventsArray, index);
        resetDroppedPlayer(eventsArray, index);
        resetDeflectedPlayer(eventsArray, index);
        resetInterceptedPlayer(eventsArray, index);
        resetSackPlayer(eventsArray, index);
        break;
      case IFootballPlayType.Punt.toLowerCase():
        resetRunPlayer(eventsArray, index);
        resetReceiverPlayer(eventsArray, index);
        resetDroppedPlayer(eventsArray, index);
        resetKickPlayer(eventsArray, index);
        resetDeflectedPlayer(eventsArray, index);
        resetInterceptedPlayer(eventsArray, index);
        resetSackPlayer(eventsArray, index);
    }

    setPlayType(eventsArray, index, selectedType);
  } else {
    // console.log('else play type');
    resetPuntPlayer(eventsArray, index);
    resetRunPlayer(eventsArray, index);
    resetReceiverPlayer(eventsArray, index);
    resetDeflectedPlayer(eventsArray, index);
    resetDroppedPlayer(eventsArray, index);
    resetKickPlayer(eventsArray, index);
    resetInterceptedPlayer(eventsArray, index);
    resetSackPlayer(eventsArray, index);
    setPlayType(eventsArray, index, selectedType);
  }

  resetPlayResult(eventsArray, index);
  resetScoreResult(eventsArray, index);

  const filteredResults = filterPlayResultsByType(
    selectedType.value as IFootballPlayType,
  );
  setFilteredPlayResults(
    filteredResults.map((result) => ({
      value: result,
      label: result,
    })),
  );

  const filteredScoreResults = filterScoreResultsByType(
    selectedType.value as IFootballPlayType,
  );
  setFilteredScoreResults(
    filteredScoreResults.map((result) => ({
      value: result,
      label: result,
    })),
  );
}

export function onPlayResultChange(
  eventsArray: FormArray,
  selectedResult: IEnumObject | null = null,
  index: number,
): void {
  console.log('selected result', selectedResult);
  if (selectedResult && selectedResult.value) {
    console.log('selected result value', selectedResult.value);

    switch (selectedResult.value.toLowerCase()) {
      case IFootballPlayResult.PassCompleted.toLowerCase():
        resetDeflectedPlayer(eventsArray, index);
        resetDroppedPlayer(eventsArray, index);
        resetInterceptedPlayer(eventsArray, index);
        resetSackPlayer(eventsArray, index);
        break;
      case IFootballPlayResult.PassDropped.toLowerCase():
        resetDeflectedPlayer(eventsArray, index);
        resetReceiverPlayer(eventsArray, index);
        resetInterceptedPlayer(eventsArray, index);
        resetSackPlayer(eventsArray, index);
        break;
      case IFootballPlayResult.PassDeflected.toLowerCase():
        resetDroppedPlayer(eventsArray, index);
        resetReceiverPlayer(eventsArray, index);
        resetInterceptedPlayer(eventsArray, index);
        resetSackPlayer(eventsArray, index);
        break;
      case IFootballPlayResult.PassIntercepted.toLowerCase():
        resetDroppedPlayer(eventsArray, index);
        resetReceiverPlayer(eventsArray, index);
        resetDeflectedPlayer(eventsArray, index);
        resetSackPlayer(eventsArray, index);
        break;
      case IFootballPlayResult.Sack.toLowerCase():
        resetDroppedPlayer(eventsArray, index);
        resetReceiverPlayer(eventsArray, index);
        resetDeflectedPlayer(eventsArray, index);
        resetInterceptedPlayer(eventsArray, index);
        break;
    }
  }
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
        IFootballPlayResult.Sack,
        IFootballPlayResult.Flag,
      ];
    case IFootballPlayType.Kick:
      return [
        IFootballPlayResult.None,
        IFootballPlayResult.Kick,
        IFootballPlayResult.KickBlocked,
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
        IFootballPlayResult.PuntBlocked,
        IFootballPlayResult.Flag,
      ];
    case IFootballPlayType.PatTwo:
      return [
        IFootballPlayResult.None,
        IFootballPlayResult.Run,
        IFootballPlayResult.PassCompleted,
        IFootballPlayResult.PassDropped,
        IFootballPlayResult.PassDeflected,
        IFootballPlayResult.PassIntercepted,
        IFootballPlayResult.Sack,
        IFootballPlayResult.Flag,
      ];
    default:
      return [];
  }
}

export function filterScoreResultsByType(
  scoreResult: IFootballPlayType,
): IFootballScoreResult[] {
  console.log('filterScoreResultsByType', scoreResult);
  switch (scoreResult) {
    case IFootballPlayType.Run:
      return [
        IFootballScoreResult.None,
        IFootballScoreResult.Td,
        IFootballScoreResult.TdDefence,
        IFootballScoreResult.Safety,
      ];
    case IFootballPlayType.Pass:
      return [
        IFootballScoreResult.None,
        IFootballScoreResult.Td,
        IFootballScoreResult.TdDefence,
        IFootballScoreResult.Safety,
      ];
    case IFootballPlayType.Kick:
      return [
        IFootballScoreResult.None,
        IFootballScoreResult.KickGood,
        IFootballScoreResult.KickMissed,
        IFootballScoreResult.Td,
        IFootballScoreResult.TdDefence,
        IFootballScoreResult.Safety,
      ];
    case IFootballPlayType.Kickoff:
      return [
        IFootballScoreResult.None,
        IFootballScoreResult.Td,
        IFootballScoreResult.TdDefence,
        IFootballScoreResult.Safety,
      ];
    case IFootballPlayType.Punt:
      return [
        IFootballScoreResult.None,
        IFootballScoreResult.Td,
        IFootballScoreResult.TdDefence,
        IFootballScoreResult.Safety,
      ];
    case IFootballPlayType.PatOne:
      return [
        IFootballScoreResult.None,
        IFootballScoreResult.PatOneGood,
        IFootballScoreResult.PatOneMissed,
        IFootballScoreResult.PatOneReturn,
      ];
    case IFootballPlayType.PatTwo:
      return [
        IFootballScoreResult.None,
        IFootballScoreResult.PatTwoGood,
        IFootballScoreResult.PatTwoMissed,
        IFootballScoreResult.PatTwoReturn,
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
    const newValue = num - step;
    setArrayKeyIndexValue(array, index, newValue, arrayKey);
    return newValue;
  }
  return null;
}

export function incrementOnBall(
  array: FormArray,
  index: number,
  num: number,
  step: number,
  min: number,
  max: number,
  arrayKey: string,
): number | null {
  if (num === undefined || num === null) {
    return null;
  }

  let newValue = num;

  if (num > 0) {
    newValue = num - step;

    // If the new value crosses over the max boundary to 0
    if (newValue > max) {
      newValue = min;
    }
  } else if (num < 0) {
    // Negative field
    newValue = num - step;

    // If the new value crosses over the min boundary to 0
    if (newValue < min) {
      newValue = max;
    }
  }

  // Set the new value in the array
  setArrayKeyIndexValue(array, index, newValue, arrayKey);
  return newValue;
}
