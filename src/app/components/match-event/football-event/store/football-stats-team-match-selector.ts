// STATS OFFENCE
import { IMatchWithFullData } from '../../../../type/match.type';
import {
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IFootballPlayType,
} from '../../../../type/football-event.type';
import { createSelector } from '@ngrx/store';
import { selectCurrentMatchWithFullData } from '../../../match-with-full-data/store/reducers';
import { selectFootballEventsWithPlayers } from './selectors';
import { IFootballTeamWithStats } from '../../../../type/team.type';
import { calculateFootballDownStats } from '../football-event-stats-calc-helpers';

const selectOverallDistanceForTeam = (
  teamIdSelector: (match: IMatchWithFullData) => number | undefined,
  playType: IFootballPlayType,
  playResult: IFootballPlayResult,
) =>
  createSelector(
    selectFootballEventsWithPlayers,
    selectCurrentMatchWithFullData,
    (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
      if (!match || !match.id) {
        return 0;
      }
      const teamId = teamIdSelector(match);
      if (!teamId) {
        return 0;
      }

      return eventsWithPlayers.reduce((totalDistance, event) => {
        if (
          event.offense_team?.id === teamId &&
          event.play_type &&
          event.play_result
        ) {
          if (
            event.play_type === playType &&
            event.play_result === playResult &&
            !event.is_fumble
          ) {
            return totalDistance + (event.distance_moved || 0);
          } else if (
            event.play_type === playType &&
            event.play_result === playResult &&
            event.is_fumble
          ) {
            // console.log('is fumble', event);
            return totalDistance + (event.distance_on_offence || 0);
          }
        }
        return totalDistance;
      }, 0);
    },
  );

const selectFootballMatchTeamOverallRunDistance = (
  teamIdSelector: (match: IMatchWithFullData) => number | undefined,
) =>
  createSelector(
    selectFootballEventsWithPlayers,
    selectCurrentMatchWithFullData,
    (events: IFootballEventWithPlayers[], match): number => {
      if (!match || !match.id) {
        return 0;
      }
      const teamId: number | undefined = teamIdSelector(match);
      if (!teamId) {
        return 0;
      }
      return events.reduce(
        (eventRunDistance: number, event: IFootballEventWithPlayers) => {
          if (event.offense_team?.id === teamId) {
            // console.log('team id', teamId);
            if (
              event.play_type === IFootballPlayType.Run &&
              (event.play_result === IFootballPlayResult.Run ||
                event.play_result === IFootballPlayResult.Sack)
            ) {
              // console.log('is run on', event.distance_moved);
              if (!event.is_fumble) {
                // console.log(
                //   'calc no fumble',
                //   eventRunDistance + (event.distance_moved || 0),
                // );
                return eventRunDistance + (event.distance_moved || 0);
              } else {
                // console.log(
                //   'calc fumble',
                //   eventRunDistance + (event.distance_moved || 0),
                // );
                return eventRunDistance + (event.distance_on_offence || 0);
              }
            }
          }
          // console.log('event run distance', eventRunDistance);
          return eventRunDistance;
        },
        0,
      );
    },
  );

const selectFootballMatchTeamOverallPassDistance = (
  teamIdSelector: (match: IMatchWithFullData) => number | undefined,
) =>
  createSelector(
    selectFootballEventsWithPlayers,
    selectCurrentMatchWithFullData,
    (events: IFootballEventWithPlayers[], match): number => {
      if (!match || !match.id) {
        return 0;
      }
      const teamId: number | undefined = teamIdSelector(match);
      if (!teamId) {
        return 0;
      }
      return events.reduce(
        (eventPassDistance: number, event: IFootballEventWithPlayers) => {
          if (event.offense_team?.id === teamId) {
            if (
              event.play_type === IFootballPlayType.Pass &&
              event.play_result === IFootballPlayResult.PassCompleted
            ) {
              if (!event.is_fumble) {
                return eventPassDistance + (event.distance_moved || 0);
              } else {
                return eventPassDistance + (event.distance_on_offence || 0);
              }
            }
          }
          return eventPassDistance;
        },
        0,
      );
    },
  );

const selectFootballMatchTeamOverallFlagDistance = (
  teamIdSelector: (match: IMatchWithFullData) => number | undefined,
) =>
  createSelector(
    selectFootballEventsWithPlayers,
    selectCurrentMatchWithFullData,
    (events: IFootballEventWithPlayers[], match): number => {
      if (!match || !match.id) {
        return 0;
      }
      const teamId: number | undefined = teamIdSelector(match);
      if (!teamId) {
        return 0;
      }
      return events.reduce(
        (eventPassDistance: number, event: IFootballEventWithPlayers) => {
          if (event.offense_team?.id === teamId) {
            if (event.play_result === IFootballPlayResult.Flag) {
              // console.log('flag');
              if (event.distance_moved && event.distance_moved < 0) {
                return eventPassDistance + event.distance_moved;
              }
            }
          }
          return eventPassDistance;
        },
        0,
      );
    },
  );

const calculateAttempts = (
  events: IFootballEventWithPlayers[],
  teamId: number | undefined,
  playType: IFootballPlayType,
): number => {
  if (!teamId) return 0;

  return events.reduce((attempts, event) => {
    if (event.offense_team?.id === teamId && event.play_type === playType) {
      attempts++;
    }
    return attempts;
  }, 0);
};

// const calculateFootballRunYards

// Selectors for overall run distance
export const selectOverallRunDistanceForTeamA =
  selectFootballMatchTeamOverallRunDistance((match) => match?.match.team_a_id);

export const selectOverallRunDistanceForTeamB =
  selectFootballMatchTeamOverallRunDistance((match) => match?.match.team_b_id);

