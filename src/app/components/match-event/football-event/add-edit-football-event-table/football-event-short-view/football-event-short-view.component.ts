import { Component, Input } from '@angular/core';
import {
  isDefenceScore,
  isDeflectResult,
  isFlagResult,
  isInterceptResult,
  isKickOffPlay,
  isKickPlay,
  isNextBallOnEqualCurrentBallMoved,
  isPassCompletedPlay,
  isPassDroppedPlay,
  isPatOnePlay,
  isPrevBallMovedEqualCurrentBallOn,
  isPuntPlay,
  isQbPlay,
  isReturnPlay,
  isRunPlay,
  isSackResult,
  isScoreTDPatTwoOffence,
  isTacklePossible,
} from '../../football-event-isPlayTypeOrResult-helper';
import {
  distanceOrGoal,
  isCautionColorResult,
  isMinCautionColor,
  isPlayerSecondName,
  noDefenceScorePlayerSelected,
  noDeflectPlayerSelected,
  noFlagPlayerSelected,
  noInterceptedPlayerSelected,
  noKickOffPlayerSelected,
  noKickPlayerSelected,
  noPatOnePlayerSelected,
  noPuntPlayerSelected,
  noQbSelected,
  noReceiverPlayerSelected,
  noReturnPlayerSelected,
  noRunPlayerSelected,
  noSackPlayerSelected,
  noScoreOffencePlayerSelected,
} from '../../football-event-isPlayerSelected-helper';
import {
  getEventBallKickedTo,
  getEventBallMovedOn,
  getEventBallOn,
  getEventBallReturnedTo,
  getEventDefenceScorePlayer,
  getEventDeflectedPlayer,
  getEventDistance,
  getEventDown,
  getEventDroppedPlayer,
  getEventFlaggedPlayer,
  getEventInterceptedPlayer,
  getEventIsFumble,
  getEventKickOffPlayer,
  getEventKickPlayer,
  getEventNumber,
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
  getEventTacklePlayer,
  getEventTeam,
} from '../../football-event-helpers';
import { hexToRgba } from '../../../../../base/helpers';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { FormArray } from '@angular/forms';
import { IFootballPlayResult } from '../../../../../type/football-event.type';
import {
  computeDistance,
  computeDistanceOnReturn,
} from '../../football-event-calc-helpers';

@Component({
  selector: 'app-football-event-short-view',
  standalone: true,
  imports: [TitleCasePipe, UpperCasePipe],
  templateUrl: './football-event-short-view.component.html',
  styleUrl: './football-event-short-view.component.less',
})
export class FootballEventShortViewComponent {
  @Input() eventsArray: FormArray | undefined | null;
  @Input() i: number | undefined | null;
  @Input() maxFieldLength: number | undefined | null;

  getPlayTypeBackgroundColor(playResult: IFootballPlayResult): string {
    switch (playResult) {
      case IFootballPlayResult.Flag:
        return '#D7BB69FF';
      case IFootballPlayResult.PassIntercepted:
        return '#ee88d2';
      default:
        return 'transparent';
    }
  }

