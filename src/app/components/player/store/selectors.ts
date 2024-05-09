import { createSelector } from '@ngrx/store';
import { selectAllPersons } from '../../person/store/reducers';
import {
  selectAllPlayers,
  selectAllSportPlayers,
  selectCurrentPlayerId,
} from './reducers';
import { IPlayer, IPlayerInSport } from '../../../type/player.type';
import { IPerson } from '../../../type/person.type';
import { SortService } from '../../../services/sort.service';

// Helper function to combine player with person data
function combinePlayerWithPerson(
  persons: IPerson[],
  player: IPlayer,
): IPlayerInSport {
  const person = persons.find((p) => p.id === player.person_id) || null;
  return { player, person };
}

// Selector that uses the helper function to combine an array of players with persons
export const selectAllPlayersWithPersons = createSelector(
  selectAllPersons,
  selectAllPlayers,
  (persons, players) =>
    players.map((player) => combinePlayerWithPerson(persons, player)),
);

// Similar selector for sports players
export const selectAllSportPlayersWithPersons = createSelector(
  selectAllPersons,
  selectAllSportPlayers,
  (persons, players): IPlayerInSport[] | [] => {
    if (persons && players) {
      const playersWithPersons = players.map((player) =>
        combinePlayerWithPerson(persons, player),
      );

      return SortService.sort(playersWithPersons, 'person.second_name');
    } else {
      return [];
    }
  },
);

// Selector to get available persons (persons not already selected as sport players)
export const selectAvailablePersonsForSport = createSelector(
  selectAllPersons,
  selectAllSportPlayersWithPersons,
  (allPersons: IPerson[], sportPlayersWithPersons) => {
    const playersPersonIds = sportPlayersWithPersons.map(
      (playerWithPerson) => playerWithPerson.person?.id,
    );

    return allPersons.filter(
      (person: IPerson) => !playersPersonIds.includes(person.id),
    );
  },
);

// Selector to find the current player and combine with person data
export const selectCurrentPlayerWithPerson = createSelector(
  selectAllPersons,
  selectAllPlayers,
  selectCurrentPlayerId,
  (persons, players, currentPlayerId): IPlayerInSport | null | undefined => {
    const currentPlayer = players.find(
      (player) => player.id === currentPlayerId,
    );
    return currentPlayer
      ? combinePlayerWithPerson(persons, currentPlayer)
      : null;
  },
);
