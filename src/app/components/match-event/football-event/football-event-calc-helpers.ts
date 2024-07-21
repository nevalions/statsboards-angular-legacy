import { IFootballEventWithPlayers } from '../../../type/football-event.type';

// export function isFirstDown(
//   events: IFootballEventWithPlayers[] | null,
//   ballOn: number | null,
//   index: number,
// ): number | null {
//   if (events && index >= 0 && index < events.length) {
//     if (ballOn === null) {
//       return null;
//     }
//     if (index > 0) {
//       const previousEvent = events[index - 1];
//       if (previousEvent && previousEvent.ball_on) {
//         let newDistance = 10 - (ballOn - previousEvent.ball_on);
//         if (newDistance <= 0) {
//           return 1;
//         } else {
//           const previousDown =
//             typeof previousEvent.event_down === 'number'
//               ? previousEvent.event_down
//               : 1;
//           return previousDown < 4 ? previousDown + 1 : previousDown;
//         }
//       }
//     } else {
//       return 1;
//     }
//   }
//   return null;
// }
// export function calculateFieldDistance(
//   previousBallOn: number,
//   currentBallOn: number,
//   max: number,
// ): number {
//   let distance: number;
//
//   if (previousBallOn > 0 && currentBallOn > 0) {
//     // Both in positive field
//     distance = previousBallOn - currentBallOn;
//   } else if (previousBallOn < 0 && currentBallOn < 0) {
//     // Both in negative field
//     distance = previousBallOn - currentBallOn;
//   } else if (previousBallOn > 0 && currentBallOn < 0) {
//     // Transition from positive to negative
//     // Distance from positive end to center + distance from center to negative end
//     distance = previousBallOn + max + (max + currentBallOn);
//   } else if (previousBallOn < 0 && currentBallOn > 0) {
//     // Transition from negative to positive
//     // Distance from negative end to center + distance from center to positive end
//     distance = 0 - previousBallOn + max + (max - currentBallOn);
//   } else {
//     throw new Error('Unexpected ball position');
//   }
//
//   return distance;
// }

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
        const distance = computeDistance(
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
    console.log('Both positive:', newDistance);
  } else if (previousBallOn < 0 && currentBallOn < 0) {
    // Both in negative field
    calcDistance = previousBallOn - currentBallOn;
    newDistance = previousEventDistance - calcDistance;
    console.log('Both negative:', newDistance);
  } else if (previousBallOn > 0 && currentBallOn < 0) {
    // Transition from positive to negative
    const centerDistance = max - previousBallOn + max + currentBallOn;
    newDistance = previousEventDistance + centerDistance;
    console.log('Positive to negative:', newDistance);
  } else if (previousBallOn < 0 && currentBallOn > 0) {
    // Transition from negative to positive
    const centerDistance = max + previousBallOn + max - currentBallOn;
    newDistance = previousEventDistance - centerDistance;
    console.log('Negative to positive:', newDistance);
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
  console.log('Calculating distance...');
  console.log('Ball On:', ballOn);

  if (events && index >= 0 && index < events.length) {
    if (ballOn === null) {
      console.log('BallOn is null.');
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
        console.log('Previous Ball On:', previousBallOn);

        try {
          newDistance = computeDistance(
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
        console.log('No previous ball_on value.');
        return null;
      }
    } else {
      newDistance = 10;
      console.log('First event, default distance:', newDistance);
    }

    console.log('Calculated Distance:', newDistance);
    return newDistance;
  }

  console.log('Invalid events or index.');
  return null;
}

// export function calculateDistance(
//   events: IFootballEventWithPlayers[] | null,
//   ballOn: number | null,
//   index: number,
//   max: number,
// ): number | null {
//   console.log('Calculating distance...');
//   console.log('Ball On:', ballOn);
//
//   if (events && index >= 0 && index < events.length) {
//     if (ballOn === null) {
//       console.log('BallOn is null.');
//       return null;
//     }
//
//     let calcDistance: number | null = null;
//     let newDistance: number | null = null;
//
//     if (index > 0) {
//       const previousEvent = events[index - 1];
//       // console.log('Previous Event:', previousEvent);
//       if (
//         previousEvent &&
//         previousEvent.ball_on !== undefined &&
//         previousEvent.ball_on !== null &&
//         previousEvent.event_distance !== null &&
//         previousEvent.event_distance !== undefined
//       ) {
//         const previousBallOn = previousEvent.ball_on;
//         console.log('Previous Ball On:', previousBallOn);
//
//         if (previousBallOn > 0 && ballOn > 0) {
//           // Both in positive field
//           calcDistance = previousBallOn - ballOn;
//           newDistance = previousEvent.event_distance - calcDistance;
//           console.log('Both positive:', newDistance);
//         } else if (previousBallOn < 0 && ballOn < 0) {
//           // Both in negative field
//           calcDistance = previousBallOn - ballOn;
//           newDistance = previousEvent.event_distance - calcDistance;
//           console.log('Both negative:', newDistance);
//         } else if (previousBallOn > 0 && ballOn < 0) {
//           // Transition from positive to negative
//           const centerDistance = max - previousBallOn + max + ballOn;
//           newDistance = previousEvent.event_distance + centerDistance;
//           console.log('Positive to negative:', newDistance);
//         } else if (previousBallOn < 0 && ballOn > 0) {
//           // Transition from negative to positive
//           const centerDistance = max + previousBallOn + max - ballOn;
//           newDistance = previousEvent.event_distance - centerDistance;
//           console.log('Negative to positive:', newDistance);
//         }
//       } else {
//         console.log('No previous ball_on value.');
//         return newDistance;
//       }
//     } else {
//       newDistance = 10;
//       console.log('First event, default distance:', newDistance);
//     }
//
//     console.log('Calculated Distance:', newDistance);
//     return newDistance;
//   }
//
//   console.log('Invalid events or index.');
//   return null;
// }

// export function calculateDistance(
//   events: IFootballEventWithPlayers[] | null,
//   ballOn: number | null,
//   index: number,
// ): number | null {
//   if (events && index >= 0 && index < events.length) {
//     if (ballOn === null) {
//       return null;
//     }
//     let newDistance: number | null = null;
//     if (index > 0) {
//       const previousEvent = events[index - 1];
//       if (previousEvent && previousEvent.ball_on) {
//         newDistance = 10 - (ballOn - previousEvent.ball_on);
//         if (newDistance <= 0) {
//           newDistance = 10;
//         }
//       } else {
//         return newDistance;
//       }
//     } else {
//       newDistance = 10;
//     }
//     return newDistance;
//   }
//   return null;
// }
