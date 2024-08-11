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

const selectFootballMatchTeamOverallLostYards = (
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
            if (
              ((event.play_type === IFootballPlayType.Run ||
                event.play_type === IFootballPlayType.Pass) &&
                event.play_result === IFootballPlayResult.Run &&
                event.is_fumble) ||
              event.play_result === IFootballPlayResult.Sack
            ) {
              if (event.distance_moved && event.distance_moved < 0) {
                return eventRunDistance - event.distance_moved;
              }
            }
          }
          return eventRunDistance;
        },
        0,
      );
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
            if (
              (event.play_type === IFootballPlayType.Run ||
                event.play_type === IFootballPlayType.Pass) &&
              (event.play_result === IFootballPlayResult.Run ||
                event.play_result === IFootballPlayResult.Sack)
            ) {
              if (!event.is_fumble) {
                return eventRunDistance + (event.distance_moved || 0);
              } else {
                return eventRunDistance + (event.distance_moved || 0);
              }
            }
          }
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
            // const distance = calcDistanceFromEvent(event, match);

            if (
              event.play_type === IFootballPlayType.Pass &&
              event.play_result === IFootballPlayResult.PassCompleted
            ) {
              if (!event.is_fumble) {
                return eventPassDistance + (event.distance_moved || 0);
              } else {
                return eventPassDistance + (event.distance_moved || 0);
              }
            }
          }
          return eventPassDistance;
        },
        0,
      );
    },
  );

const selectFootballMatchTeamOverallFlagDistanceOnOffence = (
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
        (eventFlagDistance: number, event: IFootballEventWithPlayers) => {
          if (event.offense_team?.id === teamId) {
            if (event.play_result === IFootballPlayResult.Flag) {
              // console.log('flag');
              if (event.distance_moved && event.distance_moved < 0) {
                return eventFlagDistance + event.distance_moved;
              }
            }
          }
          return eventFlagDistance;
        },
        0,
      );
    },
  );

const selectFootballMatchTeamOverallFlagDistanceOnDefence = (
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
        (eventFlagDistance: number, event: IFootballEventWithPlayers) => {
          if (event.offense_team?.id && event.offense_team?.id !== teamId) {
            if (event.play_result === IFootballPlayResult.Flag) {
              // console.log('flag');
              if (event.distance_moved && event.distance_moved > 0) {
                return eventFlagDistance - event.distance_moved;
              }
            }
          }
          return eventFlagDistance;
        },
        0,
      );
    },
  );

const selectFootballMatchTeamTurnover = (
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
        (teamTurnovers: number, event: IFootballEventWithPlayers) => {
          if (event.offense_team?.id === teamId) {
            if (event.play_result === IFootballPlayResult.PassIntercepted) {
              // console.log('lose on int');
              return ++teamTurnovers;
            }
            if (
              event.is_fumble &&
              event.fumble_recovered_player?.match_player.team_id !== teamId
            ) {
              // console.log('lose on fumble');
              return ++teamTurnovers;
            }
          }
          return teamTurnovers;
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
    if (
      event.offense_team?.id === teamId &&
      event.play_type === playType &&
      event.play_result !== IFootballPlayResult.Flag
    ) {
      attempts++;
    }
    return attempts;
  }, 0);
};

// overall run distance
export const selectOverallRunDistanceForTeamA =
  selectFootballMatchTeamOverallRunDistance((match) => match?.match.team_a_id);

export const selectOverallRunDistanceForTeamB =
  selectFootballMatchTeamOverallRunDistance((match) => match?.match.team_b_id);

// overall pass distance
export const selectOverallPassDistanceForTeamA =
  selectFootballMatchTeamOverallPassDistance((match) => match?.match.team_a_id);

export const selectOverallPassDistanceForTeamB =
  selectFootballMatchTeamOverallPassDistance((match) => match?.match.team_b_id);

// overall lost yards
export const selectOverallLostDistanceForTeamA =
  selectFootballMatchTeamOverallLostYards((match) => match?.match.team_a_id);
export const selectOverallLostDistanceForTeamB =
  selectFootballMatchTeamOverallLostYards((match) => match?.match.team_b_id);

// overall turnovers
export const selectOverallTurnoversForTeamA = selectFootballMatchTeamTurnover(
  (match) => match?.match.team_a_id,
);
export const selectOverallTurnoversForTeamB = selectFootballMatchTeamTurnover(
  (match) => match?.match.team_b_id,
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
export const selectOverallFlagOffenceYardsForTeamA =
  selectFootballMatchTeamOverallFlagDistanceOnOffence(
    (match) => match?.match.team_a_id,
  );

export const selectOverallFlagOffenceYardsForTeamB =
  selectFootballMatchTeamOverallFlagDistanceOnOffence(
    (match) => match?.match.team_b_id,
  );

export const selectOverallFlagDefenceYardsForTeamA =
  selectFootballMatchTeamOverallFlagDistanceOnDefence(
    (match) => match?.match.team_a_id,
  );

export const selectOverallFlagDefenceYardsForTeamB =
  selectFootballMatchTeamOverallFlagDistanceOnDefence(
    (match) => match?.match.team_b_id,
  );

// Selector for Team A with Stats
export const selectFootballTeamAWithStats = createSelector(
  selectCurrentMatchWithFullData,
  selectOverallOffenceDistanceForTeamA,
  selectOverallPassDistanceForTeamA,
  selectOverallRunDistanceForTeamA,
  selectOverallLostDistanceForTeamA,
  selectOverallFlagOffenceYardsForTeamA,
  selectOverallFlagDefenceYardsForTeamA,
  selectOverallTurnoversForTeamA,
  selectFootballEventsWithPlayers,
  (
    match,
    offenceYards,
    passYards,
    runYards,
    lostYards,
    flagYardsOffence,
    flagYardsDefence,
    turnovers,
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

    let flagYards = flagYardsOffence + flagYardsDefence;

    return {
      ...teamA,
      match_stats: {
        id: teamA.id!,
        offence_yards: offenceYards,
        pass_att: passAttempts,
        run_att: runAttempts,
        pass_yards: passYards,
        run_yards: runYards,
        lost_yards: lostYards,
        flag_yards: flagYards,
        avg_yards_per_att: yardsPerAttempt,
        ...downStats,
        turnovers: turnovers,
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
  selectOverallLostDistanceForTeamB,
  selectOverallFlagOffenceYardsForTeamB,
  selectOverallFlagDefenceYardsForTeamB,
  selectOverallTurnoversForTeamB,
  selectFootballEventsWithPlayers,
  (
    match,
    offenceYards,
    passYards,
    runYards,
    lostYards,
    flagYardsOffence,
    flagYardsDefence,
    turnovers,
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

    let flagYards = flagYardsOffence + flagYardsDefence;

    return {
      ...teamB,
      match_stats: {
        id: teamB.id!,
        offence_yards: offenceYards,
        pass_yards: passYards,
        run_yards: runYards,
        lost_yards: lostYards,
        flag_yards: flagYards,
        pass_att: passAttempts,
        run_att: runAttempts,
        avg_yards_per_att: yardsPerAttempt,
        ...downStats,
        turnovers: turnovers,
      },
    };
  },
);
