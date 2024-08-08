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
  const result = getEventPlayResult(eventsArray, index);
  return result === IFootballPlayResult.Run;
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

  return (
    playResult !== IFootballPlayResult.Flag &&
    playResult !== IFootballPlayResult.PassIncomplete &&
    playResult !== IFootballPlayResult.PassDeflected &&
    playResult !== IFootballPlayResult.PassDropped &&
    playResult !== IFootballPlayResult.TouchBack
  );
}

// export function isDefenceScorePossible(
//   eventsArray: FormArray,
//   index: number,
// ): boolean {
//   const playResult = getEventPlayResult(eventsArray, index);
//
//   return (
//     playResult !== IFootballPlayResult.Flag &&
//     playResult !== IFootballPlayResult.PassIncomplete &&
//     playResult !== IFootballPlayResult.PassDeflected &&
//     playResult !== IFootballPlayResult.PassDropped &&
//     playResult !== IFootballPlayResult.TouchBack &&
//     playResult !== IFootballPlayResult.PassIntercepted
//   );
// }
