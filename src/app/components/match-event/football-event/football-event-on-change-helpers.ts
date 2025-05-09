import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IFootballPlayType,
  IFootballScoreResult,
} from '../../../type/football-event.type';
import {
  getEventBallReturnedTo,
  getEventDown,
  getEventKickPlayer,
  getEventPlayResult,
  getEventPlayType,
  getEventReceiverPlayer,
  getEventReturnPlayer,
  getEventRunPlayer,
  getEventScoreResult,
  getEventTeam,
  resetAssistTacklePlayer,
  resetDeflectedPlayer,
  resetDroppedPlayer,
  resetEventBallMovedOn,
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
  setBallReturnedTo,
  setDistance,
  setDown,
  setEventBallMovedOn,
  setEventPlayResult,
  setEventPlayType,
  setScorePlayer,
} from './football-event-helpers';
import { ITeam } from '../../../type/team.type';
import {
  calculateDistance,
  isFirstDown,
  isTenYardsPassed,
} from './football-event-calc-helpers';
import {
  patchFormGroupKeyValue,
  setArrayKeyIndexValue,
} from '../../../base/formHelpers';
import { IMatchWithFullData } from '../../../type/match.type';
import { IPlayerInMatchFullData } from '../../../type/player.type';

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
    resetEventBallMovedOn(eventsArray, index);
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
  // if (previousDown && isFlagResult(eventsArray, index - 1)) {
  //   setDown(eventsArray, index, previousDown);
  // } else {
  setDown(eventsArray, index, down);
  // }
}

