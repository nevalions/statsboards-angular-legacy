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
      event.play_result === IFootballPlayResult.Flag
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
    const overalAttempts = runAttempts + passAttempts;
    let yardsPerAttempt;

    if (overalAttempts > 0) {
      yardsPerAttempt = offenceYards / overalAttempts;
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
    const overalAttempts = runAttempts + passAttempts;
    let yardsPerAttempt;

    if (overalAttempts > 0) {
      yardsPerAttempt = offenceYards / overalAttempts;
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
