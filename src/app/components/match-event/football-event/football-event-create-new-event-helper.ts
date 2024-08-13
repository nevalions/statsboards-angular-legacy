import {
  IEventDirection,
  IEventHash,
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IFootballPlayType,
  IFootballScoreResult,
} from '../../../type/football-event.type';
import { IMatchWithFullData } from '../../../type/match.type';
import { ITeam } from '../../../type/team.type';
import { IPlayerInMatchFullData } from '../../../type/player.type';
import { computeDistanceForDownDistance } from './football-event-calc-helpers';
import {
  handleTeamChangeOnDown,
  handleTeamChangeOnFumble,
  handleTeamChangeOnInterception,
  handleTeamChangeOnTouchBack,
} from './football-event-on-change-helpers';

export function createNewEvent(
  lastEvent: IFootballEventWithPlayers | null | undefined,
  newEventCount: number,
  match: IMatchWithFullData | undefined | null,
): Partial<IFootballEventWithPlayers> {
  let newEventNumber: number | null;
  let newEventQtr: number | null;
  let newEventTeam: ITeam | null = null;
  let newEventQb: IPlayerInMatchFullData | null = null;
  let newEventBallOn: number | null = null;
  let newEventBallMovedOn: number | null = null;
  let newEventBallPickedTo: number | null = null;
  let newEventBallKickedTo: number | null = null;
  let newEventBallReturnedTo: number | null = null;
  let newEventDown: number | null = null;
  let newEventDistance: number | null = null;
  let newEventHash: IEventHash | null = null;
  let newEventPlayType: IFootballPlayType | null = null;
  let compDistance: number | null = null;

  if (
    lastEvent &&
    lastEvent.ball_on &&
    lastEvent.ball_moved_to &&
    lastEvent.event_distance &&
    match &&
    match.match_data &&
    match.match_data.field_length
  ) {
    compDistance = computeDistanceForDownDistance(
      lastEvent.ball_on,
      lastEvent.ball_moved_to,
      lastEvent.event_distance,
      match.match_data.field_length / 2,
    );
  }

  if (lastEvent && lastEvent.event_number) {
    newEventNumber = lastEvent.event_number + 1;
  } else {
    newEventNumber = 1;
    newEventPlayType = IFootballPlayType.Kickoff;
  }

  if (lastEvent && lastEvent.event_qtr) {
    newEventQtr = lastEvent.event_qtr;
  } else {
    newEventQtr = 1;
  }

  if (
    lastEvent &&
    lastEvent.ball_moved_to &&
    lastEvent.play_result !== IFootballPlayResult.PassIntercepted &&
    lastEvent.is_fumble !== true
  ) {
    newEventBallOn = lastEvent.ball_moved_to;
    newEventBallMovedOn = lastEvent.ball_moved_to;
  }

  if (lastEvent && lastEvent.offense_team) {
    newEventTeam = lastEvent.offense_team;
  }

  if (lastEvent && lastEvent.event_qb) {
    newEventQb = lastEvent.event_qb;
  }

  if (lastEvent && lastEvent.event_down) {
    if (lastEvent.event_down < 4) {
      newEventDown = lastEvent.event_down + 1;
    } else {
      newEventDown = lastEvent.event_down;
    }
    if (lastEvent.play_result === IFootballPlayResult.Flag) {
      newEventDown = lastEvent.event_down;
    }
  }

  if (
    compDistance !== null &&
    compDistance !== undefined &&
    lastEvent?.event_distance
  ) {
    // console.log('distance', compDistance, lastEvent.event_distance);
    // newEventDistance = lastEvent.event_distance;
    if (compDistance > 0) {
      newEventDistance = compDistance;
    } else {
      newEventDown = 1;
      newEventDistance = 10;
    }
  }

  if (lastEvent && lastEvent.score_result) {
    if (
      lastEvent.score_result === IFootballScoreResult.Td ||
      lastEvent.score_result === IFootballScoreResult.TdDefence
    ) {
      newEventDown = null;
      newEventDistance = null;
      newEventBallOn = 3;
    }
  }

  if (newEventPlayType === IFootballPlayType.Kickoff) {
    newEventDistance = null;
    newEventDown = null;
    newEventQb = null;
    newEventBallOn = -35;
  } else if (newEventPlayType === IFootballPlayType.PatOne) {
    newEventDistance = null;
    newEventDown = null;
    newEventQb = null;
    newEventBallOn = 3;
  } else if (newEventPlayType === IFootballPlayType.PatTwo) {
    newEventDistance = null;
    newEventDown = null;
    newEventBallOn = 3;
  }

  if (lastEvent && lastEvent.play_result) {
    if (match) {
      const {
        newEventBallOn: newBallOn,
        newEventDown: newDown,
        newEventDistance: newDistance,
        newEventTeam: newTeam,
        newEventQb: newQb,
      } = handleTeamChangeOnTouchBack(match, lastEvent);
      if (
        (lastEvent.play_result === IFootballPlayResult.PuntReturn ||
          lastEvent.play_result === IFootballPlayResult.KickOffReturn ||
          lastEvent.play_result === IFootballPlayResult.KickedOut) &&
        !lastEvent.is_fumble
      ) {
        newEventDown = newDown;
        newEventDistance = newDistance;
        newEventTeam = newTeam;
        newEventQb = newQb;

        if (
          lastEvent.ball_returned_to !== null &&
          lastEvent.ball_returned_to !== undefined
        ) {
          newEventBallOn = -lastEvent.ball_returned_to;
          newEventBallMovedOn = -lastEvent.ball_returned_to;
        }
      }

      if (lastEvent.play_result === IFootballPlayResult.TouchBack) {
        newEventBallOn = newBallOn;
        newEventBallMovedOn = newBallOn;
        newEventDown = newDown;
        newEventDistance = newDistance;
        newEventTeam = newTeam;
        newEventQb = newQb;
      }

      if (lastEvent.score_result === IFootballScoreResult.KickGood) {
        newEventPlayType = IFootballPlayType.Kickoff;
      }

      if (lastEvent.score_result === IFootballScoreResult.KickMissed) {
        newEventDown = 1;
        newEventDistance = 10;
        newEventTeam = newTeam;
      }

      if (
        lastEvent.score_result === IFootballScoreResult.PatOneMissed ||
        lastEvent.score_result === IFootballScoreResult.PatOneGood ||
        lastEvent.score_result === IFootballScoreResult.PatOneReturn ||
        lastEvent.score_result === IFootballScoreResult.PatTwoMissed ||
        lastEvent.score_result === IFootballScoreResult.PatTwoGood ||
        lastEvent.score_result === IFootballScoreResult.PatTwoReturn
      ) {
        // newEventTeam = newTeam;
        newEventPlayType = IFootballPlayType.Kickoff;
      }

      if (lastEvent.score_result === IFootballScoreResult.TdDefence) {
        newEventTeam = newTeam;
        newEventBallOn = 3;
        newEventBallMovedOn = null;
        newEventDown = null;
        newEventDistance = null;
        newEventQb = null;
      }

      if (
        lastEvent.offense_team &&
        lastEvent.score_result === IFootballScoreResult.Safety
      ) {
        newEventTeam = lastEvent.offense_team;
        newEventPlayType = IFootballPlayType.Kickoff;
      }

      if (newEventPlayType === IFootballPlayType.Kickoff) {
        newEventDown = null;
        newEventDistance = null;
        newEventQb = null;
        newEventBallOn = -35;
      }
    }
  }

  if (lastEvent && lastEvent.play_type) {
    if (match) {
      const {
        newEventBallOn: newBallOn,
        newEventDown: newDown,
        newEventDistance: newDistance,
        newEventTeam: newTeam,
      } = handleTeamChangeOnDown(match, lastEvent);
      // console.log('handleDict', newBallOn, newDown, newDistance, newTeam?.id);
      // console.log('last and new event', lastEvent.offense_team?.id, newEventTeam?.id, lastEvent.event_down)
      if (
        lastEvent.event_down === 4 &&
        (lastEvent.play_type === IFootballPlayType.Pass ||
          lastEvent.play_type === IFootballPlayType.Run)
      ) {
        // console.log(
        //   'last 4th down',
        //   lastEvent.distance_moved,
        //   lastEvent.event_distance,
        // );
        if (
          lastEvent.distance_moved !== null &&
          lastEvent.distance_moved !== undefined &&
          lastEvent.event_distance !== null &&
          lastEvent.event_distance !== undefined &&
          lastEvent.distance_moved < lastEvent.event_distance
        ) {
          newEventTeam = newTeam;
          newEventBallOn = newBallOn;
          newEventBallMovedOn = newBallOn;
          newEventDown = newDown;
          newEventDistance = newDistance;
          newEventQb = null;
        }
      }
    }
  }

  if (lastEvent && lastEvent.play_result) {
    if (match) {
      const { newEventBallOn: newBallOn, newEventTeam: newTeam } =
        handleTeamChangeOnFumble(match, lastEvent);
      if (lastEvent.is_fumble && !lastEvent.score_result) {
        if (
          lastEvent.fumble_recovered_player?.match_player.team_id !==
            lastEvent.offense_team?.id &&
          lastEvent.offense_team?.id &&
          lastEvent.ball_returned_to !== null &&
          lastEvent.ball_returned_to !== undefined
        ) {
          newEventBallOn = -lastEvent.ball_returned_to;
          newEventBallMovedOn = -lastEvent.ball_returned_to;
          newEventTeam = newTeam;
          newEventDown = 1;
          newEventDistance = 10;
          newEventQb = null;
        }
        if (
          lastEvent.event_qb &&
          lastEvent.fumble_recovered_player?.match_player.team_id ===
            lastEvent.offense_team?.id &&
          lastEvent.offense_team?.id &&
          lastEvent.ball_returned_to !== null &&
          lastEvent.ball_returned_to !== undefined
        ) {
          newEventBallOn = lastEvent.ball_returned_to;
          newEventBallMovedOn = lastEvent.ball_returned_to;
          newEventQb = lastEvent.event_qb;
        }
      }
    }
  }

  if (lastEvent && lastEvent.play_result) {
    if (match) {
      const { newEventBallOn: newBallOn, newEventTeam: newTeam } =
        handleTeamChangeOnInterception(match, lastEvent);
      if (
        lastEvent.play_result === IFootballPlayResult.PassIntercepted &&
        !lastEvent.score_result
      ) {
        if (
          lastEvent.ball_returned_to !== null &&
          lastEvent.ball_returned_to !== undefined
        ) {
          newEventBallOn = -lastEvent.ball_returned_to;
          newEventBallMovedOn = -lastEvent.ball_returned_to;
          newEventTeam = newTeam;
          newEventDown = 1;
          newEventDistance = 10;
          newEventQb = null;
        }
      }
    }
  }

  if (
    lastEvent &&
    lastEvent.offense_team === newEventTeam &&
    newEventPlayType !== IFootballPlayType.Kickoff
  ) {
    if (
      lastEvent.play_result === IFootballPlayResult.Run ||
      lastEvent.play_result === IFootballPlayResult.PassCompleted
    ) {
      if (lastEvent.play_direction === IEventDirection.LeftWide) {
        newEventHash = IEventHash.Left;
      }
      if (lastEvent.play_direction === IEventDirection.RightWide) {
        newEventHash = IEventHash.Right;
      }
      if (
        lastEvent.event_hash === IEventHash.Left &&
        lastEvent.play_direction === IEventDirection.Left
      ) {
        newEventHash = IEventHash.Left;
      }
      if (
        lastEvent.event_hash === IEventHash.Right &&
        lastEvent.play_direction === IEventDirection.Right
      ) {
        newEventHash = IEventHash.Right;
      }
      if (
        lastEvent.event_hash === IEventHash.Middle &&
        lastEvent.play_direction === IEventDirection.Middle
      ) {
        newEventHash = IEventHash.Middle;
      }
    }
  }

  return {
    id: null,
    event_number: newEventNumber,
    event_qtr: newEventQtr,
    ball_on: newEventBallOn,
    ball_moved_to: newEventBallMovedOn,
    ball_picked_on: newEventBallPickedTo,
    ball_kicked_to: newEventBallKickedTo,
    ball_returned_to: newEventBallReturnedTo,
    offense_team: newEventTeam,
    event_qb: newEventQb,
    event_down: newEventDown,
    event_distance: newEventDistance,
    event_hash: newEventHash,
    play_direction: null,
    play_type: newEventPlayType,
    play_result: null,
    score_result: null,
    is_fumble: false,
    is_fumble_recovered: false,
  };
}

