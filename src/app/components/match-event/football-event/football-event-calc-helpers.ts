import {
  IFootballEvent,
  IFootballEventWithPlayers,
} from '../../../type/football-event.type';
import { IMatchWithFullData } from '../../../type/match.type';

export function isFirstDown(
  events: IFootballEventWithPlayers[] | null,
  ballOn: number | null,
  index: number,
  max: number,
): number | null {
  if (events && index >= 0 && index < events.length) {
    if (ballOn === null) {
      return null;
    }
    if (index > 0) {
      const previousEvent = events[index - 1];
      if (
        previousEvent &&
        previousEvent.ball_on !== undefined &&
        previousEvent.ball_on !== null &&
        previousEvent.event_distance !== undefined &&
        previousEvent.event_distance !== null
      ) {
        const previousBallOn = previousEvent.ball_on;
        const distance = computeDistanceForDownDistance(
          previousBallOn,
          ballOn,
          previousEvent.event_distance,
          max,
        );
        // console.log('distance', distance);
        // const calcDist = previousEvent.event_distance - distance;
        // console.log('calcDist', calcDist);

        if (distance <= 0) {
          // console.log('calcDistLower 0');
          return 1;
        } else {
          const previousDown =
            typeof previousEvent.event_down === 'number'
              ? previousEvent.event_down
              : 1;
          return previousDown < 4 ? previousDown + 1 : previousDown;
        }
      }
    } else {
      return 1;
    }
  }
  return null;
}

export function computeDistance(
  nextEventBallOn: number | undefined | null,
  currentBallOn: number | undefined | null,
  max: number,
): number {
  let calcDistance: number;

  if (
    nextEventBallOn !== undefined &&
    nextEventBallOn !== null &&
    currentBallOn !== undefined &&
    currentBallOn !== null
  ) {
    if (nextEventBallOn > 0 && currentBallOn > 0) {
      // Both in positive field
      calcDistance = currentBallOn - nextEventBallOn;
    } else if (nextEventBallOn < 0 && currentBallOn < 0) {
      // Both in negative field
      calcDistance = currentBallOn - nextEventBallOn;
    } else if (nextEventBallOn > 0 && currentBallOn < 0) {
      // Transition from positive to negative
      calcDistance = max - nextEventBallOn + max + currentBallOn;
    } else if (nextEventBallOn < 0 && currentBallOn > 0) {
      // Transition from negative to positive
      calcDistance = -(max - currentBallOn + max + nextEventBallOn);
    } else if (nextEventBallOn === 0 && currentBallOn > 0) {
      calcDistance = currentBallOn;
    } else if (nextEventBallOn === 0 && currentBallOn < 0) {
      calcDistance = max + currentBallOn + max;
    } else {
      throw new Error('Unexpected ball position');
    }
    return calcDistance;
  }

  return 0;
}

export function computeDistanceOnReturn(
  returnedBallOn: number | undefined | null,
  kickedBallOn: number | undefined | null,
  max: number,
): number {
  let calcDistance: number;

  if (
    returnedBallOn !== undefined &&
    returnedBallOn !== null &&
    kickedBallOn !== undefined &&
    kickedBallOn !== null
  ) {
    console.log('kick', returnedBallOn, kickedBallOn);
    if (returnedBallOn > 0 && kickedBallOn > 0) {
      // Both in positive field
      calcDistance = returnedBallOn - kickedBallOn;
    } else if (returnedBallOn < 0 && kickedBallOn < 0) {
      // Both in negative field
      calcDistance = returnedBallOn - kickedBallOn;
    } else if (returnedBallOn > 0 && kickedBallOn < 0) {
      // Transition from positive to negative
      calcDistance = -(max - returnedBallOn + max + kickedBallOn);
    } else if (returnedBallOn < 0 && kickedBallOn > 0) {
      // Transition from negative to positive
      calcDistance = max - kickedBallOn + max + returnedBallOn;
    } else if (returnedBallOn === 0 && kickedBallOn > 0) {
      calcDistance = max - kickedBallOn + max;
    } else if (returnedBallOn === 0 && kickedBallOn < 0) {
      calcDistance = -kickedBallOn;
    } else {
      throw new Error('Unexpected ball position');
    }
    console.log('calcDistance', calcDistance);
    return calcDistance;
  }

  return 0;
}

export function calcDistanceFromEvent(
  event: IFootballEvent | null | undefined,
  match: IMatchWithFullData | null | undefined,
): number | null {
  if (
    event &&
    event.ball_on !== null &&
    event.ball_on !== undefined &&
    event.ball_moved_to !== undefined &&
    event.ball_moved_to !== null &&
    match &&
    match.match_data &&
    match.match_data.field_length
  ) {
    return computeDistance(
      event.ball_moved_to,
      event.ball_on,
      match.match_data.field_length / 2,
    );
  }
  return null;
}

export function computeDistanceForDownDistance(
  previousBallOn: number,
  currentBallOn: number,
  previousEventDistance: number,
  max: number,
): number {
  let calcDistance: number;
  let newDistance: number;

  if (previousBallOn > 0 && currentBallOn > 0) {
    // Both in positive field
    calcDistance = previousBallOn - currentBallOn;
    newDistance = previousEventDistance - calcDistance;
    // console.log('Both positive:', newDistance);
  } else if (previousBallOn < 0 && currentBallOn < 0) {
    // Both in negative field
    calcDistance = previousBallOn - currentBallOn;
    newDistance = previousEventDistance - calcDistance;
    // console.log('Both negative:', newDistance);
  } else if (previousBallOn > 0 && currentBallOn < 0) {
    // Transition from positive to negative
    const centerDistance = max - previousBallOn + max + currentBallOn;
    newDistance = previousEventDistance + centerDistance;
    // console.log('Positive to negative:', newDistance);
  } else if (previousBallOn < 0 && currentBallOn > 0) {
    // Transition from negative to positive
    const centerDistance = max + previousBallOn + max - currentBallOn;
    newDistance = previousEventDistance - centerDistance;
    // console.log('Negative to positive:', newDistance);
  } else {
    throw new Error('Unexpected ball position');
  }

  return newDistance;
}

export function calculateDistance(
  events: IFootballEventWithPlayers[] | null,
  ballOn: number | null,
  index: number,
  max: number,
): number | null {
  // console.log('Calculating distance...');
  // console.log('Ball On:', ballOn);

  if (events && index >= 0 && index < events.length) {
    if (ballOn === null) {
      // console.log('BallOn is null.');
      return null;
    }

    let newDistance: number | null = null;

    if (index > 0) {
      const previousEvent = events[index - 1];
      if (
        previousEvent &&
        previousEvent.ball_on !== undefined &&
        previousEvent.ball_on !== null &&
        previousEvent.event_distance !== null &&
        previousEvent.event_distance !== undefined
      ) {
        const previousBallOn = previousEvent.ball_on;
        // console.log('Previous Ball On:', previousBallOn);

        try {
          newDistance = computeDistanceForDownDistance(
            previousBallOn,
            ballOn,
            previousEvent.event_distance,
            max,
          );

          // Set newDistance to 10 if the computed distance is <= 0
          if (newDistance <= 0) {
            newDistance = 10;
          }
        } catch (error) {
          console.error(error);
          return null;
        }
      } else {
        // console.log('No previous ball_on value.');
        return null;
      }
    } else {
      newDistance = 10;
      // console.log('First event, default distance:', newDistance);
    }

    // console.log('Calculated Distance:', newDistance);
    return newDistance;
  }

  // console.log('Invalid events or index.');
  return null;
}
