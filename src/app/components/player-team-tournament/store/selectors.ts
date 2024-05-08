import { IPerson } from '../../../type/person.type';
import {
  IPlayer,
  IPlayerInTeamTournament,
  IPlayerInTeamTournamentWithPersonWithSportWithPosition,
} from '../../../type/player.type';
import { IPosition } from '../../../type/position.type';
import { createSelector } from '@ngrx/store';
import { selectAllPersons } from '../../person/store/reducers';
import {
  selectAllPlayers,
  selectAllSportPlayers,
} from '../../player/store/reducers';
import {
  selectAllPositions,
  selectAllSportPositions,
} from '../../position/store/reducers';
import {
  selectAllPlayersInTeamTournament,
  selectCurrentPlayerInTeamTournamentId,
} from './reducers';
import { SortService } from '../../../services/sort.service';

function combinePlayerWithPersonWithPosition(
  persons: IPerson[],
  players: IPlayer[],
  playerInTeamTournament: IPlayerInTeamTournament,
  positions: IPosition[],
): IPlayerInTeamTournamentWithPersonWithSportWithPosition | null {
  const player = players.find((p) => p.id === playerInTeamTournament.player_id);
  const person = persons.find((p) => p.id === player!.person_id);
  const position =
    positions.find((pos) => pos.id === playerInTeamTournament.position_id) ||
    null;

  // if (player && person && playerInTeamTournament) {
  return {
    player: player!,
    person: person!,
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
    selectAllPersons,
    selectAllSportPlayers,
    selectAllPlayersInTeamTournament,
    selectAllSportPositions,
    (persons, players, playersInTeamTournament, positions) => {
      const playersWithPersons = playersInTeamTournament.map(
        (playerInTeamTournament) =>
          combinePlayerWithPersonWithPosition(
            persons,
            players,
            playerInTeamTournament,
            positions,
          ),
      );
      return SortService.sort(playersWithPersons, 'person.second_name');
    },
  );

export const selectCurrentPlayerInTeamTournamentWithPersonWithSportWithPosition =
  createSelector(
    selectAllPersons,
    selectAllSportPlayers,
    selectAllPlayersInTeamTournament,
    selectCurrentPlayerInTeamTournamentId,
    selectAllPositions,
    (
      persons: IPerson[],
      players: IPlayer[],
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
      const currentPlayer = playersInTeamTournament.find(
        (player) => player.id === currentPlayerId,
      );
      return currentPlayer
        ? combinePlayerWithPersonWithPosition(
            persons,
            players,
            currentPlayer,
            positions,
          )
        : null;
    },
  );