// Selectors for overall pass distance
export const selectOverallPassDistanceForTeamA =
  selectFootballMatchTeamOverallPassDistance((match) => match?.match.team_a_id);

export const selectOverallPassDistanceForTeamB =
  selectFootballMatchTeamOverallPassDistance((match) => match?.match.team_b_id);

export const selectOverallOffenceDistanceForTeamA = createSelector(
  selectOverallRunDistanceForTeamA,
  selectOverallPassDistanceForTeamA,
  (runYards, passYards): number => {
    return runYards + passYards;
  },
);

export const selectOverallOffenceDistanceForTeamB = createSelector(
  selectOverallRunDistanceForTeamB,
  selectOverallPassDistanceForTeamB,
  (runYards, passYards): number => {
    return runYards + passYards;
  },
);

// FLAGS
export const selectOverallFlagYardsForTeamA =
  selectFootballMatchTeamOverallFlagDistance((match) => match?.match.team_a_id);

export const selectOverallFlagYardsForTeamB =
  selectFootballMatchTeamOverallFlagDistance((match) => match?.match.team_b_id);

// export function calculateOverallFlagYards(
//   eventsWithPlayers: IFootballEventWithPlayers[],
//   teamId: number | undefined,
// ): number {
//   if (!teamId) return 0;
//
//   return eventsWithPlayers.reduce((totalDistance, event) => {
//     if (
//       event.offense_team?.id === teamId &&
//       event.play_result === IFootballPlayResult.Flag
//     ) {
//       return totalDistance + (event.distance_moved || 0);
//     }
//     return totalDistance;
//   }, 0);
// }

// export const selectOverallFlagYardsForTeamA = createSelector(
//   selectFootballEventsWithPlayers,
//   selectCurrentMatchWithFullData,
//   (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
//     const teamId = match?.match.team_a_id;
//     return calculateOverallFlagYards(eventsWithPlayers, teamId);
//   },
// );
//
// export const selectOverallFlagYardsForTeamB = createSelector(
//   selectFootballEventsWithPlayers,
//   selectCurrentMatchWithFullData,
//   (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
//     const teamId = match?.match.team_b_id;
//     return calculateOverallFlagYards(eventsWithPlayers, teamId);
//   },
// );

// Selector for Team A with Stats
export const selectFootballTeamAWithStats = createSelector(
  selectCurrentMatchWithFullData,
  selectOverallOffenceDistanceForTeamA,
  selectOverallPassDistanceForTeamA,
  selectOverallRunDistanceForTeamA,
  selectOverallFlagYardsForTeamA,
  selectFootballEventsWithPlayers,
  (
    match,
    offenceYards,
    passYards,
    runYards,
    flagYards,
    eventsWithPlayers,
  ): IFootballTeamWithStats | null => {
    const teamA = match?.teams_data?.team_a;
    if (!teamA) {
      // console.error('No team');
      return null;
    }
    const runAttempts = calculateAttempts(
      eventsWithPlayers,
      teamA.id!,
      IFootballPlayType.Run,
    );
    const passAttempts = calculateAttempts(
      eventsWithPlayers,
      teamA.id!,
      IFootballPlayType.Pass,
    );
    const downStats = calculateFootballDownStats(eventsWithPlayers, teamA.id!);
    const overallAttempts = runAttempts + passAttempts;
    let yardsPerAttempt;

    if (overallAttempts > 0) {
      yardsPerAttempt = parseFloat((offenceYards / overallAttempts).toFixed(2));
    } else {
      yardsPerAttempt = 0;
    }

    return {
      ...teamA,
      match_stats: {
        id: teamA.id!,
        offence_yards: offenceYards,
        pass_att: passAttempts,
        run_att: runAttempts,
        pass_yards: passYards,
        run_yards: runYards,
        flag_yards: flagYards,
        avg_yards_per_att: yardsPerAttempt,
        ...downStats,
      },
    };
  },
);

// Selector for Team B with Stats
export const selectFootballTeamBWithStats = createSelector(
  selectCurrentMatchWithFullData,
  selectOverallOffenceDistanceForTeamB,
  selectOverallPassDistanceForTeamB,
  selectOverallRunDistanceForTeamB,
  selectOverallFlagYardsForTeamB,
  selectFootballEventsWithPlayers,
  (
    match,
    offenceYards,
    passYards,
    runYards,
    flagYards,
    eventsWithPlayers,
  ): IFootballTeamWithStats | null => {
    const teamB = match?.teams_data?.team_b;
    if (!teamB) {
      // console.error('No team');
      return null;
    }

    const runAttempts = calculateAttempts(
      eventsWithPlayers,
      teamB.id!,
      IFootballPlayType.Run,
    );
    const passAttempts = calculateAttempts(
      eventsWithPlayers,
      teamB.id!,
      IFootballPlayType.Pass,
    );
    const downStats = calculateFootballDownStats(eventsWithPlayers, teamB.id!);
    // console.log('team b down stats', downStats);
    const overallAttempts = runAttempts + passAttempts;
    let yardsPerAttempt;

    if (overallAttempts > 0) {
      yardsPerAttempt = parseFloat((offenceYards / overallAttempts).toFixed(2));
    } else {
      yardsPerAttempt = 0;
    }

    return {
      ...teamB,
      match_stats: {
        id: teamB.id!,
        offence_yards: offenceYards,
        pass_yards: passYards,
        run_yards: runYards,
        flag_yards: flagYards,
        pass_att: passAttempts,
        run_att: runAttempts,
        avg_yards_per_att: yardsPerAttempt,
        ...downStats,
      },
    };
  },
);
