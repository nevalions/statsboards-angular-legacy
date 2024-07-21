import { IPlayerInMatchFullData } from '../../../../type/player.type';
import { createSelector } from '@ngrx/store';
import { selectAllMatchFootballEvents } from './reducers';
import { selectAllPlayersInMatchFullData } from '../../../player-match/store/reducers';
import { IFootballEventWithPlayers } from '../../../../type/football-event.type';
import { selectCurrentMatchWithFullData } from '../../../match-with-full-data/store/reducers';

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

    return footballEvents.map((event) => {
      return {
        ...event,
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
        sack_player: getMatchPlayerById(matchPlayers, event.sack_player),
        kick_player: getMatchPlayerById(matchPlayers, event.kick_player),
        punt_player: getMatchPlayerById(matchPlayers, event.punt_player),
        event_hash: event.event_hash
          ? { value: event.event_hash.toLowerCase() }
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
