//Offence
import { createSelector } from '@ngrx/store';
import { selectFootballEventsWithPlayers } from './selectors';
import {
  IFootballEventWithPlayers,
  IOffenceStats,
} from '../../../../type/football-event.type';
import {
  IPlayerInMatchFullData,
  IPlayerInMatchFullDataWithOffenceStats,
} from '../../../../type/player.type';
import {
  calculateFootballOffencePassDistanceAndFumbleAndTd,
  calculateFootballOffenceRunDistanceAndFumbleAndTd,
} from '../football-event-stats-calc-helpers';
import { IMatchWithFullData } from '../../../../type/match.type';
import { selectCurrentMatchWithFullData } from '../../../match-with-full-data/store/reducers';

export const selectOffenseStats = createSelector(
  selectFootballEventsWithPlayers,
  (events: IFootballEventWithPlayers[]): Record<number, IOffenceStats> => {
    const offenseStats: Record<number, IOffenceStats> = {};

    events.forEach((event) => {
      const playerId =
        event.run_player?.match_player.id ||
        event.pass_received_player?.match_player.id;
      if (playerId) {
        if (!offenseStats[playerId]) {
          offenseStats[playerId] = {
            id: playerId,
            pass_attempts: 0,
            pass_received: 0,
            pass_yards: 0,
            pass_td: 0,
            run_attempts: 0,
            run_yards: 0,
            run_td: 0,
            fumble: 0,
          };
        }

        calculateFootballOffencePassDistanceAndFumbleAndTd(
          event,
          playerId,
          offenseStats,
        );

        // Calculate run distance
        calculateFootballOffenceRunDistanceAndFumbleAndTd(
          event,
          playerId,
          offenseStats,
        );
      }
    });

    return offenseStats;
  },
);

const selectAllPlayersWithOffenseStats = (
  teamIdSelector: (match: IMatchWithFullData) => number | undefined,
) =>
  createSelector(
    selectFootballEventsWithPlayers,
    selectCurrentMatchWithFullData,
    selectOffenseStats,
    (events, match, offenseStats): IPlayerInMatchFullDataWithOffenceStats[] => {
      if (!match || !match.id) {
        return [];
      }

      const teamId = teamIdSelector(match);
      if (!teamId) {
        return [];
      }

      // Deduplicate and get all offensive players for the team
      const players = events
        .filter(
          (event) =>
            (event.run_player || event.pass_received_player) &&
            event.offense_team?.id === teamId,
        )
        .map((event) => event.run_player || event.pass_received_player)
        .reduce((uniquePlayers, player) => {
          if (
            !uniquePlayers.some(
              (p) => p.match_player.id === player?.match_player.id,
            )
          ) {
            if (player) {
              uniquePlayers.push(player);
            }
          }
          return uniquePlayers;
        }, [] as IPlayerInMatchFullData[]);

      // Map to IPlayerInMatchFullDataWithOffenceStats
      return players.map((player) => ({
        ...player,
        off_stats: {
          id: player.match_player.id!,
          pass_attempts:
            offenseStats[player.match_player.id!]?.pass_attempts || 0,
          pass_received:
            offenseStats[player.match_player.id!]?.pass_received || 0,
          pass_yards: offenseStats[player.match_player.id!]?.pass_yards || 0,
          pass_td: offenseStats[player.match_player.id!]?.pass_td || 0,
          run_attempts:
            offenseStats[player.match_player.id!]?.run_attempts || 0,
          run_yards: offenseStats[player.match_player.id!]?.run_yards || 0,
          run_td: offenseStats[player.match_player.id!]?.run_td || 0,
          fumble: offenseStats[player.match_player.id!]?.fumble || 0,
        },
      }));
    },
  );

export const selectAllPlayersWithOffenseStatsTeamA =
  selectAllPlayersWithOffenseStats(
    (match: IMatchWithFullData) => match.match.team_a_id,
  );

export const selectAllPlayersWithOffenseStatsTeamB =
  selectAllPlayersWithOffenseStats(
    (match: IMatchWithFullData) => match.match.team_b_id,
  );
