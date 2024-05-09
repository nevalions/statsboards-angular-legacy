import {
  IPlayerInSport,
  IPlayerInTeamTournament,
  IPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from '../../../type/player.type';
import { IPosition } from '../../../type/position.type';
import { createSelector } from '@ngrx/store';
import {
  selectAllPositions,
  selectAllSportPositions,
} from '../../position/store/reducers';
import {
  selectAllPlayersInTeamTournament,
  selectAllPlayersInTournament,
  selectCurrentPlayerInTeamTournamentId,
} from './reducers';
import { SortService } from '../../../services/sort.service';
import { selectAllSportPlayersWithPersons } from '../../player/store/selectors';
import { selectCurrentTournamentId } from '../../tournament/store/reducers';

function combinePlayerWithPersonWithPosition(
  // persons: IPerson[],
  // players: IPlayer[],
  playersInSport: IPlayerInSport[],
  playerInTeamTournament: IPlayerInTeamTournament,
  positions: IPosition[],
): IPlayerInTeamTournamentWithPersonWithSportWithPosition | null {
  // const player = players.find((p) => p.id === playerInTeamTournament.player_id);
  // const person = playersInSport.find((p) => p.player.id === player!.person_id);
  const playerInSport = playersInSport.find(
    (p) => p.player.id === playerInTeamTournament.player_id,
  );
  const position =
    positions.find((pos) => pos.id === playerInTeamTournament.position_id) ||
    null;

  // if (player && person && playerInTeamTournament) {
  return {
    // player: player!,
    // person: person!,
    playerInSport: playerInSport!,
    playerInTeamTournament: playerInTeamTournament,
    position: position,
  };
  // } else {
  //   return null;
  // }
}

// Selector that uses the helper function to combine an array of players with persons
export const selectAllPlayersInTeamTournamentWithPersonsWithPositions =
  createSelector(
    // selectAllPersons,
    // selectAllSportPlayers,
    selectAllSportPlayersWithPersons,
    selectAllPlayersInTeamTournament,
    selectAllSportPositions,
    (
      // persons,
      // players,
      playersInSport,
      playersInTeamTournament,
      positions,
    ) => {
      if (playersInSport && playersInTeamTournament) {
        const playersWithPersons = playersInTeamTournament.map(
          (playerInTeamTournament) =>
            combinePlayerWithPersonWithPosition(
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
        return combinePlayerWithPersonWithPosition(
          playersInSport,
          currentPlayer!,
          positions,
        );
      } else {
        return null;
      }
    },
  );

export const selectAvailablePlayersForTeamTournament = createSelector(
  selectAllSportPlayersWithPersons,
  selectAllPlayersInTournament,
  selectCurrentTournamentId,
  (
    allSportPlayers: IPlayerInSport[],
    teamTournamentPlayers: IPlayerInTeamTournament[],
    currentTournamentId: number | null | undefined,
  ) => {
    // console.log(
    //   'all',
    //   allSportPlayers,
    //   teamTournamentPlayers,
    //   currentTournamentId,
    // );
    if (!currentTournamentId) {
      return [];
    }
    // console.log(allSportPlayers);
    // console.log(teamTournamentPlayers);
    if (teamTournamentPlayers.length === 0) {
      return [];
    }
    if (teamTournamentPlayers.length > 0) {
      const playersInThisTournamentIds = teamTournamentPlayers
        .filter(
          (playerInTournament) =>
            playerInTournament.tournament_id === currentTournamentId,
        )
        .map((playerInTournament) => playerInTournament.player_id);
      // console.log(playersInThisTournamentIds, currentTournamentId);
      // Filter out those players from the list of all sport players
      const availablePlayers: IPlayerInSport[] = allSportPlayers.filter(
        (sportPlayer) =>
          !playersInThisTournamentIds.includes(sportPlayer.player.id!),
      );
      console.log('availablePlayers', availablePlayers);
      return availablePlayers;
    }
    return allSportPlayers;
  },
);
