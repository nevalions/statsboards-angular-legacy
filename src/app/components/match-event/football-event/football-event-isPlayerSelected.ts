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
  getEventPlayResult,
  getEventPlayType,
  getEventPuntPlayer,
  getEventQb,
  getEventReceiverPlayer,
  getEventReturnPlayer,
  getEventRunPlayer,
  getEventSackPlayer,
  getEventScorePlayer,
  getEventScoreResult,
} from './football-event-helpers';
import {
  IFootballPlayResult,
  IFootballPlayType,
  IFootballScoreResult,
} from '../../../type/football-event.type';
import { ICautionColors } from '../../../type/base.type';
import { IPlayerInMatchFullData } from '../../../type/player.type';

export function isCautionColor(bool: boolean) {
  if (bool) {
    return ICautionColors.Caution;
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
  const playType = getEventPlayType(eventsArray, index);
  if (
    playType === IFootballPlayType.Run ||
    playType === IFootballPlayType.Pass ||
    playType === IFootballPlayType.PatTwo
  ) {
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
  const playType = getEventPlayType(eventsArray, index);
  const result = getEventPlayResult(eventsArray, index);
  if (
    result === IFootballPlayResult.Run &&
    playType === IFootballPlayType.Run
  ) {
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
  const result = getEventPlayResult(eventsArray, index);
  if (result === IFootballPlayResult.PassCompleted) {
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
  const result = getEventPlayResult(eventsArray, index);
  if (result === IFootballPlayResult.PassDropped) {
    const player = getEventDroppedPlayer(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function noScorePlayerSelected(
  eventsArray: FormArray,
  index: number,
): boolean {
  const score = getEventScoreResult(eventsArray, index);
  if (
    score === IFootballScoreResult.Td ||
    score === IFootballScoreResult.PatTwoGood
  ) {
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
  const playType = getEventPlayType(eventsArray, index);
  if (playType === IFootballPlayType.PatOne) {
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
  const playResult = getEventPlayResult(eventsArray, index);
  if (
    playResult === IFootballPlayResult.PuntReturn ||
    playResult === IFootballPlayResult.KickOffReturn
  ) {
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
  const playType = getEventPlayType(eventsArray, index);
  if (playType === IFootballPlayType.Punt) {
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
  const playResult = getEventPlayResult(eventsArray, index);
  if (playResult === IFootballPlayResult.Flag) {
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
  const playResult = getEventPlayResult(eventsArray, index);
  if (playResult === IFootballPlayResult.Sack) {
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
  const playResult = getEventPlayResult(eventsArray, index);
  if (playResult === IFootballPlayResult.PassIntercepted) {
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
  const playResult = getEventPlayResult(eventsArray, index);
  if (playResult === IFootballPlayResult.PassDeflected) {
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
  const playType = getEventPlayType(eventsArray, index);
  if (playType === IFootballPlayType.Kick) {
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
  const playType = getEventPlayType(eventsArray, index);
  if (playType === IFootballPlayType.Kickoff) {
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
  const score = getEventScoreResult(eventsArray, index);
  if (score === IFootballScoreResult.TdDefence) {
    const player = getEventDefenceScorePlayer(eventsArray, index);
    if (!player) {
      return true;
    }
  }
  return false;
}

export function isPlayer(
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

export function isResultPlayerSelectedCautionColor(
  eventsArray: FormArray,
  index: number,
): boolean {
  return (
    noRunPlayerSelected(eventsArray, index) ||
    noReceiverPlayerSelected(eventsArray, index) ||
    noDroppedPlayerSelected(eventsArray, index) ||
    noScorePlayerSelected(eventsArray, index) ||
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
