import { FormArray } from '@angular/forms';
import {
  getEventBallMovedOn,
  getEventBallOn,
  getEventDown,
  getEventIsFumble,
  getEventPlayResult,
  getEventPlayType,
  getEventScoreResult,
  getEventTeam,
} from './football-event-helpers';
import {
  IFootballPlayResult,
  IFootballPlayType,
  IFootballScoreResult,
} from '../../../type/football-event.type';

export function isPrevBallMovedEqualCurrentBallOn(
  eventArray: FormArray,
  index: number,
): boolean {
  const currentTeam = getEventTeam(eventArray, index);
  const prevTeam = getEventTeam(eventArray, index - 1);
  const prevScoreResult = getEventScoreResult(eventArray, index - 1);
  const currentBallOn = getEventBallOn(eventArray, index);
  const prevBallMovedOn = getEventBallMovedOn(eventArray, index - 1);
  const prevPlayType = getEventPlayType(eventArray, index - 1);
  const prevIsFumble = getEventIsFumble(eventArray, index - 1);
  if (currentBallOn === prevBallMovedOn) {
    return true;
  } else if (
    currentTeam?.id !== prevTeam?.id ||
    prevScoreResult ||
    prevPlayType === IFootballPlayType.Kickoff
  ) {
    return true;
  } else if (prevIsFumble === true) {
    return true;
  } else {
    return false;
  }
}

export function isNextBallOnEqualCurrentBallMoved(
  eventArray: FormArray,
  index: number,
): boolean {
  const currentTeam = getEventTeam(eventArray, index);
  const nextTeam = getEventTeam(eventArray, index + 1);
  const currentScoreResult = getEventScoreResult(eventArray, index);
  const currentBallMovedOn = getEventBallMovedOn(eventArray, index);
  const nextBallOn = getEventBallOn(eventArray, index + 1);
  const currentPlayType = getEventPlayType(eventArray, index);
  const currentIsFumble = getEventIsFumble(eventArray, index);
  if (currentBallMovedOn === nextBallOn) {
    return true;
  } else if (
    currentTeam?.id !== nextTeam?.id ||
    currentScoreResult ||
    currentPlayType === IFootballPlayType.Kickoff ||
    currentIsFumble === true
  ) {
    return true;
  } else {
    return false;
  }
}

export function isQbPlay(eventsArray: FormArray, index: number): boolean {
  const playType = getEventPlayType(eventsArray, index);
  return (
    playType === IFootballPlayType.Run ||
    playType === IFootballPlayType.Pass ||
    playType === IFootballPlayType.PatTwo
  );
}

export function isDownDistancePlay(
  eventsArray: FormArray,
  index: number,
): boolean {
  const playType = getEventPlayType(eventsArray, index);
  return (
    playType === IFootballPlayType.Run ||
    playType === IFootballPlayType.Pass ||
    playType === IFootballPlayType.Punt ||
    playType === IFootballPlayType.Kick
  );
}

export function isRunPlayResult(
  eventsArray: FormArray,
  index: number,
): boolean {
  const result = getEventPlayResult(eventsArray, index);
  return result === IFootballPlayResult.Run;
}

export function isRunPlay(eventsArray: FormArray, index: number): boolean {
  const playType = getEventPlayType(eventsArray, index);
  return (
    playType === IFootballPlayType.Run || playType === IFootballPlayType.PatTwo
  );
}

export function isPassPlay(eventsArray: FormArray, index: number): boolean {
  const playType = getEventPlayType(eventsArray, index);
  return (
    playType === IFootballPlayType.Pass || playType === IFootballPlayType.PatTwo
  );
}

export function isPassCompletedPlay(
  eventsArray: FormArray,
  index: number,
): boolean {
  const result = getEventPlayResult(eventsArray, index);
  return result === IFootballPlayResult.PassCompleted;
}

export function isPassDroppedPlay(
  eventsArray: FormArray,
  index: number,
): boolean {
  const result = getEventPlayResult(eventsArray, index);
  return result === IFootballPlayResult.PassDropped;
}

export function isScoreAvailable(
  eventsArray: FormArray,
  index: number,
): boolean {
  const playType = getEventPlayType(eventsArray, index);
  return (
    playType === IFootballPlayType.Run ||
    playType === IFootballPlayType.Pass ||
    playType === IFootballPlayType.Punt ||
    playType === IFootballPlayType.Kick
  );
}

export function isScoreTDPatTwoOffence(
  eventsArray: FormArray,
  index: number,
): boolean {
  const score = getEventScoreResult(eventsArray, index);
  return (
    score === IFootballScoreResult.Td ||
    score === IFootballScoreResult.PatTwoGood
  );
}

export function isPreviousScoreTdOrDefenceTd(
  eventsArray: FormArray,
  index: number,
): boolean {
  const score = getEventScoreResult(eventsArray, index - 1);
  return (
    score === IFootballScoreResult.Td ||
    score === IFootballScoreResult.TdDefence
  );
}

export function isPatOnePlay(eventsArray: FormArray, index: number): boolean {
  const playType = getEventPlayType(eventsArray, index);
  return playType === IFootballPlayType.PatOne;
}

