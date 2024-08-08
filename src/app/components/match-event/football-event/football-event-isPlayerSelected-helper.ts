import { FormArray } from '@angular/forms';
import {
  getEventDefenceScorePlayer,
  getEventDeflectedPlayer,
  getEventDroppedPlayer,
  getEventFlaggedPlayer,
  getEventInterceptedPlayer,
  getEventKickOffPlayer,
  getEventKickPlayer,
  getEventPatOnePlayer,
  getEventPuntPlayer,
  getEventQb,
  getEventReceiverPlayer,
  getEventReturnPlayer,
  getEventRunPlayer,
  getEventSackPlayer,
  getEventScorePlayer,
} from './football-event-helpers';
import { ICautionColors } from '../../../type/base.type';
import { IPlayerInMatchFullData } from '../../../type/player.type';
import {
  isDefenceScore,
  isDeflectResult,
  isFlagResult,
  isInterceptResult,
  isKickOffPlay,
  isKickPlay,
  isPassCompletedPlay,
  isPassDroppedPlay,
  isPatOnePlay,
  isPuntPlay,
  isQbPlay,
  isReturnPlay,
  isRunPlay,
  isSackResult,
  isScoreTDPatTwoOffence,
} from './football-event-isPlayTypeOrResult-helper';
import { IFootballPlayType } from '../../../type/football-event.type';

export function isCautionColor(bool: boolean) {
  if (bool) {
    return ICautionColors.Caution;
  } else {
    return ICautionColors.Transparent;
  }
}

export function isMinCautionColor(bool: boolean) {
  if (bool) {
    return ICautionColors.MinCaution;
  } else {
    return ICautionColors.Transparent;
  }
}

export function isMaxCautionColor(bool: boolean) {
  if (bool) {
    return ICautionColors.MaxCaution;
  } else {
    return ICautionColors.Transparent;
  }
}

export function isCautionColorResult(eventsArray: FormArray, index: number) {
  if (isResultPlayerSelectedMaxCautionColor(eventsArray, index)) {
    return isMaxCautionColor(true);
  }
  if (isResultPlayerSelectedCautionColor(eventsArray, index)) {
    return isCautionColor(true);
  }
  return false;
}