export function createNewFlagEvent(
  lastEvent: IFootballEventWithPlayers | null | undefined,
  match: IMatchWithFullData | undefined | null,
): Partial<IFootballEventWithPlayers> {
  let newEventNumber: number | null;
  let newEventQtr: number | null;
  let newEventTeam: ITeam | null = null;
  let newEventQb: IPlayerInMatchFullData | null = null;
  let newEventBallOn: number | null = null;
  let newEventBallMovedOn: number | null = null;
  let newEventBallPickedTo: number | null = null;
  let newEventBallKickedTo: number | null = null;
  let newEventBallReturnedTo: number | null = null;
  let newEventDown: number | null = null;
  let newEventDistance: number | null = null;
  let newEventHash: IEventHash | null = null;
  let newEventPlayType = IFootballPlayType.Flag;
  let newEventPlayResult = IFootballPlayResult.Flag;
  let compDistance: number | null = null;

  if (lastEvent && lastEvent.event_number) {
    newEventNumber = lastEvent.event_number + 1;
  } else {
    newEventNumber = 1;
  }

  if (lastEvent && lastEvent.event_qtr) {
    newEventQtr = lastEvent.event_qtr;
  } else {
    newEventQtr = 1;
  }

  if (
    lastEvent &&
    lastEvent.ball_moved_to &&
    lastEvent.play_result !== IFootballPlayResult.PassIntercepted &&
    lastEvent.is_fumble !== true
  ) {
    newEventBallOn = lastEvent.ball_moved_to;
    newEventBallMovedOn = lastEvent.ball_moved_to;
  }

  if (lastEvent && lastEvent.offense_team) {
    newEventTeam = lastEvent.offense_team;
  }

  if (lastEvent && lastEvent.event_qb) {
    newEventQb = lastEvent.event_qb;
  }

  if (lastEvent && lastEvent.event_down) {
    newEventDown = lastEvent.event_down;
  }

  if (lastEvent && lastEvent.event_distance) {
    newEventDistance = lastEvent.event_distance;
  }

  return {
    id: null,
    event_number: newEventNumber,
    event_qtr: newEventQtr,
    ball_on: newEventBallOn,
    ball_moved_to: newEventBallMovedOn,
    ball_picked_on: newEventBallPickedTo,
    ball_kicked_to: newEventBallKickedTo,
    ball_returned_to: newEventBallReturnedTo,
    offense_team: newEventTeam,
    event_qb: newEventQb,
    event_down: newEventDown,
    event_distance: newEventDistance,
    event_hash: newEventHash,
    play_direction: null,
    play_type: newEventPlayType,
    play_result: newEventPlayResult,
    score_result: null,
    is_fumble: false,
    is_fumble_recovered: false,
  };
}