export function isPatTwoPlay(eventsArray: FormArray, index: number): boolean {
  const playType = getEventPlayType(eventsArray, index);
  return playType === IFootballPlayType.PatTwo;
}

export function isReturnPlay(eventsArray: FormArray, index: number): boolean {
  const playResult = getEventPlayResult(eventsArray, index);
  return (
    playResult === IFootballPlayResult.PuntReturn ||
    playResult === IFootballPlayResult.KickOffReturn ||
    playResult === IFootballPlayResult.KickReturn
  );
}

export function isReturnPlayOrKickOut(
  eventsArray: FormArray,
  index: number,
): boolean {
  const playResult = getEventPlayResult(eventsArray, index);
  return (
    playResult === IFootballPlayResult.PuntReturn ||
    playResult === IFootballPlayResult.KickOffReturn ||
    playResult === IFootballPlayResult.KickReturn ||
    playResult === IFootballPlayResult.KickedOut
  );
}

export function isFumble(eventsArray: FormArray, index: number): boolean {
  const isFumble = getEventIsFumble(eventsArray, index);
  return isFumble === true;
}

export function isInterception(eventsArray: FormArray, index: number): boolean {
  const playResult = getEventPlayResult(eventsArray, index);
  return playResult === IFootballPlayResult.PassIntercepted;
}

export function isInterceptionOrFumble(
  eventsArray: FormArray,
  index: number,
): boolean {
  const playResult = getEventPlayResult(eventsArray, index);
  const isFumble = getEventIsFumble(eventsArray, index);
  return (
    isFumble === true || playResult === IFootballPlayResult.PassIntercepted
  );
}

export function isPuntPlay(eventsArray: FormArray, index: number): boolean {
  const playType = getEventPlayType(eventsArray, index);
  return playType === IFootballPlayType.Punt;
}

export function isFlagResult(eventsArray: FormArray, index: number): boolean {
  const playResult = getEventPlayResult(eventsArray, index);
  return playResult === IFootballPlayResult.Flag;
}

export function isSackResult(eventsArray: FormArray, index: number): boolean {
  const playResult = getEventPlayResult(eventsArray, index);
  return playResult === IFootballPlayResult.Sack;
}

export function isInterceptResult(
  eventsArray: FormArray,
  index: number,
): boolean {
  const playResult = getEventPlayResult(eventsArray, index);
  return playResult === IFootballPlayResult.PassIntercepted;
}

export function isDeflectResult(
  eventsArray: FormArray,
  index: number,
): boolean {
  const playResult = getEventPlayResult(eventsArray, index);
  return playResult === IFootballPlayResult.PassDeflected;
}

export function isKickPlay(eventsArray: FormArray, index: number): boolean {
  const playType = getEventPlayType(eventsArray, index);
  return playType === IFootballPlayType.Kick;
}

export function isKickOffPlay(eventsArray: FormArray, index: number): boolean {
  const playType = getEventPlayType(eventsArray, index);
  return playType === IFootballPlayType.Kickoff;
}

export function isDefenceScore(eventsArray: FormArray, index: number): boolean {
  const score = getEventScoreResult(eventsArray, index);
  return (
    score === IFootballScoreResult.TdDefence ||
    score === IFootballScoreResult.PatOneReturn ||
    score === IFootballScoreResult.PatTwoReturn ||
    score === IFootballScoreResult.KickOffTdReturn ||
    score === IFootballScoreResult.PuntTdReturn
  );
}

export function isTacklePossible(
  eventsArray: FormArray,
  index: number,
): boolean {
  const playResult = getEventPlayResult(eventsArray, index);
  const scoreResult = getEventScoreResult(eventsArray, index);

  return (
    playResult !== IFootballPlayResult.Flag &&
    playResult !== IFootballPlayResult.PassIncomplete &&
    playResult !== IFootballPlayResult.PassDeflected &&
    playResult !== IFootballPlayResult.PassDropped &&
    playResult !== IFootballPlayResult.TouchBack &&
    !scoreResult
  );
}

export function isScorePossible(
  eventsArray: FormArray,
  index: number,
): boolean {
  const playResult = getEventPlayResult(eventsArray, index);
  const playType = getEventPlayType(eventsArray, index);
  if (
    playType === IFootballPlayType.PatTwo &&
    playResult !== IFootballPlayResult.Flag
  ) {
    return true;
  }
  if (
    playResult !== IFootballPlayResult.Flag &&
    playResult !== IFootballPlayResult.PassIncomplete &&
    playResult !== IFootballPlayResult.PassDeflected &&
    playResult !== IFootballPlayResult.PassDropped &&
    playResult !== IFootballPlayResult.TouchBack
  ) {
    return true;
  }
  return false;
}

export function isBallMovePossible(
  eventsArray: FormArray,
  index: number,
): boolean {
  if (isQbPlay(eventsArray, index) || isFlagResult(eventsArray, index)) {
    return true;
  }
  return false;
}

export function isFourthDown(eventsArray: FormArray, index: number) {
  const down = getEventDown(eventsArray, index);
  return down === 4;
}