export function noQbSelected(eventsArray: FormArray, index: number): boolean {
  // const playType = getEventPlayType(eventsArray, index);
  // if (
  //   playType === IFootballPlayType.Run ||
  //   playType === IFootballPlayType.Pass ||
  //   playType === IFootballPlayType.PatTwo
  // ) {
  if (isQbPlay(eventsArray, index)) {
    const player = getEventQb(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function noRunPlayerSelected(
  eventsArray: FormArray,
  index: number,
): boolean {
  // const playType = getEventPlayType(eventsArray, index);
  // const result = getEventPlayResult(eventsArray, index);
  // if (
  //   result === IFootballPlayResult.Run &&
  //   playType === IFootballPlayType.Run
  // ) {
  if (isRunPlay(eventsArray, index)) {
    const player = getEventRunPlayer(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function noReceiverPlayerSelected(
  eventsArray: FormArray,
  index: number,
): boolean {
  // const result = getEventPlayResult(eventsArray, index);
  // if (result === IFootballPlayResult.PassCompleted) {
  if (isPassCompletedPlay(eventsArray, index)) {
    const player = getEventReceiverPlayer(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function noDroppedPlayerSelected(
  eventsArray: FormArray,
  index: number,
): boolean {
  // const result = getEventPlayResult(eventsArray, index);
  // if (result === IFootballPlayResult.PassDropped) {
  if (isPassDroppedPlay(eventsArray, index)) {
    const player = getEventDroppedPlayer(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function noScoreOffencePlayerSelected(
  eventsArray: FormArray,
  index: number,
): boolean {
  // const score = getEventScoreResult(eventsArray, index);
  // if (
  //   score === IFootballScoreResult.Td ||
  //   score === IFootballScoreResult.PatTwoGood
  // ) {
  if (isScoreTDPatTwoOffence(eventsArray, index)) {
    const player = getEventScorePlayer(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function noPatOnePlayerSelected(
  eventsArray: FormArray,
  index: number,
): boolean {
  // const playType = getEventPlayType(eventsArray, index);
  // if (playType === IFootballPlayType.PatOne) {
  if (isPatOnePlay(eventsArray, index)) {
    const player = getEventPatOnePlayer(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function noReturnPlayerSelected(
  eventsArray: FormArray,
  index: number,
): boolean {
  // const playResult = getEventPlayResult(eventsArray, index);
  // if (
  //   playResult === IFootballPlayResult.PuntReturn ||
  //   playResult === IFootballPlayResult.KickOffReturn
  // ) {
  if (isReturnPlay(eventsArray, index)) {
    const player = getEventReturnPlayer(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function noPuntPlayerSelected(
  eventsArray: FormArray,
  index: number,
): boolean {
  // const playType = getEventPlayType(eventsArray, index);
  // if (playType === IFootballPlayType.Punt) {
  if (isPuntPlay(eventsArray, index)) {
    const player = getEventPuntPlayer(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function noFlagPlayerSelected(
  eventsArray: FormArray,
  index: number,
): boolean {
  if (isFlagResult(eventsArray, index)) {
    // const playResult = getEventPlayResult(eventsArray, index);
    // if (playResult === IFootballPlayResult.Flag) {
    const player = getEventFlaggedPlayer(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function noSackPlayerSelected(
  eventsArray: FormArray,
  index: number,
): boolean {
  // const playResult = getEventPlayResult(eventsArray, index);
  // if (playResult === IFootballPlayResult.Sack) {
  if (isSackResult(eventsArray, index)) {
    const player = getEventSackPlayer(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function noInterceptedPlayerSelected(
  eventsArray: FormArray,
  index: number,
): boolean {
  // const playResult = getEventPlayResult(eventsArray, index);
  // if (playResult === IFootballPlayResult.PassIntercepted) {
  if (isInterceptResult(eventsArray, index)) {
    const player = getEventInterceptedPlayer(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function noDeflectPlayerSelected(
  eventsArray: FormArray,
  index: number,
): boolean {
  // const playResult = getEventPlayResult(eventsArray, index);
  // if (playResult === IFootballPlayResult.PassDeflected) {
  if (isDeflectResult(eventsArray, index)) {
    const player = getEventDeflectedPlayer(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function noKickPlayerSelected(
  eventsArray: FormArray,
  index: number,
): boolean {
  // const playType = getEventPlayType(eventsArray, index);
  // if (playType === IFootballPlayType.Kick) {
  if (isKickPlay(eventsArray, index)) {
    const player = getEventKickPlayer(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function noKickOffPlayerSelected(
  eventsArray: FormArray,
  index: number,
): boolean {
  // const playType = getEventPlayType(eventsArray, index);
  // if (playType === IFootballPlayType.Kickoff) {
  if (isKickOffPlay(eventsArray, index)) {
    const player = getEventKickOffPlayer(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function noDefenceScorePlayerSelected(
  eventsArray: FormArray,
  index: number,
): boolean {
  // const score = getEventScoreResult(eventsArray, index);
  // if (score === IFootballScoreResult.TdDefence) {
  if (isDefenceScore(eventsArray, index)) {
    const player = getEventDefenceScorePlayer(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function isPlayerSecondName(
  player: IPlayerInMatchFullData | null | undefined,
): string {
  // console.log(player);
  if (player) {
    if (player.person?.second_name) {
      return player.person?.second_name.toUpperCase();
    }
    return 'No Person'.toUpperCase();
  }
  return 'No Player'.toUpperCase();
}

export function isDistanceOrGoal(
  dist: number | null | undefined,
  ballOn: number | null | undefined,
  playType: IFootballPlayType | null | undefined,
): boolean {
  if (dist && ballOn) {
    if (
      playType === IFootballPlayType.Run ||
      playType === IFootballPlayType.Pass ||
      playType === IFootballPlayType.Punt ||
      playType === IFootballPlayType.Kick
    ) {
      if (ballOn > 0 && ballOn <= dist) {
        return false;
      }
    }
  }
  return true;
}

export function distanceOrGoal(
  dist: number | null | undefined,
  ballOn: number | null | undefined,
  playType: IFootballPlayType | null | undefined,
): number | string | null {
  if (dist && ballOn) {
    if (isDistanceOrGoal(dist, ballOn, playType)) {
      return dist;
    } else {
      return 'Goal';
    }
  }
  return null;
}

export function isResultPlayerSelectedCautionColor(
  eventsArray: FormArray,
  index: number,
): boolean {
  return (
    noRunPlayerSelected(eventsArray, index) ||
    noReceiverPlayerSelected(eventsArray, index) ||
    noDroppedPlayerSelected(eventsArray, index) ||
    noScoreOffencePlayerSelected(eventsArray, index) ||
    noPatOnePlayerSelected(eventsArray, index) ||
    noReturnPlayerSelected(eventsArray, index) ||
    noPuntPlayerSelected(eventsArray, index) ||
    noFlagPlayerSelected(eventsArray, index) ||
    noSackPlayerSelected(eventsArray, index) ||
    noInterceptedPlayerSelected(eventsArray, index) ||
    noDeflectPlayerSelected(eventsArray, index) ||
    noKickPlayerSelected(eventsArray, index) ||
    noKickOffPlayerSelected(eventsArray, index) ||
    noDefenceScorePlayerSelected(eventsArray, index)
  );
}

export function isResultPlayerSelectedMaxCautionColor(
  eventsArray: FormArray,
  index: number,
): boolean {
  return noQbSelected(eventsArray, index);
}