  protected readonly isInterceptResult = isInterceptResult;
  protected readonly noKickPlayerSelected = noKickPlayerSelected;
  protected readonly noSackPlayerSelected = noSackPlayerSelected;
  protected readonly noInterceptedPlayerSelected = noInterceptedPlayerSelected;
  protected readonly getEventIsFumble = getEventIsFumble;
  protected readonly getEventDistance = getEventDistance;
  protected readonly isPassCompletedPlay = isPassCompletedPlay;
  protected readonly getBallOn = getEventBallOn;
  protected readonly isPassDroppedPlay = isPassDroppedPlay;
  protected readonly noScorePlayerSelected = noScoreOffencePlayerSelected;
  protected readonly getEventKickOffPlayer = getEventKickOffPlayer;
  protected readonly getEventTacklePlayer = getEventTacklePlayer;
  protected readonly noDeflectPlayerSelected = noDeflectPlayerSelected;
  protected readonly noDefenceScorePlayerSelected =
    noDefenceScorePlayerSelected;
  protected readonly isReturnPlay = isReturnPlay;
  protected readonly getEventInterceptedPlayer = getEventInterceptedPlayer;
  protected readonly isRunPlay = isRunPlay;
  protected readonly isTacklePossible = isTacklePossible;
  protected readonly isPuntPlay = isPuntPlay;
  protected readonly getEventScoreResult = getEventScoreResult;
  protected readonly isKickOffPlay = isKickOffPlay;
  protected readonly getEventPatOnePlayer = getEventPatOnePlayer;
  protected readonly noFlagPlayerSelected = noFlagPlayerSelected;
  protected readonly getEventRunPlayer = getEventRunPlayer;
  protected readonly isPatOnePlay = isPatOnePlay;
  protected readonly getEventFlaggedPlayer = getEventFlaggedPlayer;
  protected readonly getEventScorePlayer = getEventScorePlayer;
  protected readonly isScoreTDPatTwoOffence = isScoreTDPatTwoOffence;
  protected readonly noPuntPlayerSelected = noPuntPlayerSelected;
  protected readonly isMinCautionColor = isMinCautionColor;
  protected readonly noQbSelected = noQbSelected;
  protected readonly noKickOffPlayerSelected = noKickOffPlayerSelected;
  protected readonly getEventPlayResult = getEventPlayResult;
  protected readonly noReceiverPlayerSelected = noReceiverPlayerSelected;
  protected readonly getEventDeflectedPlayer = getEventDeflectedPlayer;
  protected readonly getEventKickPlayer = getEventKickPlayer;
  protected readonly isSackResult = isSackResult;
  protected readonly getEventDroppedPlayer = getEventDroppedPlayer;
  protected readonly getEventQb = getEventQb;
  protected readonly getEventDown = getEventDown;
  protected readonly noPatOnePlayerSelected = noPatOnePlayerSelected;
  protected readonly getEventReturnPlayer = getEventReturnPlayer;
  protected readonly isFlagResult = isFlagResult;
  protected readonly getEventReceiverPlayer = getEventReceiverPlayer;
  protected readonly isDeflectResult = isDeflectResult;
  protected readonly getEventPlayType = getEventPlayType;
  protected readonly getEventSackPlayer = getEventSackPlayer;
  protected readonly getEventPuntPlayer = getEventPuntPlayer;
  protected readonly hexToRgba = hexToRgba;
  protected readonly noRunPlayerSelected = noRunPlayerSelected;
  protected readonly isQbPlay = isQbPlay;
  protected readonly isPlayer = isPlayerSecondName;
  protected readonly isKickPlay = isKickPlay;
  protected readonly getEventDefenceScorePlayer = getEventDefenceScorePlayer;
  protected readonly noReturnPlayerSelected = noReturnPlayerSelected;
  protected readonly isDefenceScore = isDefenceScore;
  protected readonly getEventNumber = getEventNumber;
  protected readonly getEventTeam = getEventTeam;
  protected readonly isCautionColorResult = isCautionColorResult;
  protected readonly getBallMovedOn = getEventBallMovedOn;
  protected readonly computeDistance = computeDistance;
  protected readonly isDistanceOrGoal = distanceOrGoal;
  protected readonly isPrevBallMovedEqualCurrentBallOn =
    isPrevBallMovedEqualCurrentBallOn;
  protected readonly isNextBallOnEqualCurrentBallMoved =
    isNextBallOnEqualCurrentBallMoved;
  protected readonly getEventBallKickedTo = getEventBallKickedTo;
  protected readonly getEventBallReturnedTo = getEventBallReturnedTo;
  protected readonly computeDistanceOnReturn = computeDistanceOnReturn;
}
