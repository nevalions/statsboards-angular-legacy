// STATS OFFENCE
import { IMatchWithFullData } from '../../../../type/match.type';
import {
  IFootballEventWithPlayers,
  IFootballPlayResult,
  IFootballPlayType,
  ITeamFootballMatchStats,
} from '../../../../type/football-event.type';
import { createSelector } from '@ngrx/store';
import { selectCurrentMatchWithFullData } from '../../../match-with-full-data/store/reducers';
import { selectFootballEventsWithPlayers } from './selectors';
import { IFootballTeamWithStats } from '../../../../type/team.type';

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
            event.play_type.value === playType &&
            event.play_result.value === playResult &&
            !event.is_fumble
          ) {
            return totalDistance + (event.distance_moved || 0);
          } else if (
            event.play_type.value === playType &&
            event.play_result.value === playResult &&
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

// Selectors for overall run distance
export const selectOverallRunDistanceForTeamA = selectOverallDistanceForTeam(
  (match) => match?.match.team_a_id,
  IFootballPlayType.Run,
  IFootballPlayResult.Run,
);

export const selectOverallRunDistanceForTeamB = selectOverallDistanceForTeam(
  (match) => match?.match.team_b_id,
  IFootballPlayType.Run,
  IFootballPlayResult.Run,
);

// Selectors for overall pass distance
export const selectOverallPassDistanceForTeamA = selectOverallDistanceForTeam(
  (match) => match?.match.team_a_id,
  IFootballPlayType.Pass,
  IFootballPlayResult.PassCompleted,
);

export const selectOverallPassDistanceForTeamB = selectOverallDistanceForTeam(
  (match) => match?.match.team_b_id,
  IFootballPlayType.Pass,
  IFootballPlayResult.PassCompleted,
);

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
export function calculateOverallFlagYards(
  eventsWithPlayers: IFootballEventWithPlayers[],
  teamId: number | undefined,
): number {
  if (!teamId) return 0;

  return eventsWithPlayers.reduce((totalDistance, event) => {
    if (
      event.offense_team?.id === teamId &&
      event.play_result?.value === IFootballPlayResult.Flag
    ) {
      return totalDistance + (event.distance_moved || 0);
    }
    return totalDistance;
  }, 0);
}

export const selectOverallFlagYardsForTeamA = createSelector(
  selectFootballEventsWithPlayers,
  selectCurrentMatchWithFullData,
  (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
    const teamId = match?.match.team_a_id;
    return calculateOverallFlagYards(eventsWithPlayers, teamId);
  },
);

export const selectOverallFlagYardsForTeamB = createSelector(
  selectFootballEventsWithPlayers,
  selectCurrentMatchWithFullData,
  (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
    const teamId = match?.match.team_b_id;
    return calculateOverallFlagYards(eventsWithPlayers, teamId);
  },
);

export function countDownAttempts(
  eventsWithPlayers: IFootballEventWithPlayers[],
  teamId: number | undefined,
): { thirdDownAttempts: number; fourthDownAttempts: number } {
  let thirdDownAttempts = 0;
  let fourthDownAttempts = 0;

  if (!teamId) return { thirdDownAttempts, fourthDownAttempts };

  eventsWithPlayers.forEach((event) => {
    if (event.offense_team?.id === teamId && event.event_down) {
      if (event.event_down === 3) {
        thirdDownAttempts++;
      } else if (event.event_down === 4) {
        fourthDownAttempts++;
      }
    }
  });

  return { thirdDownAttempts, fourthDownAttempts };
}

// export function countDownConversions(
//   eventsWithPlayers: IFootballEventWithPlayers[],
//   teamId: number | undefined,
// ): { thirdDownConversions: number; fourthDownConversions: number } {
//   let thirdDownConversions = 0;
//   let fourthDownConversions = 0;
//
//   if (!teamId) return { thirdDownConversions, fourthDownConversions };
//
//   eventsWithPlayers.forEach((event, index) => {
//     const nextEvent = eventsWithPlayers[index + 1];
//
//     if (
//       event.offense_team?.id === teamId &&
//       nextEvent &&
//       nextEvent.offense_team?.id === teamId &&
//       event.event_down &&
//       nextEvent.event_down === 1
//     ) {
//       if (event.event_down === 3) {
//         thirdDownConversions++;
//       } else if (event.event_down === 4) {
//         fourthDownConversions++;
//       }
//     }
//   });
//
//   return { thirdDownConversions, fourthDownConversions };
// }

function calculateFootballDownStats(
  eventsWithPlayers: IFootballEventWithPlayers[],
  teamId: number | undefined,
): Partial<ITeamFootballMatchStats> {
  if (!teamId) return {};

  let thirdDownAttempts = 0;
  let thirdDownConversions = 0;
  let fourthDownAttempts = 0;
  let fourthDownConversions = 0;

  eventsWithPlayers.forEach((event, index) => {
    if (event.offense_team?.id === teamId && event.event_down) {
      const nextEvent = eventsWithPlayers[index + 1];

      if (event.event_down === 3) {
        thirdDownAttempts++;
        if (
          nextEvent &&
          nextEvent.event_down === 1 &&
          nextEvent.offense_team?.id === teamId
        ) {
          thirdDownConversions++;
        }
      } else if (event.event_down === 4) {
        fourthDownAttempts++;
        if (
          nextEvent &&
          nextEvent.event_down === 1 &&
          nextEvent.offense_team?.id === teamId
        ) {
          fourthDownConversions++;
        }
      }
    }
  });

  return {
    third_down_attempts: thirdDownAttempts,
    third_down_conversions: thirdDownConversions,
    fourth_down_attempts: fourthDownAttempts,
    fourth_down_conversions: fourthDownConversions,
  };
}

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
      return null;
    }

    const downStats = calculateFootballDownStats(eventsWithPlayers, teamA.id!);

    // const { thirdDownConversions, fourthDownConversions } =
    //   countDownConversions(eventsWithPlayers, teamA.id!);

    return {
      ...teamA,
      match_stats: {
        id: teamA.id!,
        offence_yards: offenceYards,
        pass_yards: passYards,
        run_yards: runYards,
        flag_yards: flagYards,
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
      return null;
    }

    const downStats = calculateFootballDownStats(eventsWithPlayers, teamB.id!);

    // const { thirdDownConversions, fourthDownConversions } =
    //   countDownConversions(eventsWithPlayers, teamB.id!);

    return {
      ...teamB,
      match_stats: {
        id: teamB.id!,
        offence_yards: offenceYards,
        pass_yards: passYards,
        run_yards: runYards,
        flag_yards: flagYards,
        ...downStats,
      },
    };
  },
);
