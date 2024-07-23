import { IPlayerInMatchFullData } from '../../../../type/player.type';
import { createSelector } from '@ngrx/store';
import { selectAllMatchFootballEvents } from './reducers';
import { selectAllPlayersInMatchFullData } from '../../../player-match/store/reducers';
import {
  IFootballEventWithPlayers,
  IFootballPlayType,
} from '../../../../type/football-event.type';
import { selectCurrentMatchWithFullData } from '../../../match-with-full-data/store/reducers';
import { computeDistance } from '../football-event-calc-helpers';

export function getMatchPlayerById(
  players: IPlayerInMatchFullData[],
  playerId: number | null | undefined,
): IPlayerInMatchFullData | null {
  if (playerId === null || playerId === undefined) {
    return null;
  }
  return players.find((player) => player.match_player.id === playerId) || null;
}

export const selectFootballEventsWithPlayers = createSelector(
  selectAllMatchFootballEvents,
  selectAllPlayersInMatchFullData,
  selectCurrentMatchWithFullData,
  (footballEvents, matchPlayers, match): IFootballEventWithPlayers[] => {
    const teamA = match?.teams_data?.team_a || null;
    const teamB = match?.teams_data?.team_b || null;
    const fieldLength = match?.match_data?.field_length || 100;

    return footballEvents.map((event, index) => {
      const previousEvent = footballEvents[index - 1];

      let distanceMoved: number | null = null;

      if (
        previousEvent &&
        previousEvent.ball_on !== undefined &&
        event.ball_on !== undefined &&
        previousEvent.ball_on !== null &&
        event.ball_on !== null
      ) {
        distanceMoved = computeDistance(
          previousEvent.ball_on,
          event.ball_on,
          fieldLength / 2,
        );
      }

      return {
        ...event,
        distance_moved: distanceMoved,
        offense_team:
          event.offense_team === teamA?.id
            ? teamA
            : event.offense_team === teamB?.id
              ? teamB
              : null,
        event_qb: getMatchPlayerById(matchPlayers, event.event_qb),
        run_player: getMatchPlayerById(matchPlayers, event.run_player),
        pass_received_player: getMatchPlayerById(
          matchPlayers,
          event.pass_received_player,
        ),
        pass_dropped_player: getMatchPlayerById(
          matchPlayers,
          event.pass_dropped_player,
        ),
        pass_deflected_player: getMatchPlayerById(
          matchPlayers,
          event.pass_deflected_player,
        ),
        pass_intercepted_player: getMatchPlayerById(
          matchPlayers,
          event.pass_intercepted_player,
        ),
        fumble_player: getMatchPlayerById(matchPlayers, event.fumble_player),
        fumble_recovered_player: getMatchPlayerById(
          matchPlayers,
          event.fumble_recovered_player,
        ),
        tackle_player: getMatchPlayerById(matchPlayers, event.tackle_player),
        assist_tackle_player: getMatchPlayerById(
          matchPlayers,
          event.assist_tackle_player,
        ),
        sack_player: getMatchPlayerById(matchPlayers, event.sack_player),
        score_player: getMatchPlayerById(matchPlayers, event.score_player),
        defence_score_player: getMatchPlayerById(
          matchPlayers,
          event.defence_score_player,
        ),
        kick_player: getMatchPlayerById(matchPlayers, event.kick_player),
        kickoff_player: getMatchPlayerById(matchPlayers, event.kickoff_player),
        return_player: getMatchPlayerById(matchPlayers, event.return_player),
        pat_one_player: getMatchPlayerById(matchPlayers, event.pat_one_player),
        flagged_player: getMatchPlayerById(matchPlayers, event.flagged_player),
        punt_player: getMatchPlayerById(matchPlayers, event.punt_player),
        event_hash: event.event_hash
          ? { value: event.event_hash.toLowerCase() }
          : null,
        play_direction: event.play_direction
          ? { value: event.play_direction.toLowerCase() }
          : null,
        play_type: event.play_type
          ? { value: event.play_type.toLowerCase() }
          : null,
        play_result: event.play_result
          ? { value: event.play_result.toLowerCase() }
          : null,
        score_result: event.score_result
          ? { value: event.score_result.toLowerCase() }
          : null,
      } as IFootballEventWithPlayers;
    });
  },
);

// STATS OFFENCE

export const selectOverallRunDistanceForTeamA = createSelector(
  selectFootballEventsWithPlayers,
  selectCurrentMatchWithFullData,
  (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
    const teamId = match?.match.team_a_id;
    // console.log('teamId', teamId);
    return eventsWithPlayers.reduce((totalDistance, event) => {
      // console.log(
      //   'totalDistance',
      //   totalDistance,
      //   event.play_type,
      //   IFootballPlayType.Run,
      // );
      if (event.offense_team?.id === teamId && event.play_type) {
        if (event.play_type.value === IFootballPlayType.Run) {
          // console.log(event.play_type, IFootballPlayType.Run);
          return totalDistance + (event.distance_moved || 0);
        }
      }
      return totalDistance;
    }, 0);
  },
);

export const selectOverallRunDistanceForTeamB = createSelector(
  selectFootballEventsWithPlayers,
  selectCurrentMatchWithFullData,
  (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
    const teamId = match?.match.team_b_id;
    // console.log('teamId', teamId);
    return eventsWithPlayers.reduce((totalDistance, event) => {
      if (event.offense_team?.id === teamId && event.play_type) {
        if (event.play_type.value === IFootballPlayType.Run) {
          // console.log(event.play_type, IFootballPlayType.Run);
          return totalDistance + (event.distance_moved || 0);
        }
      }
      return totalDistance;
    }, 0);
  },
);

export const selectOverallPassDistanceForTeamA = createSelector(
  selectFootballEventsWithPlayers,
  selectCurrentMatchWithFullData,
  (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
    const teamId = match?.match.team_a_id;
    // console.log('teamId', teamId);
    return eventsWithPlayers.reduce((totalDistance, event) => {
      if (event.offense_team?.id === teamId && event.play_type) {
        if (event.play_type.value === IFootballPlayType.Pass) {
          // console.log(event.play_type, IFootballPlayType.Run);
          return totalDistance + (event.distance_moved || 0);
        }
      }
      return totalDistance;
    }, 0);
  },
);

export const selectOverallPassDistanceForTeamB = createSelector(
  selectFootballEventsWithPlayers,
  selectCurrentMatchWithFullData,
  (eventsWithPlayers: IFootballEventWithPlayers[], match): number => {
    const teamId = match?.match.team_b_id;
    // console.log('teamId', teamId);
    return eventsWithPlayers.reduce((totalDistance, event) => {
      if (event.offense_team?.id === teamId && event.play_type) {
        if (event.play_type.value === IFootballPlayType.Pass) {
          // console.log(event.play_type, IFootballPlayType.Run);
          return totalDistance + (event.distance_moved || 0);
        }
      }
      return totalDistance;
    }, 0);
  },
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
