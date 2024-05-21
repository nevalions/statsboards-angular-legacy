import { createSelector } from '@ngrx/store';
import { SortService } from '../../../services/sort.service';
import {
  IPlayerInSport,
  IPlayerInTeamTournament,
  IPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from '../../../type/player.type';
import { IPosition } from '../../../type/position.type';
import { ITeam } from '../../../type/team.type';
import { selectAllSportPlayersWithPersons } from '../../player/store/selectors';
import {
  selectAllPositions,
  selectAllSportPositions,
} from '../../position/store/reducers';
import { selectAllTeamsInTournament } from '../../team/store/reducers';
import { selectCurrentTournamentId } from '../../tournament/store/reducers';
import {
  selectAllPlayersInTeamTournament,
  selectAllPlayersInTournament,
  selectCurrentPlayerInTeamTournamentId,
} from './reducers';

function combinePlayerWithPersonWithPositionWithTeam(
  playersInSport: IPlayerInSport[],
  playerInTeamTournament: IPlayerInTeamTournament,
  positions: IPosition[] = [],
  teams: ITeam[] = [],
): IPlayerInTeamTournamentWithPersonWithSportWithPosition | null {
  const playerInSport = playersInSport.find(
    (p) => p.player.id === playerInTeamTournament.player_id,
  );
  const position =
    positions.find((pos) => pos.id === playerInTeamTournament.position_id) ||
    null;
  const team =
    teams.find((team) => team.id === playerInTeamTournament.team_id) || null;
  return {
    playerInSport: playerInSport!,
    playerInTeamTournament: playerInTeamTournament,
    position: position,
    team: team,
  };
}

// Selector that uses the helper function to combine an array of players with persons
export const selectAllPlayersInTeamTournamentWithPersonsWithPositions =
  createSelector(
    selectAllSportPlayersWithPersons,
    selectAllPlayersInTeamTournament,
    selectAllSportPositions,
    (playersInSport, playersInTeamTournament, positions) => {
      if (playersInSport && playersInTeamTournament) {
        const playersWithPersons = playersInTeamTournament.map(
          (playerInTeamTournament) =>
            combinePlayerWithPersonWithPositionWithTeam(
              playersInSport,
              playerInTeamTournament,
              positions,
            ),
        );
        if (playersInSport && playersInTeamTournament) {
          return SortService.sort(
            playersWithPersons,
            'playerInSport.person.second_name',
          );
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
  );

export const selectAllPlayersInTournamentWithPersonsWithPositions =
  createSelector(
    selectAllSportPlayersWithPersons,
    selectAllPlayersInTournament,
    selectAllSportPositions,
    selectAllTeamsInTournament,
    (playersInSport, playersInTeamTournament, positions, teams) => {
      if (playersInSport && playersInTeamTournament) {
        const playersWithPersons = playersInTeamTournament.map(
          (playerInTeamTournament) =>
            combinePlayerWithPersonWithPositionWithTeam(
              playersInSport,
              playerInTeamTournament,
              positions,
              teams,
            ),
        );
        if (playersInSport && playersInTeamTournament) {
          const sorted: IPlayerInTeamTournamentWithPersonWithSportWithPosition[] =
            SortService.sort(
              playersWithPersons,
              'playerInSport.person.second_name',
            );
          // console.log(sorted);
          return sorted;
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
  );

export const selectCurrentPlayerInTeamTournamentWithPersonWithSportWithPosition =
  createSelector(
    selectAllSportPlayersWithPersons,
    selectAllPlayersInTeamTournament,
    selectCurrentPlayerInTeamTournamentId,
    selectAllPositions,
    (
      playersInSport: IPlayerInSport[],
      playersInTeamTournament: IPlayerInTeamTournament[],
      currentPlayerId: number | null | undefined,
      positions: IPosition[],
    ):
      | IPlayerInTeamTournamentWithPersonWithSportWithPosition
      | null
      | undefined => {
      if (playersInTeamTournament.length === 0) {
        return null;
      }
      if (
        playersInSport &&
        playersInTeamTournament &&
        currentPlayerId &&
        positions
      ) {
        const currentPlayer = playersInTeamTournament.find(
          (player) => player.id === currentPlayerId,
        );
        return combinePlayerWithPersonWithPositionWithTeam(
          playersInSport,
          currentPlayer!,
          positions,
        );
      } else {
        return null;
      }
    },
  );

export const selectAvailablePlayersForTournament = createSelector(
  selectAllSportPlayersWithPersons,
  selectAllPlayersInTournament,
  selectCurrentTournamentId,
  (
    allSportPlayers: IPlayerInSport[],
    teamTournamentPlayers: IPlayerInTeamTournament[],
    currentTournamentId: number | null | undefined,
  ) => {
    if (!currentTournamentId) {
      return [];
    }

    const playersInThisTournamentIds = teamTournamentPlayers
      .filter(
        (playerInTournament) =>
          playerInTournament.tournament_id === currentTournamentId,
      )
      .map((playerInTournament) => playerInTournament.player_id);
    const availablePlayers: IPlayerInSport[] = allSportPlayers.filter(
      (sportPlayer) =>
        !playersInThisTournamentIds.includes(sportPlayer.player.id!),
    );
    // console.log('availablePlayers', availablePlayers);
    return availablePlayers;
  },
);

export const selectAvailableSportPlayersForTeamTournament = createSelector(
  selectAllSportPlayersWithPersons, // All players in the sport
  selectAllPlayersInTournamentWithPersonsWithPositions, // All players in the current tournament
  selectCurrentTournamentId, // The current tournament ID
  (
    allSportPlayers: IPlayerInSport[],
    allTournamentPlayers: IPlayerInTeamTournamentWithPersonWithSportWithPosition[],
    currentTournamentId: number | null | undefined,
  ) => {
    if (!currentTournamentId) {
      return [];
    }

    const playerIdsInTeams = new Set<number>(
      allTournamentPlayers
        .filter(
          (player) =>
            player.playerInTeamTournament.team_id === null &&
            player.playerInTeamTournament.tournament_id === currentTournamentId,
        )
        .map((player) => {
          // console.log('player', player);
          return player.playerInTeamTournament.player_id!;
        }),
    );

    return allSportPlayers.filter(
      (sportPlayer) =>
        sportPlayer.player.id && // Player has an ID
        playerIdsInTeams.has(sportPlayer.player.id),
    );
  },
);

export const selectAvailableTournamentPlayersForTeamTournament = createSelector(
  selectAllPlayersInTournamentWithPersonsWithPositions, // All players in the sport
  selectAllPlayersInTournamentWithPersonsWithPositions, // All players in the current tournament
  selectCurrentTournamentId, // The current tournament ID
  (
    allTournamentPlayer: IPlayerInTeamTournamentWithPersonWithSportWithPosition[],
    allTeamTournamentPlayers: IPlayerInTeamTournamentWithPersonWithSportWithPosition[],
    currentTournamentId: number | null | undefined,
  ) => {
    if (!currentTournamentId) {
      return [];
    }

    const playerIdsInTeams = new Set<number>(
      allTeamTournamentPlayers
        .filter(
          (player) =>
            player.playerInTeamTournament.team_id === null &&
            player.playerInTeamTournament.tournament_id === currentTournamentId,
        )
        .map((player) => {
          // console.log('player', player);
          return player.playerInTeamTournament.player_id!;
        }),
    );

    return allTournamentPlayer.filter(
      (sportPlayer) =>
        sportPlayer.playerInTeamTournament.player_id && // Player has an ID
        playerIdsInTeams.has(sportPlayer.playerInTeamTournament.player_id),
    );
  },
);
