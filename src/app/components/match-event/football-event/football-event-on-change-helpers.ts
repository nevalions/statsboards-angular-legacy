import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IFootballPlayType,
  IFootballScoreResult,
} from '../../../type/football-event.type';
import {
  getEventDown,
  getEventKickPlayer,
  getEventPlayType,
  getEventReceiverPlayer,
  getEventReturnPlayer,
  getEventRunPlayer,
  getEventScoreResult,
  resetAssistTacklePlayer,
  resetDeflectedPlayer,
  resetDroppedPlayer,
  resetInterceptedPlayer,
  resetKickOffPlayer,
  resetKickPlayer,
  resetPatOnePlayer,
  resetPlayResult,
  resetPuntPlayer,
  resetQb,
  resetReceiverPlayer,
  resetReturnPlayer,
  resetRunPlayer,
  resetSackPlayer,
  resetScorePlayer,
  resetScoreResult,
  resetTacklePlayer,
  setDistance,
  setDown,
  setPlayResult,
  setPlayType,
  setScorePlayer,
} from './football-event-helpers';
import { ITeam } from '../../../type/team.type';
import { calculateDistance, isFirstDown } from './football-event-calc-helpers';
import {
  patchFormGroupKeyValue,
  setArrayKeyIndexValue,
} from '../../../base/formHelpers';
import { IMatchWithFullData } from '../../../type/match.type';
import { IPlayerInMatchFullData } from '../../../type/player.type';
import { isFlagResult } from './football-event-isPlayTypeOrResult-helper';

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
    setDistance(eventsArray, index, 10);
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
  if (previousDown && isFlagResult(eventsArray, index - 1)) {
    setDown(eventsArray, index, previousDown);
  } else {
    setDown(eventsArray, index, down);
  }
}

export function changePlayResultOnPlayTypeChange(
  eventsArray: FormArray,
  index: number,
): void {
  if (eventsArray && index) {
    const playType = getEventPlayType(eventsArray, index);
    if (playType === IFootballPlayType.Run) {
      setPlayResult(eventsArray, index, IFootballPlayResult.Run);
    }
    if (playType === IFootballPlayType.PatOne) {
      setPlayResult(eventsArray, index, IFootballPlayResult.PatOne);
    }
    if (playType === IFootballPlayType.Kick) {
      setPlayResult(eventsArray, index, IFootballPlayResult.Kick);
    }
  }
}

