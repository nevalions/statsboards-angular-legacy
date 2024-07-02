import { IFootballEventWithPlayers } from '../../../type/football-event.type';

export function isFirstDown(
  events: IFootballEventWithPlayers[] | null,
  ballOn: number | null,
  index: number,
): number | null {
  if (events && index >= 0 && index < events.length) {
    if (ballOn === null) {
      return null;
    }
    if (index > 0) {
      const previousEvent = events[index - 1];
      if (previousEvent && previousEvent.ball_on) {
        let newDistance = 10 - (ballOn - previousEvent.ball_on);
        if (newDistance <= 0) {
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

export function calculateDistance(
  events: IFootballEventWithPlayers[] | null,
  ballOn: number | null,
  index: number,
): number | null {
  if (events && index >= 0 && index < events.length) {
    if (ballOn === null) {
      return null;
    }
    let newDistance: number | null = null;
    if (index > 0) {
      const previousEvent = events[index - 1];
      if (previousEvent && previousEvent.ball_on) {
        newDistance = 10 - (ballOn - previousEvent.ball_on);
        if (newDistance <= 0) {
          newDistance = 10;
        }
      } else {
        return newDistance;
      }
    } else {
      newDistance = 10;
    }
    return newDistance;
  }
  return null;
}