export function changePlayResultOnPlayTypeChange(
  eventsArray: FormArray,
  index: number,
): void {
  if (eventsArray && index) {
    const playType = getEventPlayType(eventsArray, index);
    if (playType === IFootballPlayType.Run) {
      setEventPlayResult(eventsArray, index, IFootballPlayResult.Run);
    }
    if (playType === IFootballPlayType.PatOne) {
      setEventPlayResult(eventsArray, index, IFootballPlayResult.PatOne);
    }
    if (playType === IFootballPlayType.Kick) {
      setEventPlayResult(eventsArray, index, IFootballPlayResult.Kick);
    }
    if (playType === IFootballPlayType.Flag) {
      setEventPlayResult(eventsArray, index, IFootballPlayResult.Flag);
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
      if (eventScoreResult === IFootballScoreResult.Td) {
        setEventBallMovedOn(eventsArray, index, 0);
      }
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
  const lastEventTeam = getEventTeam(eventsArray, index - 1);
  const currentTeam = getEventTeam(eventsArray, index);
  const updatedDown = isFirstDown(events, ballOn, index, max);
  const currentDown = getEventDown(eventsArray, index);
  const lastEventResult = getEventPlayResult(eventsArray, index - 1);

  // console.log('updatedDown', updatedDown);
  // console.log('currentDown', currentDown);

  let updatedDistance;
  if (lastEventTeam && currentTeam && lastEventTeam.id === currentTeam.id) {
    if (updatedDown === 1 && currentDown !== 1) {
      updatedDistance = 10;
    } else {
      updatedDistance = calculateDistance(events, ballOn, index, max);
    }

    if (updatedDistance) {
      setDistance(eventsArray, index, updatedDistance);
    }

    if (updatedDown && lastEventResult !== IFootballPlayResult.Flag) {
      setDown(eventsArray, index, updatedDown);
    }
  }

  // console.log(currentDown, updatedDown, updatedDown);
}

export function onKickBallChange(
  eventsArray: FormArray,
  index: number,
  currentBallKickedTo: number,
): void {
  if (currentBallKickedTo !== null && currentBallKickedTo !== undefined) {
    const currentBallReturnedTo = getEventBallReturnedTo(eventsArray, index);
    setTimeout(() => {
      if (currentBallReturnedTo === null) {
        setBallReturnedTo(eventsArray, index, currentBallKickedTo);
      }
    }, 1000);
  }
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
    setEventPlayType(eventsArray, index, selectedType);
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

    setEventPlayType(eventsArray, index, selectedType);
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

// export function onScoreChange(
//   eventsArray: FormArray,
//   selectedScore: IFootballScoreResult | null = null,
//   index: number,
// ): void {
//   // console.log('selected result', selectedResult);
//   if (selectedScore) {
//     // console.log('selected result value', selectedResult);
//
//     switch (selectedScore.toLowerCase()) {
//       case IFootballScoreResult.Td.toLowerCase():
//         setBallMovedOn(eventsArray, index, 0);
//         break;
//     }
//   }
// }

export function filterPlayResultsByType(
  playType: IFootballPlayType | undefined | null,
): IFootballPlayResult[] {
  // console.log('filterPlayResultsByType', playType);
  switch (playType) {
    case IFootballPlayType.Flag:
      return [IFootballPlayResult.Flag];
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
        IFootballPlayResult.KickedOut,
        IFootballPlayResult.Flag,
        IFootballPlayResult.KickReturn,
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
        IFootballPlayResult.KickedOut,
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

export function incrementBallPositionRelativeCenter(
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
  // console.log('increment realativly', num, step, max);

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
): ITeam | null {
  let newEventTeam: ITeam | null = null;

  if (match && match.teams_data?.team_a && match.teams_data?.team_b) {
    const homeTeam = match.teams_data.team_a;
    const awayTeam = match.teams_data.team_b;
    if (lastEvent.offense_team?.id === homeTeam.id) {
      newEventTeam = awayTeam;
    } else if (lastEvent.offense_team?.id === awayTeam.id) {
      newEventTeam = homeTeam;
    }
  }

  return newEventTeam;
}

export function handleBasicTeamAndQbChange(
  match: IMatchWithFullData | null,
  lastEvent: IFootballEventWithPlayers,
): { newEventTeam: ITeam | null; newEventQb: IPlayerInMatchFullData | null } {
  let newEventTeam = handleBasicTeamChange(match, lastEvent);
  let newEventQb: IPlayerInMatchFullData | null = null;

  // if (match && match.teams_data?.team_a && match.teams_data?.team_b) {
  //   const homeTeam = match.teams_data.team_a;
  //   const awayTeam = match.teams_data.team_b;
  //   if (lastEvent.offense_team?.id === homeTeam.id) {
  //     newEventTeam = awayTeam;
  //   } else if (lastEvent.offense_team?.id === awayTeam.id) {
  //     newEventTeam = homeTeam;
  //   }
  // }

  return { newEventTeam, newEventQb };
}

export function handleTeamChangeOnTouchBack(
  match: IMatchWithFullData | null,
  lastEvent: IFootballEventWithPlayers,
): {
  newEventBallOn: number | null;
  newEventDown: number | null;
  newEventDistance: number | null;
  newEventTeam: ITeam | null;
  newEventQb: IPlayerInMatchFullData | null;
} {
  const { newEventTeam, newEventQb } = handleBasicTeamAndQbChange(
    match,
    lastEvent,
  );

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

export function handleTurnoverOnTouchBack(
  lastEvent: IFootballEventWithPlayers,
  match: IMatchWithFullData | null,
): {
  newEventDown: number | null;
  newEventDistance: number | null;
  newEventBallOn: number | null;
  newEventBallMovedOn: number | null;
  newEventTeam: ITeam | null;
  newEventQb: IPlayerInMatchFullData | null;
} {
  let newEventTeam = handleBasicTeamChange(match, lastEvent);

  return {
    newEventDown: 1,
    newEventDistance: 10,
    newEventBallOn: -20,
    newEventBallMovedOn: -20,
    newEventTeam,
    newEventQb: null,
  };
}

export function handleTurnoverOnInterception(
  match: IMatchWithFullData | null,
  lastEvent: IFootballEventWithPlayers,
  eventTurnoverContext: {
    newEventDown: number | null;
    newEventDistance: number | null;
    newEventBallOn: number | null;
    newEventBallMovedOn: number | null;
    newEventQb: IPlayerInMatchFullData | null;
  },
): {
  newEventDown: number | null;
  newEventDistance: number | null;
  newEventBallOn: number | null;
  newEventBallMovedOn: number | null;
  newEventTeam: ITeam | null;
  newEventQb: IPlayerInMatchFullData | null;
} {
  let newEventTeam = handleBasicTeamChange(match, lastEvent);
  let newEventDown = eventTurnoverContext.newEventDown;
  let newEventDistance = eventTurnoverContext.newEventDistance;
  let newEventBallOn = eventTurnoverContext.newEventBallOn;
  let newEventBallMovedOn = eventTurnoverContext.newEventBallMovedOn;
  let newEventQb = eventTurnoverContext.newEventQb;

  if (lastEvent.play_result === IFootballPlayResult.PassIntercepted) {
    if (lastEvent.ball_returned_to && !lastEvent.is_fumble) {
      return {
        newEventDown: 1,
        newEventDistance: 10,
        newEventBallOn: -lastEvent.ball_returned_to,
        newEventBallMovedOn: -lastEvent.ball_returned_to,
        newEventTeam,
        newEventQb: null,
      };
    }
    if (!lastEvent.is_fumble) {
      return {
        newEventDown: 1,
        newEventDistance: 10,
        newEventBallOn: null,
        newEventBallMovedOn: null,
        newEventTeam,
        newEventQb: null,
      };
    }

    if (lastEvent.is_fumble) {
      return handleTurnoverOnFumble(match, lastEvent, eventTurnoverContext);
    }
  }

  return {
    newEventDown,
    newEventDistance,
    newEventBallOn,
    newEventBallMovedOn,
    newEventTeam,
    newEventQb,
  };
}

export function handleTurnoverOnReturn(
  match: IMatchWithFullData | null,
  lastEvent: IFootballEventWithPlayers,
  eventTurnoverContext: {
    newEventDown: number | null;
    newEventDistance: number | null;
    newEventBallOn: number | null;
    newEventBallMovedOn: number | null;
    newEventQb: IPlayerInMatchFullData | null;
  },
): {
  newEventDown: number | null;
  newEventDistance: number | null;
  newEventBallOn: number | null;
  newEventBallMovedOn: number | null;
  newEventTeam: ITeam | null;
  newEventQb: IPlayerInMatchFullData | null;
} {
  let newEventTeam = handleBasicTeamChange(match, lastEvent);
  let newEventDown = eventTurnoverContext.newEventDown;
  let newEventDistance = eventTurnoverContext.newEventDistance;
  let newEventBallOn = eventTurnoverContext.newEventBallOn;
  let newEventBallMovedOn = eventTurnoverContext.newEventBallMovedOn;
  let newEventQb = eventTurnoverContext.newEventQb;

  if (
    lastEvent.play_result === IFootballPlayResult.PuntReturn ||
    lastEvent.play_result === IFootballPlayResult.KickOffReturn ||
    lastEvent.play_result === IFootballPlayResult.KickReturn ||
    lastEvent.play_result === IFootballPlayResult.KickedOut
  ) {
    if (lastEvent.ball_returned_to && !lastEvent.is_fumble) {
      return {
        newEventDown: 1,
        newEventDistance: 10,
        newEventBallOn: -lastEvent.ball_returned_to,
        newEventBallMovedOn: -lastEvent.ball_returned_to,
        newEventTeam,
        newEventQb: null,
      };
    }
    if (!lastEvent.is_fumble) {
      return {
        newEventDown: 1,
        newEventDistance: 10,
        newEventBallOn: null,
        newEventBallMovedOn: null,
        newEventTeam,
        newEventQb: null,
      };
    }

    if (lastEvent.is_fumble) {
      return handleTurnoverOnFumble(match, lastEvent, eventTurnoverContext);
    }
  }

  return {
    newEventDown,
    newEventDistance,
    newEventBallOn,
    newEventBallMovedOn,
    newEventTeam,
    newEventQb,
  };
}

export function handleTurnoverOnDown(
  match: IMatchWithFullData | null,
  lastEvent: IFootballEventWithPlayers,
  eventTurnoverContext: {
    newEventDown: number | null;
    newEventDistance: number | null;
    newEventBallOn: number | null;
    newEventBallMovedOn: number | null;
    newEventQb: IPlayerInMatchFullData | null;
  },
): {
  newEventDown: number | null;
  newEventDistance: number | null;
  newEventBallOn: number | null;
  newEventBallMovedOn: number | null;
  newEventTeam: ITeam | null;
  newEventQb: IPlayerInMatchFullData | null;
} {
  let newEventTeam = handleBasicTeamChange(match, lastEvent);
  let newEventDown = eventTurnoverContext.newEventDown;
  let newEventDistance = eventTurnoverContext.newEventDistance;
  let newEventBallOn = eventTurnoverContext.newEventBallOn;
  let newEventBallMovedOn = eventTurnoverContext.newEventBallMovedOn;
  let newEventQb = eventTurnoverContext.newEventQb;

  if (
    !isTenYardsPassed(lastEvent) &&
    lastEvent.event_down === 4 &&
    (lastEvent.play_type === IFootballPlayType.Run ||
      lastEvent.play_type === IFootballPlayType.Pass)
  ) {
    if (lastEvent.ball_moved_to) {
      newEventBallOn = -lastEvent.ball_moved_to;
      newEventDown = 1;
      newEventDistance = 10;
      return {
        newEventBallOn,
        newEventBallMovedOn: newEventBallOn,
        newEventDown,
        newEventDistance,
        newEventTeam,
        newEventQb: null,
      };
    }
    return {
      newEventBallOn: null,
      newEventBallMovedOn: null,
      newEventDown: 1,
      newEventDistance: 10,
      newEventQb: null,
      newEventTeam,
    };
  }
  return {
    newEventDown,
    newEventDistance,
    newEventBallOn,
    newEventBallMovedOn,
    newEventTeam,
    newEventQb,
  };
}

export function handleTurnoverOnFumble(
  match: IMatchWithFullData | null,
  lastEvent: IFootballEventWithPlayers,
  eventTurnoverContext: {
    newEventDown: number | null;
    newEventDistance: number | null;
    newEventBallOn: number | null;
    newEventBallMovedOn: number | null;
    newEventQb: IPlayerInMatchFullData | null;
  },
): {
  newEventDown: number | null;
  newEventDistance: number | null;
  newEventBallOn: number | null;
  newEventBallMovedOn: number | null;
  newEventTeam: ITeam | null;
  newEventQb: IPlayerInMatchFullData | null;
} {
  let newEventTeam = handleBasicTeamChange(match, lastEvent);
  let newEventDown = eventTurnoverContext.newEventDown;
  let newEventDistance = eventTurnoverContext.newEventDistance;
  let newEventBallOn = eventTurnoverContext.newEventBallOn;
  let newEventBallMovedOn = eventTurnoverContext.newEventBallMovedOn;
  let newEventQb = eventTurnoverContext.newEventQb;
  console.log('fumble');

  if (
    lastEvent.ball_returned_to_on_fumble &&
    lastEvent.is_fumble &&
    lastEvent.fumble_recovered_player?.match_player.team_id === newEventTeam?.id
  ) {
    newEventBallOn = -lastEvent.ball_returned_to_on_fumble;
    newEventBallMovedOn = -lastEvent.ball_returned_to_on_fumble;
    console.log(
      'fumble recovered by defence',
      newEventBallOn,
      newEventBallMovedOn,
    );
    return {
      newEventDown: 1,
      newEventDistance: 10,
      newEventBallOn,
      newEventBallMovedOn,
      newEventTeam,
      newEventQb,
    };
  } else if (
    lastEvent.offense_team &&
    lastEvent.ball_returned_to_on_fumble &&
    lastEvent.is_fumble &&
    lastEvent.fumble_recovered_player?.match_player.team_id !== newEventTeam?.id
  ) {
    newEventBallOn = lastEvent.ball_returned_to_on_fumble;
    newEventBallMovedOn = lastEvent.ball_returned_to_on_fumble;
    newEventTeam = lastEvent.offense_team;
    console.log(
      'fumble recovered by offence',
      newEventBallOn,
      newEventBallMovedOn,
    );
    return {
      newEventDown: null, // computeDown
      newEventDistance: null, // computeDistance
      newEventBallOn,
      newEventBallMovedOn,
      newEventTeam,
      newEventQb,
    };
  }

  return {
    newEventDown,
    newEventDistance,
    newEventBallOn,
    newEventBallMovedOn,
    newEventTeam,
    newEventQb,
  };
}

export function handleTeamChangeOnInterception(
  match: IMatchWithFullData | null,
  lastEvent: IFootballEventWithPlayers,
): {
  newEventBallOn: number | null;
  newEventTeam: ITeam | null;
} {
  const { newEventTeam, newEventQb } = handleBasicTeamAndQbChange(
    match,
    lastEvent,
  );
  let newEventBallOn: number | null = null;
  if (
    lastEvent.ball_returned_to &&
    lastEvent.play_result === IFootballPlayResult.PassIntercepted &&
    !lastEvent.is_fumble
  ) {
    newEventBallOn = lastEvent.ball_returned_to;
    return {
      newEventBallOn,
      newEventTeam,
    };
  }
  return {
    newEventBallOn,
    newEventTeam,
  };
}

export function handleTeamChangeOnFumble(
  match: IMatchWithFullData | null,
  lastEvent: IFootballEventWithPlayers,
): {
  newEventBallOn: number | null;
  newEventTeam: ITeam | null;
} {
  let { newEventTeam, newEventQb } = handleBasicTeamAndQbChange(
    match,
    lastEvent,
  );
  let newEventBallOn: number | null = null;
  if (
    lastEvent.ball_returned_to &&
    lastEvent.is_fumble &&
    lastEvent.fumble_recovered_player?.match_player.team_id === newEventTeam?.id
  ) {
    newEventBallOn = lastEvent.ball_returned_to;
    return {
      newEventBallOn,
      newEventTeam,
    };
  } else if (
    lastEvent.offense_team &&
    lastEvent.ball_returned_to &&
    lastEvent.is_fumble &&
    lastEvent.fumble_recovered_player?.match_player.team_id !== newEventTeam?.id
  ) {
    newEventBallOn = lastEvent.ball_returned_to;
    newEventTeam = lastEvent.offense_team;
    return { newEventBallOn, newEventTeam };
  }

  return {
    newEventBallOn,
    newEventTeam,
  };
}

export function handleTeamChangeOnDown(
  match: IMatchWithFullData | null,
  lastEvent: IFootballEventWithPlayers,
): {
  newEventBallOn: number | null;
  newEventDown: number | null;
  newEventDistance: number | null;
  newEventTeam: ITeam | null;
} {
  const { newEventTeam, newEventQb } = handleBasicTeamAndQbChange(
    match,
    lastEvent,
  );
  let newEventBallOn: number | null = null;
  let newEventDown: number | null = null;
  let newEventDistance: number | null = null;
  if (
    lastEvent.event_down === 4 &&
    (lastEvent.play_type === IFootballPlayType.Run ||
      lastEvent.play_type === IFootballPlayType.Pass)
  ) {
    if (
      lastEvent.distance_moved !== null &&
      lastEvent.distance_moved !== undefined &&
      lastEvent.event_distance !== null &&
      lastEvent.event_distance !== undefined &&
      lastEvent.ball_moved_to !== undefined &&
      lastEvent.ball_moved_to !== null &&
      lastEvent.distance_moved < lastEvent.event_distance
    ) {
      // console.log('change on down');
      newEventBallOn = -lastEvent.ball_moved_to;
      newEventDown = 1;
      newEventDistance = 10;

      return {
        newEventBallOn,
        newEventDown,
        newEventDistance,
        newEventTeam,
      };
    }
  }
  return { newEventBallOn, newEventDown, newEventDistance, newEventTeam };
}