export function onOffenceScore(eventsArray: FormArray, index: number): void {
  const eventScoreResult: IFootballScoreResult | null | undefined =
    getEventScoreResult(eventsArray, index);
  const eventPlayType: IFootballPlayType | null | undefined = getEventPlayType(
    eventsArray,
    index,
  );
  const eventReceiver: IPlayerInMatchFullData | null | undefined =
    getEventReceiverPlayer(eventsArray, index);
  const eventRusher: IPlayerInMatchFullData | null | undefined =
    getEventRunPlayer(eventsArray, index);
  const eventKicker: IPlayerInMatchFullData | null | undefined =
    getEventKickPlayer(eventsArray, index);
  const eventReturner: IPlayerInMatchFullData | null | undefined =
    getEventReturnPlayer(eventsArray, index);
  if (!eventScoreResult) {
    resetScorePlayer(eventsArray, index);
  }
  if (eventsArray && index && eventScoreResult) {
    if (
      eventScoreResult === IFootballScoreResult.Td ||
      eventScoreResult === IFootballScoreResult.PatTwoGood ||
      eventPlayType === IFootballPlayType.Punt
    ) {
      if (
        eventPlayType === IFootballPlayType.Pass &&
        getEventReceiverPlayer(eventsArray, index)
      ) {
        setScorePlayer(eventsArray, index, eventReceiver);
      }
      if (eventPlayType === IFootballPlayType.Run && eventRusher) {
        setScorePlayer(eventsArray, index, eventRusher);
      }
      if (eventPlayType === IFootballPlayType.Kickoff && eventReturner) {
        setScorePlayer(eventsArray, index, eventReturner);
      }
      if (eventPlayType === IFootballPlayType.Punt && eventReturner) {
        setScorePlayer(eventsArray, index, eventReturner);
      }
    }
  }
  if (
    eventScoreResult === IFootballScoreResult.KickGood ||
    eventScoreResult === IFootballScoreResult.PatOneGood
  ) {
    if (
      (eventKicker && eventPlayType === IFootballPlayType.Kick) ||
      IFootballPlayType.PatOne
    ) {
      setScorePlayer(eventsArray, index, eventKicker);
    }
  }
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

  // console.log('updatedDown', updatedDown);
  // console.log('currentDown', currentDown);

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
  selectedType: IFootballPlayType | null | undefined,
  index: number,
): void {
  if (!selectedType) {
    return;
  }
  // console.log('selected type', selectedType);
  if (selectedType) {
    // console.log('selected type', selectedType);

    switch (selectedType.toLowerCase()) {
      case IFootballPlayType.Pass.toLowerCase():
        resetRunPlayer(eventsArray, index);
        resetPuntPlayer(eventsArray, index);
        resetKickPlayer(eventsArray, index);
        resetKickOffPlayer(eventsArray, index);
        resetReturnPlayer(eventsArray, index);
        resetPatOnePlayer(eventsArray, index);
        resetPuntPlayer(eventsArray, index);
        resetScorePlayer(eventsArray, index);
        break;
      case IFootballPlayType.Run.toLowerCase():
        resetPuntPlayer(eventsArray, index);
        resetReceiverPlayer(eventsArray, index);
        resetDeflectedPlayer(eventsArray, index);
        resetDroppedPlayer(eventsArray, index);
        resetInterceptedPlayer(eventsArray, index);
        resetSackPlayer(eventsArray, index);
        resetKickPlayer(eventsArray, index);
        resetKickOffPlayer(eventsArray, index);
        resetPatOnePlayer(eventsArray, index);
        resetPuntPlayer(eventsArray, index);
        resetScorePlayer(eventsArray, index);
        break;
      case IFootballPlayType.Kick.toLowerCase():
        resetQb(eventsArray, index);
        resetPuntPlayer(eventsArray, index);
        resetRunPlayer(eventsArray, index);
        resetReceiverPlayer(eventsArray, index);
        resetDroppedPlayer(eventsArray, index);
        resetDeflectedPlayer(eventsArray, index);
        resetInterceptedPlayer(eventsArray, index);
        resetSackPlayer(eventsArray, index);
        resetKickOffPlayer(eventsArray, index);
        resetReturnPlayer(eventsArray, index);
        resetPatOnePlayer(eventsArray, index);
        resetPuntPlayer(eventsArray, index);
        resetScorePlayer(eventsArray, index);
        break;
      case IFootballPlayType.PatOne.toLowerCase():
        resetQb(eventsArray, index);
        resetPuntPlayer(eventsArray, index);
        resetRunPlayer(eventsArray, index);
        resetReceiverPlayer(eventsArray, index);
        resetDroppedPlayer(eventsArray, index);
        resetDeflectedPlayer(eventsArray, index);
        resetInterceptedPlayer(eventsArray, index);
        resetSackPlayer(eventsArray, index);
        resetKickPlayer(eventsArray, index);
        resetKickOffPlayer(eventsArray, index);
        resetReturnPlayer(eventsArray, index);
        resetPuntPlayer(eventsArray, index);
        resetScorePlayer(eventsArray, index);
        break;
      case IFootballPlayType.Kickoff.toLowerCase():
        resetQb(eventsArray, index);
        resetPuntPlayer(eventsArray, index);
        resetRunPlayer(eventsArray, index);
        resetReceiverPlayer(eventsArray, index);
        resetDroppedPlayer(eventsArray, index);
        resetDeflectedPlayer(eventsArray, index);
        resetInterceptedPlayer(eventsArray, index);
        resetSackPlayer(eventsArray, index);
        resetKickPlayer(eventsArray, index);
        resetPatOnePlayer(eventsArray, index);
        resetPuntPlayer(eventsArray, index);
        resetScorePlayer(eventsArray, index);
        break;
      case IFootballPlayType.Punt.toLowerCase():
        resetQb(eventsArray, index);
        resetRunPlayer(eventsArray, index);
        resetReceiverPlayer(eventsArray, index);
        resetDroppedPlayer(eventsArray, index);
        resetKickPlayer(eventsArray, index);
        resetDeflectedPlayer(eventsArray, index);
        resetInterceptedPlayer(eventsArray, index);
        resetSackPlayer(eventsArray, index);
        resetKickOffPlayer(eventsArray, index);
        resetPatOnePlayer(eventsArray, index);
        resetScorePlayer(eventsArray, index);
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
    resetReturnPlayer(eventsArray, index);
    resetInterceptedPlayer(eventsArray, index);
    resetSackPlayer(eventsArray, index);
    resetKickOffPlayer(eventsArray, index);
    resetPatOnePlayer(eventsArray, index);
    resetPuntPlayer(eventsArray, index);
    resetScorePlayer(eventsArray, index);

    setPlayType(eventsArray, index, selectedType);
  }

  resetPlayResult(eventsArray, index);
  resetScoreResult(eventsArray, index);
}

export function onPlayResultChange(
  eventsArray: FormArray,
  selectedResult: IFootballPlayResult | null = null,
  index: number,
): void {
  // console.log('selected result', selectedResult);
  if (selectedResult) {
    // console.log('selected result value', selectedResult);

    switch (selectedResult.toLowerCase()) {
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
        resetAssistTacklePlayer(eventsArray, index);
        resetTacklePlayer(eventsArray, index);
        break;
      case IFootballPlayResult.PassDeflected.toLowerCase():
        resetDroppedPlayer(eventsArray, index);
        resetReceiverPlayer(eventsArray, index);
        resetInterceptedPlayer(eventsArray, index);
        resetSackPlayer(eventsArray, index);
        resetAssistTacklePlayer(eventsArray, index);
        resetTacklePlayer(eventsArray, index);
        break;
      case IFootballPlayResult.PassIntercepted.toLowerCase():
        resetDroppedPlayer(eventsArray, index);
        resetReceiverPlayer(eventsArray, index);
        resetDeflectedPlayer(eventsArray, index);
        resetSackPlayer(eventsArray, index);
        resetAssistTacklePlayer(eventsArray, index);
        resetTacklePlayer(eventsArray, index);
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
  playType: IFootballPlayType | undefined | null,
): IFootballPlayResult[] {
  // console.log('filterPlayResultsByType', playType);
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
        IFootballPlayResult.PassIncomplete,
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
        IFootballPlayResult.TouchBack,
        IFootballPlayResult.KickOffReturn,
        IFootballPlayResult.Flag,
      ];
    case IFootballPlayType.Punt:
      return [
        IFootballPlayResult.None,
        IFootballPlayResult.TouchBack,
        IFootballPlayResult.PuntReturn,
        IFootballPlayResult.PuntBlocked,
        IFootballPlayResult.Flag,
      ];
    case IFootballPlayType.PatOne:
      return [
        IFootballPlayResult.None,
        IFootballPlayResult.PatOne,
        IFootballPlayResult.Flag,
      ];
    case IFootballPlayType.PatTwo:
      return [
        IFootballPlayResult.None,
        IFootballPlayResult.Run,
        IFootballPlayResult.PassCompleted,
        IFootballPlayResult.PassIncomplete,
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
  scoreResult: IFootballPlayType | undefined | null,
): IFootballScoreResult[] {
  // console.log('filterScoreResultsByType', scoreResult);
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

export function incrementNumberInFormGroup(
  formGroup: FormGroup,
  num: number,
  step: number,
  arrayKey: string,
): number | null {
  if (num !== undefined && num !== null) {
    const newValue = num + step;
    patchFormGroupKeyValue(formGroup, newValue, arrayKey);
    return newValue;
  }
  return null;
}

export function incrementNumberWithArrayAndIndex(
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

export function incrementOnBall(
  control: FormControl,
  array: FormArray,
  index: number,
  num: number,
  step: number,
  max: number,
  arrayKey: string,
): number | null {
  if (num === undefined || num === null) {
    return null;
  }

  let newValue = num;
  let min = -(max - 1);

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

  if (control && !control.disabled) {
    const value = control.value || 0;
    // console.log(value, newValue);
    if (value !== newValue) {
      control.markAsDirty();
    }
  }

  // Set the new value in the array
  setArrayKeyIndexValue(array, index, newValue, arrayKey);
  return newValue;
}

export function handleBasicTeamChange(
  match: IMatchWithFullData | null,
  lastEvent: IFootballEventWithPlayers,
): { newEventTeam: ITeam | null; newEventQb: any } {
  let newEventTeam: ITeam | null = null;
  let newEventQb = null;

  if (match && match.teams_data?.team_a && match.teams_data?.team_b) {
    const homeTeam = match.teams_data.team_a;
    const awayTeam = match.teams_data.team_b;
    if (lastEvent.offense_team?.id === homeTeam.id) {
      newEventTeam = awayTeam;
    } else if (lastEvent.offense_team?.id === awayTeam.id) {
      newEventTeam = homeTeam;
    }
  }

  return { newEventTeam, newEventQb };
}

export function handleTeamChangeOnTouchBack(
  match: IMatchWithFullData | null,
  lastEvent: IFootballEventWithPlayers,
): {
  newEventBallOn: number;
  newEventDown: number;
  newEventDistance: number;
  newEventTeam: ITeam | null;
  newEventQb: any;
} {
  const { newEventTeam, newEventQb } = handleBasicTeamChange(match, lastEvent);

  const newEventBallOn = -20;
  const newEventDown = 1;
  const newEventDistance = 10;

  return {
    newEventBallOn,
    newEventDown,
    newEventDistance,
    newEventTeam,
    newEventQb,
  };
}
