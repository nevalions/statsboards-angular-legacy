import { createSelector } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import {
  IPlayerInMatchFullData,
  IPlayerInTeamTournamentFullData,
} from '../../../type/player.type';
import { selectCurrentMatchWithFullData } from '../../match-with-full-data/store/reducers';
import {
  selectAllAwayPlayersInTeamTournamentWithPerson,
  selectAllHomePlayersInTeamTournamentWithPerson,
} from '../../player-team-tournament/store/reducers';
import { selectAllPlayersInMatchFullData } from './reducers';

export const selectHomeTeamRoster = createSelector(
  selectAllPlayersInMatchFullData,
  selectCurrentMatchWithFullData,
  (players, match) => {
    if (players && match) {
      const homeRoster = players.filter(
        (player) => player.match_player.team_id === match.match.team_a_id,
      );
      console.log('homeRoster', homeRoster);
      return SortService.sort(homeRoster, 'match_player.match_number');
    }
    return [];
  },
);

export const selectAwayTeamRoster = createSelector(
  selectAllPlayersInMatchFullData,
  selectCurrentMatchWithFullData,
  (players, match) => {
    if (players && match) {
      const awayRoster = players.filter(
        (player) => player.match_player.team_id === match.match.team_b_id,
      );
      return SortService.sort(awayRoster, 'match_player.match_number');
    }
    return [];
  },
);

export const selectAvailableHomePlayers = createSelector(
  selectAllHomePlayersInTeamTournamentWithPerson,
  selectHomeTeamRoster,
  (
    teamPlayers: IPlayerInTeamTournamentFullData[],
    matchPlayers: IPlayerInMatchFullData[],
  ) => {
    if (!matchPlayers) {
      return teamPlayers;
    }
    const matchPlayersIds = matchPlayers.map(
      (matchPlayer) => matchPlayer.match_player.player_team_tournament_id,
    );

    if (teamPlayers && matchPlayers) {
      const availablePlayersInTeam = teamPlayers.filter(
        (players) =>
          !matchPlayersIds.includes(players.player_team_tournament?.id),
      );
      return SortService.sort(availablePlayersInTeam, 'person.second_name');
    }
    return [];
  },
);

export const selectAvailableAwayPlayers = createSelector(
  selectAllAwayPlayersInTeamTournamentWithPerson,
  selectAwayTeamRoster,
  (
    teamPlayers: IPlayerInTeamTournamentFullData[],
    matchPlayers: IPlayerInMatchFullData[],
  ) => {
    if (!matchPlayers) {
      return teamPlayers;
    }
    const matchPlayersIds = matchPlayers.map(
      (matchPlayer) => matchPlayer.match_player.player_team_tournament_id,
    );

    if (teamPlayers && matchPlayers) {
      const availablePlayersInTeam = teamPlayers.filter(
        (players) =>
          !matchPlayersIds.includes(players.player_team_tournament?.id),
      );
      return SortService.sort(availablePlayersInTeam, 'person.second_name');
    }
    return [];
  },
);
