import { FormArray } from '@angular/forms';
import {
  getEventPlayResult,
  getEventPlayType,
  getEventScoreResult,
} from './football-event-helpers';
import {
  IFootballPlayResult,
  IFootballPlayType,
  IFootballScoreResult,
} from '../../../type/football-event.type';

export function isQbPlay(eventsArray: FormArray, index: number): boolean {
  const playType = getEventPlayType(eventsArray, index);
  return (
    playType === IFootballPlayType.Run ||
    playType === IFootballPlayType.Pass ||
    playType === IFootballPlayType.PatTwo
  );
}

export function isRunPlay(eventsArray: FormArray, index: number): boolean {
  const playType = getEventPlayType(eventsArray, index);
  const result = getEventPlayResult(eventsArray, index);
  return (
    result === IFootballPlayResult.Run && playType === IFootballPlayType.Run
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

export function isPatOnePlay(eventsArray: FormArray, index: number): boolean {
  const playType = getEventPlayType(eventsArray, index);
  return playType === IFootballPlayType.PatOne;
}

export function isReturnPlay(eventsArray: FormArray, index: number): boolean {
  const playResult = getEventPlayResult(eventsArray, index);
  return (
    playResult === IFootballPlayResult.PuntReturn ||
    playResult === IFootballPlayResult.KickOffReturn
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
